from datetime import datetime, time

from django.contrib.auth import authenticate
from django.db.models import Sum
from django.utils import timezone
from django.utils.dateparse import parse_date, parse_datetime
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import OccupancyHistory, Place, Room, User
from .serializers import OccupancyHistorySerializer, PlaceSerializer, RoomSerializer, UserSerializer
from .services import occupy_place_in_room, occupy_specific_place, release_place


def parse_history_filter(value, param_name):
    parsed = parse_datetime(value)
    if parsed is None:
        parsed_date = parse_date(value)
        if parsed_date is None:
            return None, f"Invalid '{param_name}' format. Use ISO datetime or YYYY-MM-DD."
        parsed = datetime.combine(parsed_date, time.max if param_name == 'to' else time.min)

    if timezone.is_naive(parsed):
        parsed = timezone.make_aware(parsed, timezone.get_current_timezone())
    return parsed, None


def apply_history_filters(queryset, query_params):
    from_value = query_params.get('from')
    to_value = query_params.get('to')

    if from_value:
        parsed_from, error = parse_history_filter(from_value, 'from')
        if error:
            return None, error
        queryset = queryset.filter(start_time__gte=parsed_from)

    if to_value:
        parsed_to, error = parse_history_filter(to_value, 'to')
        if error:
            return None, error
        queryset = queryset.filter(start_time__lte=parsed_to)

    return queryset, None


class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        username = request.data.get('username') or request.data.get('email')
        password = request.data.get('password')
        email = request.data.get('email', '')
        name = request.data.get('name', '')

        if not username or not password:
            return Response({"success": False, "message": "Email/Username and password are required"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"success": False, "message": "User already exists"}, status=400)

        User.objects.create_user(username=username, password=password, email=email, name=name)
        return Response({"success": True, "message": "User created"}, status=201)


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        username = request.data.get('username') or request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if not user:
            return Response({"success": False, "message": "Invalid credentials"}, status=401)

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data,
        })


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        period = request.query_params.get('period', 'all')
        stats = (
            OccupancyHistory.objects.values('user__username', 'user__name')
            .annotate(total_time=Sum('duration_minutes'))
            .order_by('-total_time')[:10]
        )

        return Response({
            "period": period,
            "leaders": stats,
        })


class RoomListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rooms = Room.objects.all().order_by('id')
        return Response(RoomSerializer(rooms, many=True).data)


class RoomPlacesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return Response({"message": "Room was not found"}, status=404)

        places = room.places.select_related('user').order_by('number')
        return Response(PlaceSerializer(places, many=True).data)


class EnterRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        qr_code = request.data.get('qr_code')
        if not qr_code:
            return Response({"success": False, "message": "qr_code is required"}, status=400)

        place, error = occupy_place_in_room(request.user.id, qr_code)
        if error:
            return Response({"success": False, "message": error}, status=400)
        return Response({"success": True, "place": PlaceSerializer(place).data})


class OccupySpecificPlaceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, place_id):
        qr_code = request.data.get('qr_code')
        place, error = occupy_specific_place(request.user.id, place_id, qr_code)
        if error:
            return Response({"success": False, "message": error}, status=400)

        return Response({"success": True, "place": PlaceSerializer(place).data})


class LeavePlaceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, place_id):
        place, history, error = release_place(place_id)
        if error:
            return Response({"success": False, "message": error}, status=400)

        return Response({
            "success": True,
            "message": "Place released successfully",
            "place": PlaceSerializer(place).data,
            "history": OccupancyHistorySerializer(history).data if history else None,
        })


class RoomHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        if not Room.objects.filter(id=room_id).exists():
            return Response({"message": "Room was not found"}, status=404)

        history = (
            OccupancyHistory.objects.filter(place__room_id=room_id)
            .select_related('user', 'place', 'place__room')
            .order_by('-start_time')
        )
        history, error = apply_history_filters(history, request.query_params)
        if error:
            return Response({"success": False, "message": error}, status=400)
        return Response(OccupancyHistorySerializer(history, many=True).data)


class PlaceHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, place_id):
        if not Place.objects.filter(id=place_id).exists():
            return Response({"message": "Place was not found"}, status=404)

        history = (
            OccupancyHistory.objects.filter(place_id=place_id)
            .select_related('user', 'place', 'place__room')
            .order_by('-start_time')
        )
        history, error = apply_history_filters(history, request.query_params)
        if error:
            return Response({"success": False, "message": error}, status=400)
        return Response(OccupancyHistorySerializer(history, many=True).data)

class UserHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        history = (
            OccupancyHistory.objects.filter(user=request.user)
            .select_related('user', 'place', 'place__room')
            .order_by('-start_time')
        )
        history, error = apply_history_filters(history, request.query_params)
        if error:
            return Response({"success": False, "message": error}, status=400)
        return Response(OccupancyHistorySerializer(history, many=True).data)

    def delete(self, request):
        OccupancyHistory.objects.filter(user=request.user).delete()
        return Response({"success": True, "message": "History cleared"})


class GlobalHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        history = (
            OccupancyHistory.objects.all()
            .select_related('user', 'place', 'place__room')
            .order_by('-start_time')[:50]
        )
        return Response(OccupancyHistorySerializer(history, many=True).data)

class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from django.db.models import Prefetch
        users = User.objects.prefetch_related(
            Prefetch('place_set', queryset=Place.objects.filter(status='occupied'), to_attr='active_places')
        )
        
        data = []
        for user in users:
            place = user.active_places[0] if user.active_places else None
            data.append({
                "id": user.id,
                "name": getattr(user, 'name', '') or user.get_full_name() or user.username,
                "email": user.email,
                "is_staff": user.is_staff,
                "place": {
                    "id": place.id,
                    "number": place.number,
                    "room_name": place.room.name,
                    "occupied_at": place.occupied_at,
                } if place else None
            })
        return Response(data)

class AdminHistoryView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        history = (
            OccupancyHistory.objects.all()
            .select_related('user', 'place', 'place__room')
            .order_by('-start_time')
        )
        history, error = apply_history_filters(history, request.query_params)
        if error:
            return Response({"success": False, "message": error}, status=400)
        
        from rest_framework.pagination import PageNumberPagination
        paginator = PageNumberPagination()
        paginator.page_size = 50
        result_page = paginator.paginate_queryset(history, request)
        serializer = OccupancyHistorySerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

class AdminActiveBookingsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        active = (
            OccupancyHistory.objects.filter(end_time__isnull=True)
            .select_related('user', 'place', 'place__room')
            .order_by('-start_time')
        )

        data = []
        for item in active:
            data.append({
                "id": item.id,
                "user_id": item.user.id,
                "user_name": getattr(item.user, 'name', '') or item.user.username,
                "user_email": item.user.email,
                "room_id": item.place.room.id,
                "room_name": item.place.room.name,
                "place_id": item.place.id,
                "place_number": item.place.number,
                "start_time": item.start_time,
                "status": "active",
            })

        return Response(data)