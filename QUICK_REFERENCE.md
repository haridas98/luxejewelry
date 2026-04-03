# 🚀 Quick Reference - Jewelry Store Deployment

## Local Development (Windows/Linux/Mac)

### Start Everything
```bash
docker-compose up --build
```

### Access
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api/
- **Django Admin:** http://localhost:3000/admin/

### Common Commands
```bash
# Create superuser
docker-compose exec backend python manage.py createsuperuser

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Push to GitHub

```bash
git add .
git commit -m "Your message"
git push origin main
```

**Your repo:** https://github.com/haridas98/luxejewelry

---

## Server Deployment (Production)

### 1. On Server - Clone & Setup
```bash
git clone https://github.com/haridas98/luxejewelry.git
cd jewelry
cp .env.example .env
nano .env  # Update values!
```

### 2. Start Production
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 3. Create Admin
```bash
docker-compose exec backend python manage.py createsuperuser
```

---

## DuckDNS Setup

### 1. Register at https://www.duckdns.org
- Login with GitHub
- Add domain: `yourname.duckdns.org`

### 2. Install Updater on Server
```bash
mkdir -p ~/duckdns
cd ~/duckdns
echo "your-domain.duckdns.org" > duck.conf

# Create update script
nano ~/duckdns/duck.sh
```

**Content:**
```bash
#!/bin/bash
curl -k "https://www.duckdns.org/update?domains=your-domain&token=YOUR_TOKEN&ip="
```

```bash
chmod +x ~/duckdns/duck.sh

# Auto-update every 5 minutes
(crontab -l 2>/dev/null; echo "*/5 * * * * ~/duckdns/duck.sh") | crontab -
```

### 3. Update .env on Server
```env
REACT_APP_API_URL=https://your-domain.duckdns.org
```

### 4. Rebuild
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

---

## Environment Variables (.env)

```env
# Backend
DEBUG=0                    # 0 for production, 1 for dev
SECRET_KEY=50+ random chars
DATABASE_URL=postgresql://jewelry:PASSWORD@db:5432/jewelry

# Database
POSTGRES_DB=jewelry
POSTGRES_USER=jewelry
POSTGRES_PASSWORD=CHANGE_THIS

# Frontend
REACT_APP_API_URL=https://your-domain.duckdns.org
```

**Generate SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 80 in use | Change to 8080 in docker-compose |
| Database error | `docker-compose restart db` |
| Can't access frontend | Check `docker-compose ps` |
| Static files 404 | `docker-compose exec backend python manage.py collectstatic --noinput` |

---

## Backup Database

```bash
# PostgreSQL
docker-compose exec db pg_dump -U jewelry jewelry > backup.sql

# Restore
docker-compose exec -T db psql -U jewelry jewelry < backup.sql
```

---

## Update Application

```bash
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

---

## File Structure

```
jewelry/
├── backend/           # Django app
├── frontend/          # React app
├── docker-compose.yml           # Development
├── docker-compose.prod.yml      # Production
├── .env.example       # Template
├── DEPLOYMENT_GUIDE.md  # Full guide
└── QUICK_REFERENCE.md # This file
```
