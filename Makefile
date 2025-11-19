POETRY=cd backend && poetry run
NPM=cd frontend && npm run

poetry-install:
	cd backend && poetry install

poetry-setup: poetry-install

get_secret_key:
	$(POETRY) python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

makemigrations:
	$(POETRY) python manage.py makemigrations

migrate:
	$(POETRY) python manage.py migrate

migrations: makemigrations migrate

createsuperuser:
	$(POETRY) python manage.py createsuperuser

check:
	$(POETRY) python manage.py check

dev-backend:
	$(POETRY) python manage.py runserver

dev-frontend:
	$(NPM) dev

test:
	$(POETRY) pytest

test-auth:
	$(POETRY) pytest authentication/tests/ -v

test-coverage:
	$(POETRY) pytest --cov=. --cov-report=html

format:
	$(POETRY) black .

back-lint:
	$(POETRY) flake8

type-check:
	$(POETRY) mypy

quality: format back-lint type-check

front-lint:
	$(NPM) lint

docker-up:
	cd backend && docker-compose up -d

docker-down:
	cd backend && docker-compose down

docker-logs:
	cd backend && docker-compose logs -f
