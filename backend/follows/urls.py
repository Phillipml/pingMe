from django.urls import path
from . import views

urlpatterns = [
    path("follow/", views.follow_user, name="follow_user"),
    path("unfollow/<int:user_id>/", views.unfollow_user, name="unfollow_user"),
    path("followers/<int:user_id>/", views.followers_list, name="followers_list"),
    path("following/<int:user_id>/", views.following_list, name="following_list"),
    path("my-followers/", views.my_followers, name="my_followers"),
    path("my-following/", views.my_following, name="my_following"),
]
