"""
Скрипт для переноса данных из SQLite в PostgreSQL
Запускать локально перед деплоем на сервер.

Usage:
    python migrate_to_postgres.py
"""
import os
import sys
import io
import django

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jewelry_store.settings')
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
django.setup()

from django.core.management import call_command

def export_sqlite():
    """Экспорт данных из SQLite в JSON fixture"""
    print("📦 Экспорт данных из SQLite...")
    
    fixture_file = os.path.join(os.path.dirname(__file__), 'data_export.json')
    
    # Открываем файл с явной кодировкой UTF-8
    with io.open(fixture_file, 'w', encoding='utf-8') as f:
        call_command('dumpdata', 
                     '--natural-foreign',
                     '--natural-primary',
                     '--indent=2',
                     stdout=f)
    
    print(f"✅ Данные экспортированы в {fixture_file}")
    return fixture_file

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
    print("   scp backend/data_export.json root@<IP>:/root/luxejewelry/backend/")
    print()
    print("2. На сервере выполните:")
    print("   cd /root/luxejewelry")
    print("   docker cp backend/data_export.json luxejewelry-backend-1:/app/")
    print("   docker compose -f docker-compose.prod.yml exec backend python /app/import_data.py")
    print()
    print("=" * 50)

if __name__ == '__main__':
    migrate()
