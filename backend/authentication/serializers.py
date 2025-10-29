from rest_framework import serializers
from .models import User, Profile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "created_at"]


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Profile
        fields = ["first_name", "last_name", "bio", "avatar"]
