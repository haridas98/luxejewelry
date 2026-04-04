# Запуск проекта в Docker

## Разработка (Development)

### 1. Запустить только бэкенд (Django)
```bash
docker-compose up backend
```

Бэкенд будет доступен на: http://localhost:8000
Admin panel: http://localhost:8000/admin/

### 2. Запустить фронтенд с hot-reload
```bash
docker-compose --profile development up frontend-dev
```

Фронтенд будет доступен на: http://localhost:3000

### 3. Запустить всё вместе
```bash
# В одном терминале - бэкенд
docker-compose up backend

# В другом терминале - фронтенд
docker-compose --profile development up frontend-dev
```

---

## Продакшен (Production)

### Собрать и запустить
```bash
docker-compose --profile production up --build
```

Фронтенд: http://localhost:3000
Бэкенд API: http://localhost:3000/api/
Admin panel: http://localhost:3000/admin/

---

## Остановка

```bash
# Остановить все контейнеры
docker-compose down

# Остановить с удалением volumes (для чистой установки)
docker-compose down -v
```

---

## База данных

В development режиме используется SQLite (файл `backend/db.sqlite3`).

Для production с PostgreSQL:
```bash
docker-compose -f docker-compose.prod.yml up --build
```

---

## Полезные команды

```bash
# Создать суперпользователя Django
docker-compose exec backend python manage.py createsuperuser

# Применить миграции
docker-compose exec backend python manage.py migrate

# Посмотреть логи
docker-compose logs -f backend
docker-compose logs -f frontend-dev

# Пересобрать образы
docker-compose build --no-cache
```

---

## Структура портов

| Сервис | Контейнер | Хост | Описание |
|--------|-----------|------|----------|
| Backend | 8000 | 8000 | Django API + Admin |
| Frontend (dev) | 3000 | 3000 | React с hot-reload |
| Frontend (prod) | 80 | 3000 | Nginx + React build |
