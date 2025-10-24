from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, LoginSerializer, HogarTemporalSerializer
from .models import Usuario, HogaresTemporales
from .permissions import IsAdmin, IsRefugio, IsRefugioOrAdmin

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    print(f"[DEBUG] login called with data: {request.data}")
    if serializer.is_valid():
        user = serializer.validated_data['user']
        print(f"[DEBUG] Login successful for user: {user!r} (type: {type(user)})")
        if not isinstance(user, Usuario):
            print(f"[DEBUG] ERROR: user is not an instance of Usuario, value: {user!r}, type: {type(user)}")
            return Response({'error': f'Internal server error: user is not a Usuario instance, got {user!r} of type {type(user)}'}, status=500)
        token, created = Token.objects.get_or_create(user=user)
        print(f"[DEBUG] Token: {token.key}, created: {created}")
        return Response({'token': token.key, 'user': UserSerializer(user).data})
    print(f"[DEBUG] Login failed: {serializer.errors}")
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = Usuario.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=request.data['password'],  # Enviar password aparte
            tipo_usuario=serializer.validated_data.get('tipo_usuario', 'default')
        )
        token = Token.objects.create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def user_profile(request):
    return Response(UserSerializer(request.user).data)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def crear_hogar_temporal(request):
    serializer = HogarTemporalSerializer(data=request.data)
    if serializer.is_valid():
        hogar = serializer.save()
        return Response(HogarTemporalSerializer(hogar).data, status=201)
    return Response(serializer.errors, status=400)