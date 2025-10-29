from django.urls import path
from . import views

urlpatterns = [
    path("", views.post_list, name="post_list"),
    path("create/", views.post_create, name="post_create"),
    path("<int:post_id>/", views.post_detail, name="post_detail"),
    path("<int:post_id>/update/", views.post_update_delete, name="post_update"),
    path("<int:post_id>/delete/", views.post_update_delete, name="post_delete"),
    path("<int:post_id>/like/", views.post_like, name="post_like"),
    path("<int:post_id>/likes/", views.post_likes, name="post_likes"),
    path("<int:post_id>/comments/", views.comment_list, name="comment_list"),
    path("<int:post_id>/comments/create/", views.comment_create, name="comment_create"),
    path(
        "comments/<int:comment_id>/update/",
        views.comment_update_delete,
        name="comment_update",
    ),
    path(
        "comments/<int:comment_id>/delete/",
        views.comment_update_delete,
        name="comment_delete",
    ),
    path("user/<int:user_id>/", views.user_posts, name="user_posts"),
    path("my-posts/", views.my_posts, name="my_posts"),
]
