from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Follow
from .serializers import FollowSerializer, FollowCreateSerializer
from authentication.models import User


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def follow_user(request):
    serializer = FollowCreateSerializer(data=request.data)
    if serializer.is_valid():
        following = serializer.validated_data["following"]

        if following == request.user:
            return Response(
                {"error": "Você não pode seguir a si mesmo"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if Follow.objects.filter(
            follower=request.user, following=following
        ).exists():
            return Response(
                {"error": "Você já está seguindo este usuário"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        follow = Follow.objects.create(follower=request.user, following=following)
        return Response(
            {
                "message": f"Você começou a seguir {following.username}",
                "follow": FollowSerializer(follow).data,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def unfollow_user(request):
    serializer = FollowCreateSerializer(data=request.data)
    if serializer.is_valid():
        following = serializer.validated_data["following"]
        
        try:
            follow = Follow.objects.get(follower=request.user, following=following)
            follow.delete()

            return Response(
                {"message": f"Você deixou de seguir {following.username}"},
                status=status.HTTP_200_OK,
            )
        except Follow.DoesNotExist:
            return Response(
                {"error": "Você não está seguindo este usuário"},
                status=status.HTTP_404_NOT_FOUND,
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_followers(request):
    followers = Follow.objects.filter(following=request.user).select_related("follower")

    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_followers = paginator.paginate_queryset(followers, request)
    serializer = FollowSerializer(paginated_followers, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_following(request):
    following = Follow.objects.filter(follower=request.user).select_related("following")

    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_following = paginator.paginate_queryset(following, request)
    serializer = FollowSerializer(paginated_following, many=True)
    return paginator.get_paginated_response(serializer.data)
