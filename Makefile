POETRY=cd backend && poetry run
NPM=cd frontend && npm run

install:
	cd backend && poetry install
	cd frontend && npm install

install-prod:
	cd backend && poetry install --only=main
	cd frontend && npm ci --production

install-backend:
	cd backend && poetry install

install-backend-prod:
	cd backend && poetry install --only=main

install-frontend:
	cd frontend && npm install

install-frontend-prod:
	cd frontend && npm ci --production

dev-backend:
	$(POETRY) python manage.py runserver 0.0.0.0:8000

dev-frontend:
	$(NPM) dev

makemigrations:
	$(POETRY) python manage.py makemigrations

migrate:
	$(POETRY) python manage.py migrate

migrations: makemigrations migrate

createsuperuser:
	$(POETRY) python manage.py createsuperuser

check:
	$(POETRY) python manage.py check

get_secret_key:
	$(POETRY) python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

test:
	$(POETRY) pytest

test-auth:
	$(POETRY) pytest authentication/tests/ -v

test-coverage:
	$(POETRY) pytest --cov=. --cov-report=html

back-format:
	$(POETRY) black .

back-lint:
	$(POETRY) flake8

type-check:
	$(POETRY) mypy .

quality: back-format back-lint type-check

front-format:
	$(NPM) format

front-lint:
	$(NPM) lint

docker-up:
	cd backend && docker-compose up -d

docker-down:
	cd backend && docker-compose down

docker-logs:
	cd backend && docker-compose logs -f
