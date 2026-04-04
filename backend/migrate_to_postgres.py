"""
Скрипт для переноса данных из SQLite в PostgreSQL
Запускать локально перед деплоем на сервер.

Usage:
    python migrate_to_postgres.py
"""
import os
import sys
import django

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jewelry_store.settings')
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
django.setup()

from django.core.management import call_command
import json
import tempfile

def export_sqlite():
    """Экспорт данных из SQLite в JSON fixture"""
    print("📦 Экспорт данных из SQLite...")
    
    fixture_file = os.path.join(os.path.dirname(__file__), 'data_export.json')
    
    # Экспортируем все данные
    call_command('dumpdata', 
                 '--natural-foreign',
                 '--natural-primary',
                 '--indent=2',
                 '--output=' + fixture_file)
    
    print(f"✅ Данные экспортированы в {fixture_file}")
    return fixture_file

def import_to_postgres(fixture_file):
    """Импорт данных в PostgreSQL"""
    print("📥 Импорт данных в PostgreSQL...")
    
    # Убедимся, что используется PostgreSQL
    from django.conf import settings
    db_engine = settings.DATABASES['default']['ENGINE']
    
    if 'sqlite' in db_engine:
        print("❌ Ошибка: текущая БД — SQLite. Настройте DATABASE_URL для PostgreSQL.")
        return
    
    print(f"🗄️  Подключение к: {db_engine}")
    
    # Загружаем данные
    call_command('loaddata', fixture_file)
    print("✅ Данные импортированы!")

def migrate():
    """Полный процесс миграции"""
    print("=" * 50)
    print("🔄 Миграция SQLite → PostgreSQL")
    print("=" * 50)
    
    # 1. Экспорт
    fixture_file = export_sqlite()
    
    # 2. Информация о размере
    size = os.path.getsize(fixture_file) / 1024 / 1024
    print(f"📊 Размер файла: {size:.2f} MB")
    
    print("\n" + "=" * 50)
    print("📋 Инструкция по импорту на сервере:")
    print("=" * 50)
    print()
    print("1. Загрузите файл data_export.json на сервер:")
    print("   scp data_export.json root@<IP>:/root/luxejewelry/backend/")
    print()
    print("2. На сервере выполните:")
    print("   cd /root/luxejewelry")
    print("   docker compose -f docker-compose.prod.yml exec backend python manage.py loaddata /app/data_export.json")
    print()
    print("=" * 50)

if __name__ == '__main__':
    migrate()
