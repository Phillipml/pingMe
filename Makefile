POETRY=cd backend && poetry run


dev-backend:
	$(POETRY) uvicorn backend.asgi:application --reload --host 0.0.0.0 --port 8000
