import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from authentication.models import Profile
from .models import Post, Like, Comment

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
def authenticated_client(api_client, user1):
    refresh = RefreshToken.for_user(user1)
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return api_client


@pytest.fixture
def post(user1):
    return Post.objects.create(
        author=user1, content="Test post content", image="https://example.com/image.jpg"
    )


@pytest.mark.django_db
class TestPostList:
    def test_get_post_list(self, authenticated_client, post):
        response = authenticated_client.get("/api/posts/")
        assert response.status_code == status.HTTP_200_OK
        assert "results" in response.data
        assert len(response.data["results"]) == 1

    def test_get_post_list_unauthorized(self, api_client):
        response = api_client.get("/api/posts/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_post_list_shows_following_posts(self, authenticated_client, user1, user2):
        from follows.models import Follow

        Follow.objects.create(follower=user1, following=user2)
        Post.objects.create(author=user2, content="Post from user2")
        response = authenticated_client.get("/api/posts/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1


@pytest.mark.django_db
class TestPostCreate:
    def test_create_post(self, authenticated_client, user1):
        response = authenticated_client.post(
            "/api/posts/create/",
            {"content": "New post", "image": "https://example.com/img.jpg"},
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert Post.objects.filter(author=user1).exists()

    def test_create_post_unauthorized(self, api_client):
        response = api_client.post("/api/posts/create/", {"content": "New post"})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_post_no_content(self, authenticated_client):
        response = authenticated_client.post("/api/posts/create/", {})
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestPostDetail:
    def test_get_post_detail(self, authenticated_client, post):
        response = authenticated_client.get(f"/api/posts/{post.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == post.id
        assert "is_liked" in response.data

    def test_get_post_not_found(self, authenticated_client):
        response = authenticated_client.get("/api/posts/999/")
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestPostUpdateDelete:
    def test_update_post(self, authenticated_client, post):
        response = authenticated_client.put(
            f"/api/posts/{post.id}/update/",
            {"content": "Updated content"},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        post.refresh_from_db()
        assert post.content == "Updated content"

    def test_update_other_user_post(self, authenticated_client, user2):
        other_post = Post.objects.create(author=user2, content="Other post")
        response = authenticated_client.put(
            f"/api/posts/{other_post.id}/update/",
            {"content": "Hacked content"},
            format="json",
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete_post(self, authenticated_client, post):
        post_id = post.id
        response = authenticated_client.delete(f"/api/posts/{post_id}/delete/")
        assert response.status_code == status.HTTP_200_OK
        assert not Post.objects.filter(id=post_id).exists()

    def test_delete_other_user_post(self, authenticated_client, user2):
        other_post = Post.objects.create(author=user2, content="Other post")
        response = authenticated_client.delete(f"/api/posts/{other_post.id}/delete/")
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestPostLike:
    def test_like_post(self, authenticated_client, post, user1):
        response = authenticated_client.post(f"/api/posts/{post.id}/like/")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["liked"] == True
        assert Like.objects.filter(user=user1, post=post).exists()

    def test_unlike_post(self, authenticated_client, post, user1):
        Like.objects.create(user=user1, post=post)
        response = authenticated_client.post(f"/api/posts/{post.id}/like/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["liked"] == False
        assert not Like.objects.filter(user=user1, post=post).exists()

    def test_get_likes_list(self, authenticated_client, post, user1):
        Like.objects.create(user=user1, post=post)
        response = authenticated_client.get(f"/api/posts/{post.id}/likes/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1


@pytest.mark.django_db
class TestComment:
    def test_create_comment(self, authenticated_client, post, user1):
        response = authenticated_client.post(
            f"/api/posts/{post.id}/comments/create/", {"content": "Test comment"}
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert Comment.objects.filter(author=user1, post=post).exists()

    def test_get_comments_list(self, authenticated_client, post, user1):
        Comment.objects.create(author=user1, post=post, content="Comment 1")
        Comment.objects.create(author=user1, post=post, content="Comment 2")
        response = authenticated_client.get(f"/api/posts/{post.id}/comments/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2

    def test_update_comment(self, authenticated_client, post, user1):
        comment = Comment.objects.create(author=user1, post=post, content="Original")
        response = authenticated_client.put(
            f"/api/posts/comments/{comment.id}/update/",
            {"content": "Updated comment"},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        comment.refresh_from_db()
        assert comment.content == "Updated comment"

    def test_update_other_user_comment(self, authenticated_client, post, user2):
        comment = Comment.objects.create(
            author=user2, post=post, content="Other comment"
        )
        response = authenticated_client.put(
            f"/api/posts/comments/{comment.id}/update/",
            {"content": "Hacked"},
            format="json",
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete_comment(self, authenticated_client, post, user1):
        comment = Comment.objects.create(author=user1, post=post, content="To delete")
        response = authenticated_client.delete(
            f"/api/posts/comments/{comment.id}/delete/"
        )
        assert response.status_code == status.HTTP_200_OK
        assert not Comment.objects.filter(id=comment.id).exists()


@pytest.mark.django_db
class TestUserPosts:
    def test_get_user_posts(self, authenticated_client, user1, post):
        response = authenticated_client.get(f"/api/posts/user/{user1.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1

    def test_get_my_posts(self, authenticated_client, user1, post):
        Post.objects.create(author=user1, content="Post 2")
        response = authenticated_client.get("/api/posts/my-posts/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2
