# PingMe Backend

Django REST API backend for a social media application with authentication, posts, likes, comments, and follow features.

## 📁 Project Structure

```
backend/
├── authentication/      # User authentication app
│   ├── models.py       # Custom User & Profile models
│   ├── admin.py        # Django admin configuration
│   ├── views.py        # API views
│   └── migrations/     # Database migrations
├── posts/              # Posts app
│   ├── models.py       # Post, Like, Comment models
│   ├── views.py        # API views
│   └── migrations/
├── follows/            # Follow relationships
│   ├── models.py       # Follow model
│   ├── views.py        # API views
│   └── migrations/
├── backend/            # Django project settings
│   ├── settings.py     # Project configuration
│   ├── urls.py         # URL routing
│   ├── asgi.py         # ASGI application
│   └── wsgi.py         # WSGI application
├── manage.py
├── pyproject.toml      # Poetry dependencies
├── db.sqlite3         # Development database
├── docker-compose.yml # Docker services
└── Dockerfile
```

## 🗂️ Apps Overview

### authentication
- **User**: Custom user model extending AbstractUser with email authentication
- **Profile**: Extended profile with first_name, last_name, bio, avatar

### posts
- **Post**: User posts with content and optional image URL
- **Like**: User likes on posts (unique constraint)
- **Comment**: User comments on posts

### follows
- **Follow**: Follow relationships between users (unique constraint)

## 🚀 Getting Started

### Prerequisites

- Python 3.13+
- Poetry (recommended)
- PostgreSQL (production) or SQLite (development)
- Redis (optional, for Celery)

### Installation

1. **Install dependencies**
   ```bash
   cd backend
   poetry install
   ```

2. **Activate virtual environment**
   ```bash
   poetry shell
   ```

3. **Run migrations**
   ```bash
   make migrations
   # or
   python manage.py migrate
   ```

4. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

5. **Run development server**
   ```bash
   make dev-backend
   # or
   poetry run uvicorn backend.asgi:application --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at http://localhost:8000

## 🗄️ Database Models

### User Model
- Extends Django's `AbstractUser`
- Email-based authentication (`USERNAME_FIELD = 'email'`)
- Custom `groups` and `user_permissions` with unique related names
- Additional fields: `email`, `is_active`, `create_at`, `updated_at`

### Profile Model
- OneToOne relationship with User
- Fields: `first_name`, `last_name`, `bio`, `avatar`, `created_at`, `updated_at`
- Access via `user.profile`

### Post Model
- Author: ForeignKey to User
- Content: TextField
- Image: Optional URLField
- Timestamps: `created_at`, `updated_at`

### Like Model
- User: ForeignKey to User (related_name='likes')
- Post: ForeignKey to Post (related_name='likes')
- Unique constraint on (user, post)

### Comment Model
- Post: ForeignKey to Post (related_name='comments')
- Author: ForeignKey to User (related_name='comments')
- Content: TextField
- Timestamps: `created_at`, `updated_at`

### Follow Model
- Follower: ForeignKey to User (related_name='following')
- Following: ForeignKey to User (related_name='followers')
- Unique constraint on (follower, following)

## 🛠️ Development

### Available Make Commands

```bash
# Run development server with uvicorn
make dev-backend

# Run migrations
make migrations

# Run tests
make pytest-authentication
```

### Running Tests

```bash
# Run all tests
pytest

# Run specific app tests
pytest authentication/tests/ -v

# With coverage
pytest --cov=. --cov-report=html
```

### Code Quality

```bash
# Format code
poetry run black .

# Lint code
poetry run flake8

# Type check
poetry run mypy

# Sort imports
poetry run isort .

# Security check
poetry run bandit -r .
```

## 🐳 Docker Support

### Start Services (PostgreSQL + Redis)

```bash
# From backend directory
docker-compose up -d

# Check services
docker-compose ps

# Stop services
docker-compose down
```

### Using PostgreSQL

Update `backend/backend/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'pingme',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 📝 Configuration

### Environment Variables

The project uses `python-decouple` for configuration. Create a `.env` file:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

### Settings Key Points

- `AUTH_USER_MODEL = 'authentication.User'`
- CORS enabled for frontend integration
- Django REST Framework configured
- JWT authentication ready (Simple JWT)

## 🔐 Security Features

- Custom User model with secure field management
- JWT authentication support
- CORS headers configured
- Password validators enabled
- Debug toolbar for development

## 📦 Dependencies

### Main Dependencies
- Django 5.2.7
- Django REST Framework 3.16.1
- Simple JWT 5.5.1
- Celery 5.5.3
- Redis 7.0.0
- PostgreSQL adapter (psycopg2-binary)
- Uvicorn 0.38.0

### Development Dependencies
- pytest & pytest-django
- black, flake8, isort
- mypy & django-stubs
- bandit (security)
- pre-commit

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

MIT License
