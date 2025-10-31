from rest_framework import serializers
from .models import Post, Like, Comment
from authentication.serializers import UserSerializer


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "content",
            "created_at",
            "updated_at",
            "likes_count",
            "comments_count",
            "is_liked",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["content"]


class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ["id", "user", "post", "created_at"]
        read_only_fields = ["id", "created_at"]


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "post", "author", "content", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["content"]
