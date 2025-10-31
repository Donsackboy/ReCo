from rest_framework import status, permissions, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, LoginSerializer, HogarTemporalSerializer, RefugioSerializer, AnimalSerializer
from .models import Usuario, HogaresTemporales, Refugio, Animal
from .permissions import IsAdmin, IsRefugio, IsRefugioOrAdmin

class RefugioListCreateView(generics.ListCreateAPIView):
    queryset = Refugio.objects.all()
    serializer_class = RefugioSerializer
    permission_classes = [IsAdmin]

    def create(self, request, *args, **kwargs):
        # Espera datos: nombre, direccion, correo_contacto, etc. + username, email, password
        refugio_data = request.data.copy()
        username = refugio_data.pop('username', None)
        email = refugio_data.pop('email', None)
        password = refugio_data.pop('password', None)

        if not (username and email and password and refugio_data.get('nombre')):
            return Response({'error': 'Faltan datos requeridos: nombre, username, email, password'}, status=400)

        # Crear refugio
        refugio_serializer = self.get_serializer(data=refugio_data)
        refugio_serializer.is_valid(raise_exception=True)
        refugio = refugio_serializer.save()

        # Crear usuario tipo refugio asociado
        usuario = Usuario.objects.create_user(
            username=username,
            email=email,
            password=password,
            tipo_usuario='refugio',
            refugio=refugio
        )

        # Retornar ambos objetos
        return Response({
            'refugio': RefugioSerializer(refugio).data,
            'usuario_refugio': UserSerializer(usuario).data
        }, status=201)

class RefugioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Refugio.objects.all()
    serializer_class = RefugioSerializer
    permission_classes = [IsAdmin]

# CRUD para animales (solo refugio y admin pueden crear/listar)
class AnimalListCreateView(generics.ListCreateAPIView):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [IsRefugioOrAdmin]

    def perform_create(self, serializer):
        # Asignar refugio automáticamente si el usuario es refugio
        user = self.request.user
        if hasattr(user, 'refugio') and user.refugio:
            serializer.save(refugio=user.refugio)
        else:
            serializer.save()
class UserListAdminView(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

class UserDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

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