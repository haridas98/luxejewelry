#!/bin/bash

# Jewelry Store - Quick Start Script
# This script helps you get started with Docker deployment

set -e

echo "🚀 Jewelry Store - Docker Quick Start"
echo "======================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file and set:"
    echo "   - SECRET_KEY (generate a random 50+ character string)"
    echo "   - POSTGRES_PASSWORD (change from default)"
    echo ""
    read -p "Press Enter after you've updated .env..."
fi

# Ask for deployment mode
echo "Select deployment mode:"
echo "1) Development (local testing with hot-reload)"
echo "2) Production (with PostgreSQL)"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "🔧 Starting development mode..."
    docker-compose --profile development up --build
elif [ "$choice" = "2" ]; then
    echo ""
    echo "🚀 Starting production mode..."
    echo ""
    
    # Check if .env has default values
    if grep -q "change-this-to-a-random" .env || grep -q "jewelry123" .env; then
        echo "⚠️  WARNING: Your .env file contains default values!"
        echo "   Please update SECRET_KEY and POSTGRES_PASSWORD for production."
        echo ""
        read -p "Continue anyway? (y/n): " continue_choice
        if [ "$continue_choice" != "y" ]; then
            echo "Aborting. Please update .env file first."
            exit 1
        fi
    fi
    
    # Build and start
    docker-compose -f docker-compose.prod.yml up -d --build
    
    echo ""
    echo "✅ Services started!"
    echo ""
    echo "📊 Checking status..."
    docker-compose ps
    
    echo ""
    echo "📝 Useful commands:"
    echo "   - View logs: docker-compose logs -f"
    echo "   - Create admin: docker-compose exec backend python manage.py createsuperuser"
    echo "   - Stop: docker-compose down"
    echo ""
    echo "🌐 Your application is running at:"
    echo "   - Frontend: http://localhost"
    echo "   - Backend API: http://localhost:8000/api/"
    echo "   - Admin: http://localhost/admin/"
else
    echo "Invalid choice. Please run again."
    exit 1
fi
