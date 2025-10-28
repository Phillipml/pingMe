# pingMe

A social media backend API built with Django REST Framework, featuring user authentication, posts, likes, comments, and follow functionality.

## 🚀 Features

- **User Authentication**: Custom User model with JWT authentication
- **User Profiles**: Extended profile information with bio and avatar
- **Social Features**:
  - Create and manage posts
  - Like and comment on posts
  - Follow/unfollow other users
- **RESTful API** built with Django REST Framework
- **JWT Authentication** with token refresh and blacklisting
- **CORS Support** for frontend integration
- **Docker Support** with PostgreSQL and Redis
- **Async Tasks** with Celery

## 📁 Project Structure

```
pingMe/
├── backend/              # Django REST API
│   ├── authentication/  # User authentication app
│   │   ├── models.py    # Custom User & Profile models
│   │   └── ...
│   ├── posts/          # Posts app (Post, Like, Comment)
│   ├── follows/        # Follow relationships
│   ├── db.sqlite3      # Local development database
│   ├── manage.py
│   ├── pyproject.toml  # Poetry dependencies
│   └── docker-compose.yml
├── frontend/            # (To be implemented)
├── Makefile
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Django 5.2** - Web framework
- **Django REST Framework** - API toolkit
- **Simple JWT** - JWT authentication
- **Celery** - Async task queue
- **Redis** - Cache and message broker
- **PostgreSQL** - Production database
- **SQLite** - Development database
- **Poetry** - Dependency management

### Development Tools
- **pytest** - Testing framework
- **black** - Code formatter
- **flake8** - Linter
- **mypy** - Type checking
- **pre-commit** - Git hooks

## 🚀 Quick Start

### Prerequisites

- **Python 3.13+**
- **Poetry** (recommended)** or pip
- **PostgreSQL** (for production)
- **Redis** (for caching and Celery)
- **Docker & Docker Compose** (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pingMe
   ```

2. **Setup Backend (using Poetry)**
   ```bash
   cd backend
   poetry install
   poetry shell
   ```

3. **Setup Database**
   ```bash
   # Make and run migrations
   make migrations
   # or manually:
   python manage.py migrate
   ```

4. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

5. **Run Development Server**
   ```bash
   make dev-backend
   # or
   python manage.py runserver
   ```

6. **Test the Setup**
   ```bash
   # Check for configuration errors
   python manage.py check
   
   # Access the application
   # Backend API: http://127.0.0.1:8000/
   # Admin Panel: http://127.0.0.1:8000/admin/
   ```

### Using Docker

1. **Start services** (PostgreSQL + Redis)
   ```bash
   docker-compose up -d
   ```

2. **Run migrations**
   ```bash
   cd backend
   poetry run python manage.py migrate
   ```

3. **Run the server**
   ```bash
   make dev-backend
   ```

## 📚 API Structure

### Apps

#### **authentication** - User Management
- `User` model (extends AbstractUser)
- `Profile` model (OneToOne with User)
- Email-based authentication (`USERNAME_FIELD = 'email'`)
- Custom groups and permissions with unique related names
- JWT authentication configured

#### **posts** - Content Management
- `Post` - User posts with content and images
- `Like` - User likes on posts (unique constraint)
- `Comment` - User comments on posts

#### **follows** - Social Relationships
- `Follow` - User follow relationships (unique constraint)

### Configuration Status

✅ **Completed:**
- Django REST Framework configured
- JWT authentication with Simple JWT
- CORS headers for frontend integration
- Custom User model with proper field management
- Database migrations applied
- Admin interface configured

🔄 **In Progress:**
- API endpoints implementation
- Serializers for data validation
- Authentication views (register, login, logout)
- Profile management endpoints

📋 **Next Steps:**
- Implement authentication API endpoints
- Create serializers for User and Profile
- Add API documentation
- Write comprehensive tests

## 🧪 Testing

```bash
# Run all tests
cd backend
pytest

# Run specific app tests
make pytest-authentication

# With coverage
poetry run pytest --cov=.
```

## 🛠️ Development

### Available Commands

```bash
# Start development server
make dev-backend
# or
python manage.py runserver

# Run tests
make pytest-authentication
# or
pytest authentication/tests/ -v

# Create/Apply migrations
make migrations
# or
python manage.py makemigrations && python manage.py migrate

# Check configuration
python manage.py check

# Create superuser
python manage.py createsuperuser

# Access Django admin
# http://127.0.0.1:8000/admin/
```

### Code Quality

```bash
# Format code
poetry run black .

# Lint code
poetry run flake8

# Type check
poetry run mypy

# Run all checks
poetry run pre-commit run --all-files
```

## 📝 Configuration

### Current Setup
- **SQLite** for local development (see `db.sqlite3`)
- **PostgreSQL** for production (configured in `docker-compose.yml`)
- **Redis** for caching and Celery (configured in `docker-compose.yml`)

### Key Settings
- **AUTH_USER_MODEL**: `authentication.User` (custom user model)
- **JWT Tokens**: 60min access, 7-day refresh with rotation
- **CORS Origins**: `http://localhost:3000`, `http://127.0.0.1:3000`
- **Pagination**: 20 items per page
- **Default Permissions**: `IsAuthenticated` (protects all endpoints)

### Environment Variables (Ready)
The project is configured to use environment variables with `python-decouple`:
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

Update `backend/backend/settings.py` for production configurations.

## 🔐 Security

- **JWT Authentication**: Stateless authentication with access/refresh tokens
- **Token Security**: 60-minute access tokens, 7-day refresh tokens with rotation
- **CORS Protection**: Configured for specific frontend origins
- **Custom User Model**: Secure field management with unique related names
- **Password Validation**: Django's built-in password validators
- **CSRF Protection**: Enabled for session-based requests
- **Environment Variables**: Support with python-decouple (ready for production)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Phillip Menezes**
- Email: contato.phillip.menezes@gmail.com
- GitHub: [@Phillipml](https://github.com/phillipml)