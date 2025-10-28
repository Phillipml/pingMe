from django.contrib import admin
from authentication.models import User, Profile


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["username", "email", "is_active", "is_staff"]
    search_fields = ["username", "email"]


admin.site.register(Profile)
