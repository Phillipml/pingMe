from rest_framework import serializers
from .models import User, Profile


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "created_at", "avatar"]

    def get_avatar(self, obj):
        if hasattr(obj, "profile") and obj.profile.avatar:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.profile.avatar.url)
            return obj.profile.avatar.url
        return None


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Este username já está em uso. Por favor, escolha outro."
            )
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False, allow_null=True)
    username = serializers.CharField(source="user.username", required=False)

    class Meta:
        model = Profile
        fields = [
            "username",
            "first_name",
            "last_name",
            "bio",
            "avatar",
            "status",
        ]

    def validate_username(self, value):
        if value:
            if hasattr(self, "instance") and self.instance:
                existing_user = (
                    User.objects.filter(username=value)
                    .exclude(id=self.instance.user.id)
                    .first()
                )
            else:
                existing_user = User.objects.filter(username=value).first()

            if existing_user:
                raise serializers.ValidationError(
                    "Este username já está em uso. Por favor, escolha outro."
                )
        return value

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if "username" in user_data:
            username = user_data["username"]
            if (
                User.objects.filter(username=username)
                .exclude(id=instance.user.id)
                .exists()
            ):
                raise serializers.ValidationError(
                    {
                        "username": (
                            "Este username já está em uso. " "Por favor, escolha outro."
                        )
                    }
                )
            user = instance.user
            user.username = username
            user.save()

        return instance


class UserWithProfileSerializer(serializers.ModelSerializer):
    info = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "created_at", "info"]

    def get_info(self, obj):
        profile = obj.profile
        request = self.context.get("request")
        avatar_url = None
        if profile.avatar:
            if request:
                avatar_url = request.build_absolute_uri(profile.avatar.url)
            else:
                avatar_url = profile.avatar.url
        return {
            "first_name": profile.first_name,
            "last_name": profile.last_name,
            "bio": profile.bio,
            "avatar": avatar_url,
            "status": profile.status,
        }


class ProfileDetailSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False, allow_null=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ["user", "first_name", "last_name", "bio", "avatar", "status"]
