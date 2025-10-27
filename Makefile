POETRY=cd backend && poetry run


dev-backend:
	$(POETRY) uvicorn backend.asgi:application --reload --host 0.0.0.0 --port 8000
pytest-authentication:
	$(POETRY) pytest authentication/tests/ -v
migrations:
	$(POETRY) python manage.py makemigrations && poetry run python manage.py migrate

