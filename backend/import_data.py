"""
Скрипт для импорта данных в PostgreSQL на сервере.
Запускать ВНУТРИ Docker контейнера backend.

Usage:
    docker compose -f docker-compose.prod.yml exec backend python /app/import_data.py
"""
import os
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jewelry_store.settings')
sys.path.insert(0, '/app')

import django
django.setup()

from django.core.management import call_command
import json

def import_data():
    """Импорт данных из JSON fixture в PostgreSQL"""
    fixture_file = '/app/data_export.json'
    
    if not os.path.exists(fixture_file):
        print(f"❌ Файл {fixture_file} не найден!")
        print("Загрузите файл на сервер:")
        print("  scp data_export.json root@<IP>:/root/luxejewelry/backend/")
        print("Затем скопируйте в контейнер:")
        print("  docker cp data_export.json luxejewelry-backend-1:/app/")
        return
    
    print("📥 Импорт данных в PostgreSQL...")
    
    # Проверяем подключение
    from django.conf import settings
    db_engine = settings.DATABASES['default']['ENGINE']
    print(f"🗄️  Движок БД: {db_engine}")
    
    if 'sqlite' in db_engine:
        print("❌ Ошибка: используется SQLite. Убедитесь, что DATABASE_URL настроен на PostgreSQL.")
        return
    
    # Размер файла
    size = os.path.getsize(fixture_file) / 1024 / 1024
    print(f"📊 Размер файла: {size:.2f} MB")
    
    # Импорт
    call_command('loaddata', fixture_file, verbosity=2)
    
    print("\n✅ Данные успешно импортированы!")

if __name__ == '__main__':
    import_data()
