from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Profile
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    ProfileSerializer,
    ProfileDetailSerializer,
)


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {
                "message": "Usuário criado com sucesso",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if email and password:
        user = User.objects.filter(email=email).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)

            response = Response(
                {
                    "message": "Login realizado com sucesso",
                    "user": UserSerializer(user).data,
                }
            )

            response.set_cookie(
                key="accessToken",
                value=str(refresh.access_token),
                max_age=60 * 60,
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                path="/",
            )

            response.set_cookie(
                key="refreshToken",
                value=str(refresh),
                max_age=7 * 24 * 60 * 60,
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                path="/",
            )

            return response

    return Response(
        {"error": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile(request):
    try:
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    except Profile.DoesNotExist:
        return Response(
            {"error": "Perfil não encontrado"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def profile_update(request):
    try:
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Profile.DoesNotExist:
        return Response(
            {"error": "Perfil não encontrado"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def token_refresh(request):
    refresh_token = request.COOKIES.get("refreshToken") or request.data.get("refresh")

    if not refresh_token:
        return Response(
            {"error": "Refresh token é obrigatório"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        refresh = RefreshToken(refresh_token)
        access_token = refresh.access_token

        response = Response({"access": str(access_token)})

        response.set_cookie(
            key="accessToken",
            value=str(access_token),
            max_age=60 * 60,
            httponly=True,
            secure=not settings.DEBUG,
            samesite="Lax",
            path="/",
        )

        return response
    except Exception:
        return Response(
            {"error": "Token inválido ou expirado"}, status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def logout(request):
    refresh_token = request.COOKIES.get("refreshToken") or request.data.get("refresh")

    if not refresh_token:
        return Response(
            {"error": "Refresh token é obrigatório"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        refresh = RefreshToken(refresh_token)
        refresh.blacklist()

        response = Response({"message": "Logout realizado com sucesso"})

        response.delete_cookie("accessToken", path="/")
        response.delete_cookie("refreshToken", path="/")

        return response
    except Exception:

        response = Response(
            {"error": "Token inválido"}, status=status.HTTP_400_BAD_REQUEST
        )
        response.delete_cookie("accessToken", path="/")
        response.delete_cookie("refreshToken", path="/")
        return response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_detail(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        serializer = ProfileDetailSerializer(profile)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response(
            {"error": "Usuário não encontrado"}, status=status.HTTP_404_NOT_FOUND
        )
    except Profile.DoesNotExist:
        return Response(
            {"error": "Perfil não encontrado"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def change_password(request):
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not old_password or not new_password:
        return Response(
            {"error": "old_password e new_password são obrigatórios"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not request.user.check_password(old_password):
        return Response(
            {"error": "Senha atual incorreta"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(new_password) < 8:
        return Response(
            {"error": "Nova senha deve ter pelo menos 8 caracteres"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    request.user.set_password(new_password)
    request.user.save()

    return Response({"message": "Senha alterada com sucesso"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_list(request):
    from rest_framework.pagination import PageNumberPagination

    if not request.user.is_superuser:
        return Response(
            {
                "error": "Acesso negado. Apenas administradores podem acessar esta lista."
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    users = User.objects.all().order_by("-created_at")

    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_users = paginator.paginate_queryset(users, request)
    serializer = UserSerializer(paginated_users, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    user.delete()
    return Response(
        {"message": "Usuário deletado com sucesso"}, status=status.HTTP_200_OK
    )
