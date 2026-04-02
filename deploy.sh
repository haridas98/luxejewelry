#!/bin/bash

# 🚀 Автоматическое развёртывание Jewelry Store на VPS
# Использование: bash deploy.sh

set -e

echo "🚀 Jewelry Store - Автоматическое развёртывание на VPS"
echo "======================================================="
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка что скрипт запущен от root
if [ "$EUID" -ne 0 ]; then 
    log_error "Пожалуйста, запусти от root (sudo bash deploy.sh)"
    exit 1
fi

# Ввод домена
echo ""
log_info "Введи свой DuckDNS домен (например: myshop.duckdns.org):"
read -p "> " DOMAIN

if [ -z "$DOMAIN" ]; then
    log_error "Домен не введён!"
    exit 1
fi

log_info "Домен: $DOMAIN"
echo ""

# Ввод токена DuckDNS
log_info "Введи токен DuckDNS (из личного кабинета на duckdns.org):"
read -s -p "> " DUCKDNS_TOKEN
echo ""

if [ -z "$DUCKDNS_TOKEN" ]; then
    log_error "Токен не введён!"
    exit 1
fi

echo ""

# Ввод пароля для базы данных
log_info "Придумай пароль для базы данных:"
read -s -p "> " DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    log_error "Пароль не введён!"
    exit 1
fi

echo ""

# Генерация SECRET_KEY
log_info "Генерирую SECRET_KEY..."
SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())" 2>/dev/null || echo "change-this-to-a-random-50-character-string-in-production")

echo ""
log_info "Начинаю установку..."

# Обновление системы
log_info "Обновляю систему..."
apt update && apt upgrade -y

# Установка Git
log_info "Устанавливаю Git..."
apt install -y git

# Установка Docker
log_info "Устанавливаю Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
else
    log_info "Docker уже установлен"
fi

# Установка Docker Compose
log_info "Устанавливаю Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    apt install -y docker-compose
else
    log_info "Docker Compose уже установлен"
fi

# Добавление пользователя в группу docker
log_info "Добавляю пользователя в группу docker..."
usermod -aG docker $SUDO_USER 2>/dev/null || usermod -aG docker root

echo ""

# Настройка DuckDNS
log_info "Настраиваю DuckDNS..."
mkdir -p /root/duckdns
cd /root/duckdns

echo "$DOMAIN" > duck.conf

cat > duck.sh << EOF
#!/bin/bash
TOKEN="$DUCKDNS_TOKEN"
DOMAIN="$DOMAIN"
curl -k "https://www.duckdns.org/update?domains=\$DOMAIN&token=\$TOKEN&ip="
EOF

chmod +x duck.sh

# Добавление в cron
if ! crontab -l | grep -q "duck.sh"; then
    (crontab -l 2>/dev/null; echo "*/5 * * * * /root/duckdns/duck.sh >/dev/null 2>&1") | crontab -
    log_info "DuckDNS updater добавлен в cron"
fi

# Тест DuckDNS
log_info "Тестирую DuckDNS..."
./duck.sh

echo ""

# Клонируем репозиторий (если ещё не клонирован)
if [ ! -d "/root/jewelry" ]; then
    log_info "Клонирую репозиторий..."
    git clone https://github.com/haridas98/luxejewelry.git /root/jewelry
else
    log_info "Репозиторий уже существует, обновляю..."
    cd /root/jewelry
    git pull origin main
fi

cd /root/jewelry

# Создание .env файла
log_info "Создаю .env файл..."
cat > .env << EOF
# Backend
DEBUG=0
SECRET_KEY=$SECRET_KEY
DATABASE_URL=postgresql://jewelry:$DB_PASSWORD@db:5432/jewelry

# Database
POSTGRES_DB=jewelry
POSTGRES_USER=jewelry
POSTGRES_PASSWORD=$DB_PASSWORD

# Frontend
REACT_APP_API_URL=https://$DOMAIN
EOF

# Создание production nginx.conf
log_info "Создаю nginx.conf..."
cat > frontend/nginx.conf << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /admin/ {
        proxy_pass http://backend:8000/admin/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /static/ {
        alias /app/staticfiles/;
    }

    location /media/ {
        alias /app/media/;
    }
}
EOF

# Создание production Dockerfile для frontend
log_info "Создаю Dockerfile.prod..."
cat > frontend/Dockerfile.prod << 'EOF'
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

# Создание production docker-compose
log_info "Создаю docker-compose.prod.yml..."
cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    volumes:
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    environment:
      - DEBUG=\${DEBUG:-0}
      - SECRET_KEY=\${SECRET_KEY}
      - DATABASE_URL=postgresql://jewelry:\${POSTGRES_PASSWORD}@db:5432/jewelry
    command: >
      sh -c "python manage.py migrate &&
             python manage.py collectstatic --noinput &&
             gunicorn --bind 0.0.0.0:8000 --workers 3 jewelry_store.wsgi:application"
    depends_on:
      - db
    restart: always
    networks:
      - jewelry-network

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=jewelry
      - POSTGRES_USER=jewelry
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
    restart: always
    networks:
      - jewelry-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always
    networks:
      - jewelry-network

volumes:
  postgres_data:
  static_volume:
  media_volume:

networks:
  jewelry-network:
    name: jewelry-network
EOF

echo ""
log_info "Запускаю Docker Compose..."

cd /root/jewelry
docker-compose -f docker-compose.prod.yml up -d --build

echo ""
log_info "Ожидаю запуск сервисов (30 секунд)..."
sleep 30

# Проверка статуса
log_info "Проверяю статус контейнеров..."
docker-compose ps

echo ""

# Предложение создать суперпользователя
echo ""
log_info "Хочешь создать суперпользователя прямо сейчас? (y/n)"
read -p "> " CREATE_SUPERUSER

if [ "$CREATE_SUPERUSER" = "y" ] || [ "$CREATE_SUPERUSER" = "Y" ]; then
    docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
fi

echo ""
echo "======================================================="
echo "✅ Развёртывание завершено!"
echo "======================================================="
echo ""
echo "📊 Твой магазин доступен по адресу:"
echo "   http://$DOMAIN"
echo ""
echo "🔧 Backend API:"
echo "   http://$DOMAIN/api/"
echo ""
echo "📊 Админка:"
echo "   http://$DOMAIN/admin/"
echo ""
echo "======================================================="
echo ""
echo "📝 Полезные команды:"
echo ""
echo "   # Посмотреть статус:"
echo "   docker-compose ps"
echo ""
echo "   # Посмотреть логи:"
echo "   docker-compose logs -f"
echo ""
echo "   # Перезапустить:"
echo "   docker-compose restart"
echo ""
echo "   # Остановить:"
echo "   docker-compose down"
echo ""
echo "   # Обновить проект:"
echo "   cd /root/jewelry"
echo "   git pull origin main"
echo "   docker-compose -f docker-compose.prod.yml down"
echo "   docker-compose -f docker-compose.prod.yml build --no-cache"
echo "   docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "======================================================="
echo ""
log_info "Готово! 🎉"
