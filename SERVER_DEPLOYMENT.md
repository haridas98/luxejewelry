# 🚀 Развёртывание на сервере (VPS)

## 📋 Что у нас есть:
- **Сервер:** Selectel или Aeza (Ubuntu/Debian)
- **Домен:** DuckDNS (например `yourname.duckdns.org`)
- **Проект:** Jewelry Store (Django + React)

---

## 📝 Шаг 1: Подготовка сервера

### Подключись к серверу по SSH:
```bash
ssh root@твой-server-ip
```

### Обнови систему:
```bash
apt update && apt upgrade -y
```

### Установи Docker и Docker Compose:
```bash
# Устанавливаем Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Устанавливаем Docker Compose
apt install -y docker-compose

# Добавляем пользователя в группу docker (чтобы не нужен был sudo)
usermod -aG docker $USER

# Применяем изменения группы (или перелогинься)
newgrp docker
```

### Проверь установку:
```bash
docker --version
docker-compose --version
```

---

## 📝 Шаг 2: Клонирование проекта

```bash
# Клонируем репозиторий
git clone https://github.com/haridas98/luxejewelry.git
cd jewelry
```

---

## 📝 Шаг 3: Настройка окружения

### Создай файл `.env`:
```bash
nano .env
```

### Вставь содержимое (замени значения!):
```env
# Backend
DEBUG=0
SECRET_KEY=твоя-секретная-ключ-минимум-50-символов-случайных
DATABASE_URL=postgresql://jewelry:jewelry123@db:5432/jewelry

# Database
POSTGRES_DB=jewelry
POSTGRES_USER=jewelry
POSTGRES_PASSWORD=придумай-сложный-пароль

# Frontend (замени на свой DuckDNS домен)
REACT_APP_API_URL=https://your-domain.duckdns.org
```

**Важно:**
- `SECRET_KEY` — сгенерируй случайную строку 50+ символов
- `POSTGRES_PASSWORD` — придумай сложный пароль
- `your-domain.duckdns.org` — замени на свой реальный домен

### Сгенерировать SECRET_KEY можно так:
```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Или просто введи случайную строку типа:
```
SECRET_KEY=7x9k2m5p8q1w4e6r0t3y7u9i2o5a8s1d4f7g0h3j6l9z2x5c8v1b4n7m0
```

---

## 📝 Шаг 4: Настройка DuckDNS

### 1. Зарегистрируй домен на https://www.duckdns.org

- Войди через GitHub
- Создай домен: `yourname.duckdns.org`
- Скопируй токен (будет в личном кабинете)

### 2. Установи DuckDNS updater на сервер:

```bash
mkdir -p ~/duckdns
cd ~/duckdns

# Создай конфиг
echo "your-domain.duckdns.org" > duck.conf

# Создай скрипт обновления
nano duck.sh
```

### Вставь содержимое (замени TOKEN на свой из DuckDNS):
```bash
#!/bin/bash

# Твой токен из DuckDNS
TOKEN="твой-токен-из-личного-кабинета"
DOMAIN="your-domain.duckdns.org"

# Обновляем IP
curl -k "https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&ip="
```

### Сделай скрипт исполняемым и протестируй:
```bash
chmod +x duck.sh
./duck.sh
```

Должно ответить `OK`

### 3. Добавь в cron для автообновления (каждые 5 минут):
```bash
crontab -e
```

Добавь строку:
```
*/5 * * * * /root/duckdns/duck.sh >/dev/null 2>&1
```

---

## 📝 Шаг 5: Production Docker Compose

### Создай production конфиг:
```bash
nano docker-compose.prod.yml
```

### Вставь содержимое:
```yaml
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
      - DEBUG=${DEBUG:-0}
      - SECRET_KEY=${SECRET_KEY}
      - DATABASE_URL=postgresql://jewelry:${POSTGRES_PASSWORD}@db:5432/jewelry
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
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
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
```

---

## 📝 Шаг 6: Production Frontend Dockerfile

### Создай файл:
```bash
nano frontend/Dockerfile.prod
```

### Вставь содержимое:
```dockerfile
# Production Frontend Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy project
COPY . .

# Build React app
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## 📝 Шаг 7: Nginx конфигурация

### Создай файл:
```bash
nano frontend/nginx.conf
```

### Вставь содержимое (замени домен!):
```nginx
server {
    listen 80;
    server_name your-domain.duckdns.org;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin/ {
        proxy_pass http://backend:8000/admin/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /app/staticfiles/;
    }

    location /media/ {
        alias /app/media/;
    }
}
```

---

## 📝 Шаг 8: Запуск проекта

### Запусти Docker Compose:
```bash
cd ~/jewelry

# Сборка и запуск
docker-compose -f docker-compose.prod.yml up -d --build
```

### Проверь статус:
```bash
docker-compose ps
```

Должно быть 3 контейнера в статусе `Up`:
- `jewelry-backend-1`
- `jewelry-db-1`
- `jewelry-frontend-1`

### Посмотри логи:
```bash
docker-compose logs -f
```

---

## 📝 Шаг 9: Создание суперпользователя

```bash
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

Введи:
- Email
- Пароль

Теперь можешь войти в админку: `http://твой-server-ip/admin/`

---

## 📝 Шаг 10: Импорт товаров (если нужно)

### Загрузи Excel файл на сервер:
```bash
# На локальной машине:
scp SILVER.xlsx root@твой-server-ip:/root/jewelry/
```

### Импортируй:
```bash
docker-compose -f docker-compose.prod.yml exec backend python manage.py import_from_excel
```

---

## 🔒 Шаг 11: Настройка HTTPS (SSL сертификат)

### Установи Certbot:
```bash
apt install -y certbot python3-certbot-nginx
```

### Получи сертификат:
```bash
certbot certonly --standalone -d your-domain.duckdns.org
```

Следуй инструкциям (введи email, согласись с условиями).

Сертификаты сохранятся в:
```
/etc/letsencrypt/live/your-domain.duckdns.org/
```

### Обнови nginx.conf:
```bash
nano frontend/nginx.conf
```

### Вставь обновлённую конфигурацию:
```nginx
# HTTP - перенаправление на HTTPS
server {
    listen 80;
    server_name your-domain.duckdns.org;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl;
    server_name your-domain.duckdns.org;

    ssl_certificate /etc/letsencrypt/live/your-domain.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.duckdns.org/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin/ {
        proxy_pass http://backend:8000/admin/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /app/staticfiles/;
    }

    location /media/ {
        alias /app/media/;
    }
}
```

### Пересобери и перезапусти:
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

Теперь сайт доступен по **HTTPS**: `https://your-domain.duckdns.org`

---

## 📊 Полезные команды

### Проверить статус:
```bash
docker-compose ps
```

### Посмотреть логи:
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Перезапустить:
```bash
docker-compose restart
```

### Остановить:
```bash
docker-compose down
```

### Обновить проект:
```bash
cd ~/jewelry
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Бэкап базы данных:
```bash
docker-compose exec db pg_dump -U jewelry jewelry > backup_$(date +%Y%m%d).sql
```

### Восстановление из бэкапа:
```bash
docker-compose exec -T db psql -U jewelry jewelry < backup_20260402.sql
```

---

## 🆘 Troubleshooting

### Порт 80 занят:
```bash
# Проверить что занимает порт 80
netstat -tlnp | grep :80

# Если занят nginx на хосте - останови его
systemctl stop nginx
systemctl disable nginx
```

### Контейнер не запускается:
```bash
# Посмотреть логи
docker-compose logs backend

# Проверить переменные окружения
docker-compose config
```

### Database connection error:
```bash
# Перезапустить базу
docker-compose restart db

# Проверить логи базы
docker-compose logs db
```

### Frontend не видит backend:
- Проверь что `nginx.conf` содержит `proxy_pass http://backend:8000`
- Проверь что backend запущен: `docker-compose ps backend`

---

## ✅ Чеклист после развёртывания

- [ ] DuckDNS домен работает (открывается в браузере)
- [ ] SSL сертификат установлен (HTTPS работает)
- [ ] Frontend открывается (https://your-domain.duckdns.org)
- [ ] Backend API отвечает (https://your-domain.duckdns.org/api/)
- [ ] Админка работает (https://your-domain.duckdns.org/admin/)
- [ ] Суперпользователь создан
- [ ] Товары импортированы (если нужно)
- [ ] Бэкап базы настроен

---

## 🎯 Готово!

Твой магазин работает на сервере с HTTPS!

**Адреса:**
-  Магазин: `https://your-domain.duckdns.org`
- 🔧 API: `https://your-domain.duckdns.org/api/`
- 📊 Админка: `https://your-domain.duckdns.org/admin/`
