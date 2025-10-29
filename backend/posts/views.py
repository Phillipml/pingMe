from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Post, Like, Comment
from .serializers import (
    PostSerializer,
    PostCreateSerializer,
    LikeSerializer,
    CommentSerializer,
    CommentCreateSerializer,
)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def post_list(request):
    following_users = request.user.following.values_list("following", flat=True)

    posts = (
        Post.objects.filter(Q(author__in=following_users) | Q(author=request.user))
        .select_related("author")
        .prefetch_related("likes", "comments")
        .order_by("-created_at")
    )

    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_posts = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(
        paginated_posts, many=True, context={"request": request}
    )
    return paginator.get_paginated_response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_create(request):
    serializer = PostCreateSerializer(data=request.data)
    if serializer.is_valid():
        post = serializer.save(author=request.user)
        return Response(
            {
                "message": "Post criado com sucesso",
                "post": PostSerializer(post, context={"request": request}).data,
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def post_detail(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    serializer = PostSerializer(post, context={"request": request})
    return Response(serializer.data)


@api_view(["PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def post_update_delete(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    if post.author != request.user:
        return Response(
            {"error": "Você só pode editar seus próprios posts"},
            status=status.HTTP_403_FORBIDDEN,
        )

    if request.method == "PUT":
        serializer = PostCreateSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Post atualizado com sucesso",
                    "post": PostSerializer(post, context={"request": request}).data,
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        post.delete()
        return Response(
            {"message": "Post deletado com sucesso"}, status=status.HTTP_200_OK
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_like(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    like, created = Like.objects.get_or_create(user=request.user, post=post)

    if created:
        return Response(
            {
                "message": "Post curtido com sucesso",
                "liked": True,
                "likes_count": post.likes.count(),
            },
            status=status.HTTP_201_CREATED,
        )
    else:
        like.delete()
        return Response(
            {
                "message": "Like removido com sucesso",
                "liked": False,
                "likes_count": post.likes.count(),
            },
            status=status.HTTP_200_OK,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def post_likes(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    likes = Like.objects.filter(post=post).select_related("user")

    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_likes = paginator.paginate_queryset(likes, request)
    serializer = LikeSerializer(paginated_likes, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def comment_create(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    serializer = CommentCreateSerializer(data=request.data)

    if serializer.is_valid():
        comment = serializer.save(author=request.user, post=post)
        return Response(
            {
                "message": "Comentário criado com sucesso",
                "comment": CommentSerializer(comment).data,
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def comment_list(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    comments = (
        Comment.objects.filter(post=post)
        .select_related("author")
        .order_by("-created_at")
    )

    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_comments = paginator.paginate_queryset(comments, request)
    serializer = CommentSerializer(paginated_comments, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def comment_update_delete(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)

    if comment.author != request.user:
        return Response(
            {"error": "Você só pode editar seus próprios comentários"},
            status=status.HTTP_403_FORBIDDEN,
        )

    if request.method == "PUT":
        serializer = CommentCreateSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Comentário atualizado com sucesso",
                    "comment": CommentSerializer(comment).data,
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        comment.delete()
        return Response(
            {"message": "Comentário deletado com sucesso"}, status=status.HTTP_200_OK
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_posts(request, user_id):
    from authentication.models import User

    user = get_object_or_404(User, id=user_id)
    posts = (
        Post.objects.filter(author=user)
        .select_related("author")
        .prefetch_related("likes", "comments")
        .order_by("-created_at")
    )

    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_posts = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(
        paginated_posts, many=True, context={"request": request}
    )
    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_posts(request):
    posts = (
        Post.objects.filter(author=request.user)
        .select_related("author")
        .prefetch_related("likes", "comments")
        .order_by("-created_at")
    )

    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_posts = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(
        paginated_posts, many=True, context={"request": request}
    )
    return paginator.get_paginated_response(serializer.data)
