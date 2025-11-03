from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from itinerary.models import Itinerary
from itinerary.serializers import ItinerarySerializer


def _get_username_from_auth_header(request):
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        return auth_header.split(' ', 1)[1]
    return None


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'username and password required'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'username already exists'}, status=400)
    user = User.objects.create_user(username=username, password=password)
    token = username  # simple demo token
    return Response({'token': token, 'username': user.username})


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'username and password required'}, status=400)
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'invalid credentials'}, status=401)
    token = username  # simple demo token
    return Response({'token': token, 'username': user.username})


@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def itineraries_view(request):
    username = _get_username_from_auth_header(request)
    if not username:
        return Response({'error': 'missing or invalid Authorization header'}, status=401)

    if request.method == 'GET':
        items = Itinerary.objects.filter(username=username).order_by('-created_at')
        return Response(ItinerarySerializer(items, many=True).data)

    if request.method == 'POST':
        data = request.data.copy()
        data['username'] = username
        serializer = ItinerarySerializer(data=data)
        if serializer.is_valid():
            itinerary = serializer.save()
            return Response(ItinerarySerializer(itinerary).data, status=201)
        return Response(serializer.errors, status=400)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def generate_itinerary_view(request):
    username = _get_username_from_auth_header(request)
    # We allow generation without auth for demo, but prefer auth for saving
    destination = request.data.get('destination')
    duration = int(request.data.get('duration', 1))
    if not destination or duration < 1:
        return Response({'error': 'destination and duration required'}, status=400)

    days = []
    for day in range(1, duration + 1):
        days.append({
            'day': day,
            'activities': [
                {
                    'time': '09:00',
                    'title': f'Explore {destination} - Morning Walk',
                    'description': f'Start your day {day} with a walk in {destination}.'
                },
                {
                    'time': '13:00',
                    'title': 'Local Cuisine Lunch',
                    'description': 'Try a popular local restaurant.'
                },
                {
                    'time': '16:00',
                    'title': 'Sightseeing',
                    'description': 'Visit a landmark or museum.'
                },
                {
                    'time': '20:00',
                    'title': 'Dinner & Relax',
                    'description': 'End your day with a nice dinner.'
                }
            ]
        })

    return Response({'destination': destination, 'duration': duration, 'days': days})


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def save_itinerary_view(request):
    username = _get_username_from_auth_header(request)
    if not username:
        return Response({'error': 'missing or invalid Authorization header'}, status=401)

    destination = request.data.get('destination')
    duration = request.data.get('duration')
    details = request.data.get('itinerary')  # HTML content from client
    if not destination or not duration:
        return Response({'error': 'destination and duration required'}, status=400)

    try:
        duration = int(duration)
    except ValueError:
        return Response({'error': 'duration must be an integer'}, status=400)

    item = Itinerary.objects.create(
        username=username,
        destination=destination,
        duration=duration,
        details=details or ''
    )
    return Response(ItinerarySerializer(item).data, status=201)

