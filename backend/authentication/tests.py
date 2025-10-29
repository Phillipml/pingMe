import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profile

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user_data():
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
    }


@pytest.fixture
def user(user_data):
    user = User.objects.create_user(**user_data)
    Profile.objects.create(user=user)
    return user


@pytest.fixture
def authenticated_client(api_client, user):
    refresh = RefreshToken.for_user(user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return api_client


@pytest.mark.django_db
class TestUserRegistration:
    def test_register_user_success(self, api_client, user_data):
        response = api_client.post("/api/auth/register/", user_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert "user" in response.data
        assert response.data["user"]["email"] == user_data["email"]

    def test_register_user_creates_profile(self, api_client, user_data):
        response = api_client.post("/api/auth/register/", user_data)
        assert response.status_code == status.HTTP_201_CREATED
        user = User.objects.get(email=user_data["email"])
        assert Profile.objects.filter(user=user).exists()

    def test_register_duplicate_email(self, api_client, user_data, user):
        response = api_client.post("/api/auth/register/", user_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_missing_fields(self, api_client):
        response = api_client.post("/api/auth/register/", {})
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestUserLogin:
    def test_login_success(self, api_client, user):
        response = api_client.post(
            "/api/auth/login/", {"email": user.email, "password": "testpass123"}
        )
        assert response.status_code == status.HTTP_200_OK
        assert "tokens" in response.data
        assert "access" in response.data["tokens"]
        assert "refresh" in response.data["tokens"]

    def test_login_invalid_credentials(self, api_client):
        response = api_client.post(
            "/api/auth/login/", {"email": "wrong@example.com", "password": "wrongpass"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_missing_fields(self, api_client):
        response = api_client.post("/api/auth/login/", {})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestTokenRefresh:
    def test_refresh_token_success(self, api_client, user):
        refresh = RefreshToken.for_user(user)
        response = api_client.post(
            "/api/auth/token/refresh/", {"refresh": str(refresh)}
        )
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data

    def test_refresh_token_invalid(self, api_client):
        response = api_client.post(
            "/api/auth/token/refresh/", {"refresh": "invalid_token"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_refresh_token_missing(self, api_client):
        response = api_client.post("/api/auth/token/refresh/", {})
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestLogout:
    def test_logout_success(self, api_client, user):
        refresh = RefreshToken.for_user(user)
        response = api_client.post("/api/auth/logout/", {"refresh": str(refresh)})
        assert response.status_code == status.HTTP_200_OK

    def test_logout_invalid_token(self, api_client):
        response = api_client.post("/api/auth/logout/", {"refresh": "invalid_token"})
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_logout_missing_token(self, api_client):
        response = api_client.post("/api/auth/logout/", {})
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestProfile:
    def test_get_profile(self, authenticated_client, user):
        response = authenticated_client.get("/api/auth/profile/")
        assert response.status_code == status.HTTP_200_OK
        assert "first_name" in response.data

    def test_get_profile_unauthorized(self, api_client):
        response = api_client.get("/api/auth/profile/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update_profile(self, authenticated_client, user):
        response = authenticated_client.put(
            "/api/auth/profile/update/",
            {"first_name": "João", "last_name": "Silva", "bio": "Test bio"},
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data["first_name"] == "João"
        profile = Profile.objects.get(user=user)
        assert profile.first_name == "João"

    def test_update_profile_partial(self, authenticated_client, user):
        response = authenticated_client.put(
            "/api/auth/profile/update/", {"first_name": "Maria"}
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data["first_name"] == "Maria"

    def test_get_profile_detail(self, authenticated_client, user):
        response = authenticated_client.get(f"/api/auth/profile/{user.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert "user" in response.data

    def test_get_profile_detail_not_found(self, authenticated_client):
        response = authenticated_client.get("/api/auth/profile/999/")
        assert response.status_code == status.HTTP_404_NOT_FOUND
