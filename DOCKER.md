# 🐳 Docker развёртывание

## Быстрый старт

### 1. Production режим (backend + frontend + PostgreSQL)

```bash
docker-compose --profile production up -d --build
```

Доступ:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Admin: http://localhost:3000/admin/

### 2. Development режим (с hot reload)

```bash
# Backend отдельно
cd backend
python manage.py runserver

# Frontend в Docker
docker-compose --profile development up frontend-dev
```

Или всё в Docker:
```bash
docker-compose --profile development up -d --build
```

## Команды

### Запуск
```bash
docker-compose up -d --build
```

### Остановка
```bash
docker-compose down
```

### Полная очистка (удаление volumes)
```bash
docker-compose down -v
```

### Просмотр логов
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Выполнение команд в контейнере

#### Создать суперпользователя
```bash
docker-compose exec backend python manage.py createsuperuser
```

#### Миграции
```bash
docker-compose exec backend python manage.py migrate
```

#### Импорт товаров
```bash
docker-compose exec backend python manage.py import_from_excel
```

#### Python shell
```bash
docker-compose exec backend python manage.py shell
```

## Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# Backend
DEBUG=1
SECRET_KEY=your-super-secret-key-change-in-production
DATABASE_URL=sqlite:///db.sqlite3

# Database (PostgreSQL)
POSTGRES_DB=jewelry
POSTGRES_USER=jewelry
POSTGRES_PASSWORD=change-this-password

# Frontend
REACT_APP_API_URL=http://localhost:8000
```

## Production настройка

### 1. Измените docker-compose.yml

- Замените SQLite на PostgreSQL
- Установите `DEBUG=0`
- Измените пароли

### 2. Сборка образов

```bash
docker-compose -f docker-compose.yml build
```

### 3. Запуск

```bash
docker-compose up -d
```

### 4. Создание админа

```bash
docker-compose exec backend python manage.py createsuperuser
```

## Проблемы и решения

### Ошибка "port already in use"

Измените порты в docker-compose.yml:
```yaml
ports:
  - "8080:80"  # вместо 3000:80
```

### Ошибка миграций

```bash
docker-compose down -v
docker-compose up -d --build
```

### Frontend не видит backend

Проверьте что в frontend/nginx.conf правильный proxy_pass:
```
proxy_pass http://backend:8000;
```

### Медленная сборка

Используйте кэширование:
```bash
docker-compose build --no-cache
```

## Мониторинг

### Статус контейнеров
```bash
docker-compose ps
```

### Использование ресурсов
```bash
docker stats
```

### Доступ в контейнер
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
```

## Бэкап базы данных

### PostgreSQL
```bash
docker-compose exec db pg_dump -U jewelry jewelry > backup.sql
```

### Восстановление
```bash
docker-compose exec -T db psql -U jewelry jewelry < backup.sql
```

### SQLite
```bash
docker-compose exec backend cp /app/db.sqlite3 ./backup.sqlite3
```
