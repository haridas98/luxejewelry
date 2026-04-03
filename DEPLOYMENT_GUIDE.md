# 🚀 Complete Deployment Guide - Jewelry Store

## 📋 Table of Contents
1. [Local Development with Docker](#local-development)
2. [Push to GitHub](#push-to-github)
3. [Server Deployment with DuckDNS](#server-deployment)
4. [DuckDNS Domain Setup](#duckdns-setup)

---

## 🐳 Local Development with Docker

### Quick Start (Development Mode)

```bash
# Start everything in development mode with hot-reload
docker-compose --profile development up --build
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Django Admin: http://localhost:3000/admin/

### Development Workflow

```bash
# Start only backend and database (for backend development)
docker-compose up backend db

# Start only frontend with hot-reload (for frontend development)
docker-compose --profile development up frontend-dev

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all containers
docker-compose down
```

### Useful Docker Commands

```bash
# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Run migrations
docker-compose exec backend python manage.py migrate

# Import products from Excel
docker-compose exec backend python manage.py import_from_excel

# Open Django shell
docker-compose exec backend python manage.py shell

# Access backend container
docker-compose exec backend sh

# View all containers
docker-compose ps

# Rebuild after code changes
docker-compose up -d --build
```

---

## 📤 Push to GitHub

### Initial Setup (Already Done)

Your repo is already connected to: `https://github.com/haridas98/luxejewelry`

### Push Changes

```bash
# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

### If You Get Errors

```bash
# If you have uncommitted changes
git stash

# Pull latest changes
git pull origin main

# Restore stashed changes
git stash pop

# Then commit and push
git add .
git commit -m "Your message"
git push origin main
```

### .gitignore Already Covers:
- ✅ `node_modules/`
- ✅ `__pycache__/`, `venv/`
- ✅ `.env` files (secrets safe!)
- ✅ `db.sqlite3`, `media/`, `staticfiles/`
- ✅ IDE files (`.vscode/`, `.idea/`)

---

## 🖥️ Server Deployment with DuckDNS

### Prerequisites on Server

1. **Install Docker & Docker Compose** (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect
```

2. **Verify Installation:**
```bash
docker --version
docker-compose --version
```

### Step 1: Clone Your Repository

```bash
# SSH to your server
ssh user@your-server-ip

# Clone the repo
git clone https://github.com/haridas98/luxejewelry.git
cd jewelry
```

### Step 2: Create Production Environment File

Create `.env` file in project root:

```bash
nano .env
```

**Content:**
```env
# Backend
DEBUG=0
SECRET_KEY=your-super-secret-key-min-50-chars-random
DATABASE_URL=postgresql://jewelry:jewelry123@db:5432/jewelry

# Database
POSTGRES_DB=jewelry
POSTGRES_USER=jewelry
POSTGRES_PASSWORD=jewelry123

# Frontend
REACT_APP_API_URL=https://your-domain.duckdns.org
```

**Generate a secret key:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Step 3: Update docker-compose.yml for Production

Edit the `docker-compose.yml` to remove development profile:

```bash
nano docker-compose.yml
```

**Changes needed:**
1. Remove `frontend-dev` service (development only)
2. Update frontend to use production build
3. Enable PostgreSQL (remove from profiles)

**Production-ready docker-compose.yml:**
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
      - DEBUG=0
      - SECRET_KEY=${SECRET_KEY}
      - DATABASE_URL=postgresql://jewelry:${POSTGRES_PASSWORD}@db:5432/jewelry
    command: >
      sh -c "python manage.py migrate &&
             python manage.py collectstatic --noinput &&
             gunicorn --bind 0.0.0.0:8000 --workers 3 jewelry_store.wsgi:application"
    depends_on:
      - db
    restart: always

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=jewelry
      - POSTGRES_USER=jewelry
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    restart: always

volumes:
  postgres_data:
  static_volume:
  media_volume:
```

### Step 4: Create Production Frontend Dockerfile

Create `frontend/Dockerfile.prod`:

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app
COPY --from=build /app/build /usr/share/nginx/html

# Copy SSL certificates (will be created by certbot)
# COPY ./ssl /etc/ssl/certs

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
```

### Step 5: Create Nginx Configuration

Create `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name your-domain.duckdns.org;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

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

### Step 6: Build and Run

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 7: Create Superuser

```bash
docker-compose exec backend python manage.py createsuperuser
```

### Step 8: Import Products (if needed)

```bash
# Upload your SILVER.xlsx to server first
scp SILVER.xlsx user@server:/path/to/jewelry/

# Then import
docker-compose exec backend python manage.py import_from_excel
```

---

## 🌐 DuckDNS Domain Setup

### Step 1: Register Domain

1. Go to https://www.duckdns.org
2. Login with GitHub account
3. Add a domain: `yourname.duckdns.org`
4. Note the domain name

### Step 2: Install DuckDNS Updater on Server

```bash
# Create directory
mkdir -p ~/duckdns
cd ~/duckdns

# Create token file
echo "your-domain.duckdns.org" > duck.conf

# Create update script
nano duck.sh
```

**Content for duck.sh:**
```bash
#!/bin/bash

# Get your token from DuckDNS dashboard
TOKEN="your-token-here"
DOMAIN="your-domain.duckdns.org"

# Update IP
curl -k "https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&ip="
```

```bash
# Make executable
chmod +x duck.sh

# Test
./duck.sh
```

### Step 3: Auto-update with Cron

```bash
# Edit crontab
crontab -e

# Add line to update every 5 minutes
*/5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1
```

### Step 4: Update Project Configuration

In your `.env` file, set:
```env
REACT_APP_API_URL=https://your-domain.duckdns.org
```

Rebuild:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 🔒 SSL/HTTPS Setup (Optional but Recommended)

### Using Certbot with Let's Encrypt

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d your-domain.duckdns.org

# Certificates will be at:
# /etc/letsencrypt/live/your-domain.duckdns.org/
```

### Update Nginx Config for HTTPS

```nginx
server {
    listen 80;
    server_name your-domain.duckdns.org;
    return 301 https://$server_name$request_uri;
}

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
}
```

---

## 📊 Monitoring & Maintenance

### Check Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f db
docker-compose logs -f frontend
```

### Backup Database
```bash
# PostgreSQL backup
docker-compose exec db pg_dump -U jewelry jewelry > backup_$(date +%Y%m%d).sql

# SQLite backup (if using)
docker-compose exec backend cp /app/db.sqlite3 ./backup_$(date +%Y%m%d).sqlite3
```

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific
docker-compose restart backend
```

### Stop Everything
```bash
docker-compose down

# With volume removal (WARNING: deletes data!)
docker-compose down -v
```

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Find what's using port 80
sudo lsof -i :80

# Or change port in docker-compose.yml
ports:
  - "8080:80"  # Use 8080 instead
```

### Database Connection Error
```bash
# Check db is running
docker-compose ps db

# Check logs
docker-compose logs db

# Restart db
docker-compose restart db
```

### Frontend Can't Connect to Backend
1. Check backend is running: `docker-compose ps backend`
2. Check network: `docker network ls`
3. Verify proxy_pass in nginx.conf points to `http://backend:8000`

### Static Files Not Loading
```bash
# Collect static files again
docker-compose exec backend python manage.py collectstatic --noinput

# Check volume mounts
docker-compose exec backend ls -la /app/staticfiles
```

### Permission Issues
```bash
# Fix media folder permissions
sudo chown -R 1000:1000 backend/media
sudo chmod -R 755 backend/media
```

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Start locally | `docker-compose up --build` |
| Start production | `docker-compose --profile production up -d` |
| Stop | `docker-compose down` |
| View logs | `docker-compose logs -f` |
| Create admin | `docker-compose exec backend python manage.py createsuperuser` |
| Push to GitHub | `git add . && git commit -m "msg" && git push` |
| Update server | `git pull && docker-compose down && docker-compose build && docker-compose up -d` |
| Backup DB | `docker-compose exec db pg_dump -U jewelry jewelry > backup.sql` |

---

## ✅ Pre-deployment Checklist

- [ ] DuckDNS domain registered and updating
- [ ] Server has Docker & Docker Compose installed
- [ ] `.env` file created with production values
- [ ] `SECRET_KEY` is long and random (50+ chars)
- [ ] `DEBUG=0` in production
- [ ] Database passwords changed from defaults
- [ ] Frontend `REACT_APP_API_URL` points to DuckDNS domain
- [ ] Superuser created
- [ ] Products imported (if needed)
- [ ] SSL certificate installed (recommended)
- [ ] Firewall allows ports 80, 443, 22 (SSH)

---

**Good luck with your deployment! 🎉**
