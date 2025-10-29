import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from authentication.models import Profile
from .models import Follow

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user1():
    user = User.objects.create_user(
        username="user1", email="user1@example.com", password="pass123"
    )
    Profile.objects.create(user=user)
    return user


@pytest.fixture
def user2():
    user = User.objects.create_user(
        username="user2", email="user2@example.com", password="pass123"
    )
    Profile.objects.create(user=user)
    return user


@pytest.fixture
def user3():
    user = User.objects.create_user(
        username="user3", email="user3@example.com", password="pass123"
    )
    Profile.objects.create(user=user)
    return user


@pytest.fixture
def authenticated_client(api_client, user1):
    refresh = RefreshToken.for_user(user1)
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return api_client


@pytest.mark.django_db
class TestFollowUser:
    def test_follow_user(self, authenticated_client, user1, user2):
        response = authenticated_client.post(
            "/api/follows/follow/", {"following": user2.id}
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert Follow.objects.filter(follower=user1, following=user2).exists()

    def test_follow_user_unauthorized(self, api_client, user2):
        response = api_client.post("/api/follows/follow/", {"following": user2.id})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_follow_self(self, authenticated_client, user1):
        response = authenticated_client.post(
            "/api/follows/follow/", {"following": user1.id}
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_follow_already_following(self, authenticated_client, user1, user2):
        Follow.objects.create(follower=user1, following=user2)
        response = authenticated_client.post(
            "/api/follows/follow/", {"following": user2.id}
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestUnfollowUser:
    def test_unfollow_user(self, authenticated_client, user1, user2):
        Follow.objects.create(follower=user1, following=user2)
        response = authenticated_client.delete(f"/api/follows/unfollow/{user2.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert not Follow.objects.filter(follower=user1, following=user2).exists()

    def test_unfollow_not_following(self, authenticated_client, user2):
        response = authenticated_client.delete(f"/api/follows/unfollow/{user2.id}/")
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestFollowersList:
    def test_get_followers(self, authenticated_client, user1, user2, user3):
        Follow.objects.create(follower=user2, following=user1)
        Follow.objects.create(follower=user3, following=user1)
        response = authenticated_client.get(f"/api/follows/followers/{user1.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2

    def test_get_my_followers(self, authenticated_client, user1, user2):
        Follow.objects.create(follower=user2, following=user1)
        response = authenticated_client.get("/api/follows/my-followers/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1


@pytest.mark.django_db
class TestFollowingList:
    def test_get_following(self, authenticated_client, user1, user2, user3):
        Follow.objects.create(follower=user1, following=user2)
        Follow.objects.create(follower=user1, following=user3)
        response = authenticated_client.get(f"/api/follows/following/{user1.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2

    def test_get_my_following(self, authenticated_client, user1, user2):
        Follow.objects.create(follower=user1, following=user2)
        response = authenticated_client.get("/api/follows/my-following/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
