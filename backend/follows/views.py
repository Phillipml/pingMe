from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Follow
from .serializers import FollowSerializer, FollowCreateSerializer
from authentication.models import User


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def follow_user(request):
    serializer = FollowCreateSerializer(data=request.data)
    if serializer.is_valid():
        following_user = serializer.validated_data["following"]

        if following_user == request.user:
            return Response(
                {"error": "Você não pode seguir a si mesmo"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if Follow.objects.filter(
            follower=request.user, following=following_user
        ).exists():
            return Response(
                {"error": "Você já está seguindo este usuário"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        follow = Follow.objects.create(follower=request.user, following=following_user)
        return Response(
            {
                "message": f"Você começou a seguir {following_user.username}",
                "follow": FollowSerializer(follow).data,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def unfollow_user(request, user_id):
    try:
        following_user = get_object_or_404(User, id=user_id)
        follow = Follow.objects.get(follower=request.user, following=following_user)
        follow.delete()

        return Response(
            {"message": f"Você deixou de seguir {following_user.username}"},
            status=status.HTTP_200_OK,
        )
    except Follow.DoesNotExist:
        return Response(
            {"error": "Você não está seguindo este usuário"},
            status=status.HTTP_404_NOT_FOUND,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def followers_list(request, user_id):
    user = get_object_or_404(User, id=user_id)
    followers = Follow.objects.filter(following=user).select_related("follower")

    serializer = FollowSerializer(followers, many=True)
    return Response(
        {
            "user": user.username,
            "followers_count": followers.count(),
            "followers": serializer.data,
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def following_list(request, user_id):
    user = get_object_or_404(User, id=user_id)
    following = Follow.objects.filter(follower=user).select_related("following")

    serializer = FollowSerializer(following, many=True)
    return Response(
        {
            "user": user.username,
            "following_count": following.count(),
            "following": serializer.data,
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_followers(request):
    followers = Follow.objects.filter(following=request.user).select_related("follower")

    serializer = FollowSerializer(followers, many=True)
    return Response(
        {"followers_count": followers.count(), "followers": serializer.data}
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_following(request):
    following = Follow.objects.filter(follower=request.user).select_related("following")

    serializer = FollowSerializer(following, many=True)
    return Response(
        {"following_count": following.count(), "following": serializer.data}
    )
