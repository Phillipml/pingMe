from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path("token/refresh/", views.token_refresh, name="token_refresh"),
    path("profile/", views.profile, name="profile"),
    path("profile/update/", views.profile_update, name="profile_update"),
    path("profile/<int:user_id>/", views.profile_detail, name="profile_detail"),
    path("change-password/", views.change_password, name="change_password"),
]
