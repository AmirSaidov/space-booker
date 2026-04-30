from django.urls import path

from .views import (
    EnterRoomView,
    LeaderboardView,
    LeavePlaceView,
    LoginView,
    OccupySpecificPlaceView,
    PlaceHistoryView,
    RegisterView,
    RoomHistoryView,
    RoomListView,
    RoomPlacesView,
    UserProfileView,
    UserHistoryView,
)


urlpatterns = [
    path('auth/register', RegisterView.as_view(), name='register'),
    path('auth/login', LoginView.as_view(), name='login'),
    path('auth/me', UserProfileView.as_view(), name='user-profile'),
    path('rooms', RoomListView.as_view(), name='rooms'),
    path('rooms/enter', EnterRoomView.as_view(), name='room-enter'),
    path('rooms/<int:room_id>/places', RoomPlacesView.as_view(), name='room-places'),
    path('rooms/<int:room_id>/history', RoomHistoryView.as_view(), name='room-history'),
    path('places/<int:place_id>/occupy', OccupySpecificPlaceView.as_view(), name='place-occupy'),
    path('places/<int:place_id>/leave', LeavePlaceView.as_view(), name='place-leave'),
    path('places/<int:place_id>/history', PlaceHistoryView.as_view(), name='place-history'),
    path('auth/history', UserHistoryView.as_view(), name='user-history'),
    path('leaderboard', LeaderboardView.as_view(), name='leaderboard'),
]
