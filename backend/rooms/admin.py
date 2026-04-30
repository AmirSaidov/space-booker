from django.contrib import admin
from .models import User, Room, Place


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'qr_code', 'created_at')


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ('room', 'number', 'qr_code', 'status', 'user')