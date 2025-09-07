#!/bin/bash

# Start script for Render deployment
# This script handles the deployment process

echo "Starting AriseScholar deployment..."

# Navigate to the Django project directory
cd Backend/AriseScholar

# Install dependencies
echo "Installing dependencies..."
pip install -r ../../requirements.txt

# Run database migrations
echo "Running database migrations..."
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Create superuser if it doesn't exist (optional)
echo "Creating superuser..."
python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superuser created')
else:
    print('Superuser already exists')
"

# Start the application
echo "Starting Gunicorn server..."
exec gunicorn AriseScholar.wsgi --bind 0.0.0.0:$PORT --workers 3 --timeout 120
