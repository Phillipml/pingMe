
POETRY=cd backend && poetry run

dev-backend:
	$(POETRY) python manage.py runserver

check:
	$(POETRY) python manage.py check

migrate:
	$(POETRY) python manage.py migrate

makemigrations:
	$(POETRY) python manage.py makemigrations

migrations: makemigrations migrate

get_secret_keys:
	${POETRY} && python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

createsuperuser:
	$(POETRY) python manage.py createsuperuser

test:
	$(POETRY) pytest

test-auth:
	$(POETRY) pytest authentication/tests/ -v

test-coverage:
	$(POETRY) pytest --cov=. --cov-report=html

format:
	$(POETRY) black .

lint:
	$(POETRY) flake8

type-check:
	$(POETRY) mypy

quality: format lint type-check

docker-up:
	cd backend && docker-compose up -d

docker-down:
	cd backend && docker-compose down

docker-logs:
	cd backend && docker-compose logs -f
