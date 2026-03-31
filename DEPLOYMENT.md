# Deployment Instructions for Jewelry Store

## Backend (Django)

### Prerequisites
- Python 3.8+
- pip
- virtualenv (recommended)

### Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser (for admin access):
```bash
python manage.py createsuperuser
```

6. Populate with sample data:
```bash
python manage.py populate_sample_data
```

7. Start the development server:
```bash
python manage.py runserver
```

The backend will be available at http://localhost:8000

## Frontend (React)

### Prerequisites
- Node.js 14+
- npm or yarn

### Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at http://localhost:3000

## Production Deployment

### Backend
For production deployment, you'll need to:
1. Configure a production database (PostgreSQL recommended)
2. Set environment variables for security
3. Serve static files properly
4. Use a production-ready WSGI server like Gunicorn

### Frontend
For production deployment:
1. Build the React app:
```bash
npm run build
```
2. Serve the build folder using a web server like Nginx

## Environment Variables

### Backend (.env file in backend directory)
```
SECRET_KEY=your_secret_key_here
DEBUG=False
DATABASE_URL=postgresql://user:password@localhost/dbname
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

### Frontend (.env file in frontend directory)
```
REACT_APP_API_URL=https://yourdomain.com/api
```

## API Endpoints

The backend provides the following API endpoints:
- GET /api/products/ - List all products
- GET /api/products/{id}/ - Get a specific product
- GET /api/categories/ - List all categories
- GET /api/categories/{id}/ - Get a specific category
- GET /api/categories/{id}/products/ - Get products in a category
- GET /api/sets/ - List all sets
- GET /api/sets/{id}/ - Get a specific set
- GET /api/featured-products/ - Get featured products
- GET /api/search/?q=search_term - Search products

## Admin Panel

Access the admin panel at http://localhost:8000/admin/
Use the superuser credentials created earlier to log in.

The admin panel allows you to:
- Manage categories
- Add, edit, and delete products
- Upload product images
- Create and manage sets
- View orders (when implemented)