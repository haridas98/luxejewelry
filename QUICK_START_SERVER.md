# ⚡ Быстрый старт на сервере

## 🎯 2 способа развёртывания

---

## 📌 Способ 1: Автоматический (рекомендуется)

### 1. Подключись к серверу:
```bash
ssh root@твой-server-ip
```

### 2. Скачай скрипт:
```bash
cd /root
wget https://raw.githubusercontent.com/haridas98/luxejewelry/main/deploy.sh
chmod +x deploy.sh
```

### 3. Запусти:
```bash
bash deploy.sh
```

### 4. Введи данные:
- Твой DuckDNS домен (например: `myshop.duckdns.org`)
- Токен DuckDNS (из личного кабинета)
- Пароль для базы данных

### 5. Готово! 🎉

Магазин доступен по адресу: `http://твой-домен.duckdns.org`

---

## 📌 Способ 2: Ручной (по шагам)

Смотри полную инструкцию в файле **SERVER_DEPLOYMENT.md**

---

## 🔒 Настройка HTTPS (после развёртывания)

### 1. Установи Certbot:
```bash
apt install -y certbot
```

### 2. Получи сертификат:
```bash
certbot certonly --standalone -d твой-домен.duckdns.org
```

### 3. Обнови nginx.conf и пересобери:
```bash
cd /root/jewelry
# Отредактируй frontend/nginx.conf (добавь SSL)
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📊 Полезные команды

```bash
# Статус
docker-compose ps

# Логи
docker-compose logs -f

# Перезапуск
docker-compose restart

# Остановка
docker-compose down

# Запуск
docker-compose up -d

# Создать админа
docker-compose exec backend python manage.py createsuperuser

# Бэкап базы
docker-compose exec db pg_dump -U jewelry jewelry > backup.sql
```

---

## 🆘 Если что-то не работает

### Порт 80 занят:
```bash
# Остановить системный nginx
systemctl stop nginx
systemctl disable nginx
```

### Docker не работает:
```bash
# Перезапустить Docker
systemctl restart docker
```

### Контейнер упал:
```bash
# Посмотреть логи
docker-compose logs backend

# Перезапустить
docker-compose restart backend
```

---

## ✅ После развёртывания

1. ✅ Зайди на `http://твой-домен.duckdns.org`
2. ✅ Создай суперпользователя
3. ✅ Зайди в админку `/admin/`
4. ✅ Импортируй товары из Excel
5. ✅ Настрой HTTPS

---

**Вопросы? Смотри полную инструкцию в SERVER_DEPLOYMENT.md**
