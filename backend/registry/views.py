from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.conf import settings
import os

class UploadImageView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        image = request.FILES.get('file')
        if not image:
            return Response({'error': 'No file provided'}, status=400)
        # Crear carpeta si no existe
        folder = os.path.join(settings.MEDIA_ROOT, 'refugios_logos')
        os.makedirs(folder, exist_ok=True)
        try:
            file_path = os.path.join('refugios_logos', image.name)
            full_path = os.path.join(settings.MEDIA_ROOT, file_path)
            with open(full_path, 'wb+') as destination:
                for chunk in image.chunks():
                    destination.write(chunk)
            url = request.build_absolute_uri(os.path.join(settings.MEDIA_URL, file_path))
            return Response({'url': url})
        except Exception as e:
            return Response({'error': f'Error saving image: {str(e)}'}, status=500)
# ...existing code...

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

# ...existing code...

# Endpoint para obtener y actualizar la ficha médica de un animal por animal_id
from rest_framework.generics import RetrieveUpdateAPIView
from .models import FichaMedica
from .serializers import FichaMedicaSerializer
from rest_framework import permissions

class FichaMedicaRetrieveUpdateView(RetrieveUpdateAPIView):
    def update(self, request, *args, **kwargs):
        print(f"PATCH ficha médica data: {request.data}")
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            print(f"Errores de validación PATCH ficha médica: {serializer.errors}")
            return Response(serializer.errors, status=400)
        self.perform_update(serializer)
        print(f"PATCH ficha médica response: {serializer.data}")
        return Response(serializer.data)
    serializer_class = FichaMedicaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        animal_id = self.kwargs.get('animal_id')
        return FichaMedica.objects.get(animal_id=animal_id)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

# Endpoint para obtener el historial de solicitudes de adopción aceptadas y rechazadas asociadas al refugio logeado
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def historial_solicitudes_adopcion_refugio(request):
    user = request.user
    if not hasattr(user, 'refugio') or not user.refugio:
        return Response([])
    refugio = user.refugio
    from .models import SolicitudAdopcion, Animal
    from .serializers import SolicitudAdopcionSerializer
    animales_refugio = Animal.objects.filter(refugio=refugio)
    solicitudes = SolicitudAdopcion.objects.filter(animal__in=animales_refugio, estado__in=['aceptada', 'rechazada'])
    serializer = SolicitudAdopcionSerializer(solicitudes, many=True)
    return Response(serializer.data)

# PATCH /refugio/solicitud-adopcion/<id>/
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def actualizar_solicitud_adopcion(request, pk):
    try:
        solicitud = SolicitudAdopcion.objects.get(pk=pk)
    except SolicitudAdopcion.DoesNotExist:
        return Response({"error": "Solicitud no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    estado = request.data.get("estado")
    anotaciones = request.data.get("anotaciones")
    if estado:
        solicitud.estado = estado
    if anotaciones is not None:
        solicitud.anotaciones = anotaciones
    solicitud.save()
    from .serializers import SolicitudAdopcionSerializer
    return Response(SolicitudAdopcionSerializer(solicitud).data)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
# Endpoint para obtener las solicitudes de adopción pendientes asociadas al refugio logeado
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def solicitudes_adopcion_pendientes_refugio(request):
    user = request.user
    if not hasattr(user, 'refugio') or not user.refugio:
        return Response([])
    refugio = user.refugio
    from .models import SolicitudAdopcion, Animal
    from .serializers import SolicitudAdopcionSerializer
    animales_refugio = Animal.objects.filter(refugio=refugio)
    solicitudes = SolicitudAdopcion.objects.filter(animal__in=animales_refugio, estado='pendiente')
    serializer = SolicitudAdopcionSerializer(solicitudes, many=True)
    return Response(serializer.data)
# Importar decoradores y permisos al inicio del archivo
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
# Endpoint para cantidad de adopciones pendientes de un refugio
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def adopciones_pendientes_refugio(request):
    user = request.user
    if not hasattr(user, 'refugio') or not user.refugio:
        return Response({'count': 0})
    refugio = user.refugio
    from .models import SolicitudAdopcion, Animal
    animales_refugio = Animal.objects.filter(refugio=refugio)
    count = SolicitudAdopcion.objects.filter(animal__in=animales_refugio, estado='pendiente').count()
    return Response({'count': count})
from rest_framework import generics, permissions, status
from .serializers import SolicitudAdopcionSerializer
from .models import SolicitudAdopcion
# --- Solicitud de Adopción ---
class SolicitudAdopcionListCreateView(generics.ListCreateAPIView):
    serializer_class = SolicitudAdopcionSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return SolicitudAdopcion.objects.none()
        return SolicitudAdopcion.objects.filter(usuario=user)

    def perform_create(self, serializer):
        user = self.request.user
        if not user or not user.is_authenticated:
            raise Exception("Usuario no autenticado")
        serializer.save(usuario=user)
from django.db.models import F
import random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from .permissions import IsRefugioOrAdmin, IsAdmin, IsRefugio
from .serializers import (
    AnimalSerializer, PostulacionRefugioSerializer, UserSerializer, LoginSerializer,
    HogarTemporalSerializer, RefugioSerializer,
    CirugiaSerializer, TratamientoSerializer, AlergiaCondicionSerializer, FichaMedicaSerializer
)
from .models import (
    Animal, PostulacionRefugio, Usuario, HogaresTemporales, Refugio,
    Cirugia, Tratamiento, AlergiaCondicion, FichaMedica
)
# Endpoint para listar y crear fichas médicas
from rest_framework import generics, permissions
class FichaMedicaListCreateView(generics.ListCreateAPIView):
    serializer_class = FichaMedicaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = FichaMedica.objects.all()
        animal_id = self.kwargs.get('animal_id')
        if animal_id:
            queryset = queryset.filter(animal_id=animal_id)
        return queryset

# Endpoint para listar y crear alergias/condiciones crónicas de un animal
from rest_framework import generics, permissions
class AlergiaCondicionListCreateView(generics.ListCreateAPIView):
    serializer_class = AlergiaCondicionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = AlergiaCondicion.objects.all()
        animal_id = self.kwargs.get('animal_id')
        if animal_id:
            queryset = queryset.filter(animal_id=animal_id)
        return queryset

# Endpoint público para 5 animales random con foto principal
class AnimalPublicCarouselView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        animales = list(Animal.objects.all())
        if not animales:
            return Response([])
        seleccionados = random.sample(animales, min(5, len(animales)))
        data = []
        from datetime import date
        for animal in seleccionados:
            foto_principal = None
            try:
                if hasattr(animal, 'fotos') and isinstance(animal.fotos, list) and len(animal.fotos) > 0:
                    foto_principal = animal.fotos[0]
            except Exception:
                foto_principal = None
            # Calcular días en refugio
            dias_en_refugio = 0
            if animal.fecha_ingreso:
                dias_en_refugio = (date.today() - animal.fecha_ingreso).days
            data.append({
                "id": animal.pk,
                "nombre": animal.nombre,
                "edad": animal.edad if animal.edad is not None else '',
                "tipo_edad": getattr(animal, 'tipo_edad', ''),
                "refugio": animal.refugio.nombre if animal.refugio else '',
                "diasEnRefugio": dias_en_refugio,
                "foto_principal": foto_principal
            })
        return Response(data)

class AnimalDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [IsRefugioOrAdmin]

    def destroy(self, request, *args, **kwargs):
        import logging
        logger = logging.getLogger(__name__)
        logger.warning('Intentando eliminar animal')
        try:
            instance = self.get_object()
            logger.warning(f'Animal a eliminar: {instance.id_animal} - {instance.nombre}')
            # Rechazar automáticamente solicitudes de adopción pendientes
            from .models import SolicitudAdopcion
            solicitudes = SolicitudAdopcion.objects.filter(animal=instance, estado='pendiente')
            logger.warning(f'Solicitudes pendientes encontradas: {solicitudes.count()}')
            for solicitud in solicitudes:
                logger.warning(f'Rechazando solicitud {solicitud.id_solicitud}')
                solicitud.estado = 'rechazada'
                solicitud.anotaciones = (solicitud.anotaciones or '') + '\nRechazada automáticamente: el animal fue eliminado del sistema.'
                solicitud.save()
            logger.warning('Eliminación de animal completada, llamando super().destroy')
            return super().destroy(request, *args, **kwargs)
        except Exception as e:
            logger.error(f'Error al eliminar animal: {e}', exc_info=True)
            from rest_framework.response import Response
            from rest_framework import status
            return Response({'error': f'Error interno al eliminar animal: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RefugioPublicListView(generics.ListAPIView):
    queryset = Refugio.objects.all()
    serializer_class = RefugioSerializer
    permission_classes = [permissions.AllowAny]

class RefugioPublicDetailView(generics.RetrieveAPIView):
    queryset = Refugio.objects.all()
    serializer_class = RefugioSerializer
    permission_classes = [permissions.AllowAny]

class AnimalPublicListView(generics.ListAPIView):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [permissions.AllowAny]

class AnimalPublicCountView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        count = Animal.objects.count()
        return Response({"count": count})

class AnimalPublicDetailView(generics.RetrieveAPIView):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [permissions.AllowAny]

# --- Postulación de Refugio pública ---


# Listar postulaciones por estado (pendiente, aceptada, rechazada)
class PostulacionRefugioListCreateView(generics.ListCreateAPIView):
    serializer_class = PostulacionRefugioSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        estado = self.request.query_params.get('estado')
        historial = self.request.query_params.get('historial')
        qs = PostulacionRefugio.objects.all()
        if estado:
            qs = qs.filter(estado=estado)
        elif historial == 'true':
            qs = qs.filter(estado__in=['aceptada', 'rechazada'])
        return qs


# PATCH /public/postulacion-refugio/<id>/
class PostulacionRefugioUpdateView(generics.RetrieveUpdateAPIView):
    queryset = PostulacionRefugio.objects.all()
    serializer_class = PostulacionRefugioSerializer
    permission_classes = [permissions.AllowAny]

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        estado = request.data.get('estado')
        usuario_refugio = None
        refugio = None
        if estado == 'aceptada':
            # Crear refugio automáticamente
            refugio = Refugio.objects.create(
                nombre=instance.nombre,
                direccion=instance.direccion,
                correo_contacto=instance.email,
                telefono=instance.telefono,
                descripcion=instance.descripcion,
                comuna=instance.comuna,
                region=instance.region
            )
            # Crear usuario tipo refugio asociado
            from .models import Usuario
            password = 'refugio2025'
            username = instance.nombre.replace(' ', '').lower()[:20]
            usuario_refugio = Usuario.objects.create_user(
                username=username,
                email=instance.email,
                password=password,
                tipo_usuario='refugio',
                refugio=refugio,
                telefono=instance.telefono
            )
            # Opcional: enviar password por email al contacto
        instance.estado = estado
        instance.save()
        data = PostulacionRefugioSerializer(instance).data
        if refugio and usuario_refugio:
            from .serializers import RefugioSerializer, UserSerializer
            data['refugio'] = RefugioSerializer(refugio).data
            data['usuario_refugio'] = UserSerializer(usuario_refugio).data
        return Response(data)

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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Eliminar usuario asociado al refugio (si existe)
        usuario = Usuario.objects.filter(refugio=instance).first()
        if usuario:
            usuario.delete()
        # Los animales se eliminan automáticamente por on_delete=models.CASCADE
        return super().destroy(request, *args, **kwargs)

# CRUD para animales (solo refugio y admin pueden crear/listar)
class AnimalListCreateView(generics.ListCreateAPIView):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [IsRefugioOrAdmin]

    def perform_create(self, serializer):
        # Asignar refugio automáticamente si el usuario es refugio
        user = self.request.user
        if hasattr(user, 'refugio') and user.refugio:
            animal = serializer.save(refugio=user.refugio)
        else:
            animal = serializer.save()
        # Crear ficha médica asociada automáticamente si no existe
        from .models import FichaMedica
        if not hasattr(animal, 'ficha_medica'):
            FichaMedica.objects.create(animal=animal)

class UserListAdminView(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

class UserDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')
        if new_password or confirm_password:
            if not new_password or not confirm_password:
                return Response({'error': 'Debes ingresar y confirmar la nueva contraseña.'}, status=400)
            if new_password != confirm_password:
                return Response({'error': 'Las contraseñas no coinciden.'}, status=400)
            instance.set_password(new_password)
            instance.save()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

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

from rest_framework import status
from .models import Usuario
from .serializers import UserSerializer

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    if request.method == 'GET':
        return Response(UserSerializer(user).data)
    elif request.method == 'PATCH':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def crear_hogar_temporal(request):
    serializer = HogarTemporalSerializer(data=request.data)
    if serializer.is_valid():
        hogar = serializer.save()
        return Response(HogarTemporalSerializer(hogar).data, status=201)
    return Response(serializer.errors, status=400)

class CirugiaListCreateView(generics.ListCreateAPIView):
    def get_queryset(self):
        queryset = Cirugia.objects.all()
        id_animal = self.request.query_params.get('id_animal')
        if id_animal:
            queryset = queryset.filter(id_animal=id_animal)
        return queryset
    serializer_class = CirugiaSerializer
    permission_classes = [permissions.IsAuthenticated]

class CirugiaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cirugia.objects.all()
    serializer_class = CirugiaSerializer
    permission_classes = [permissions.IsAuthenticated]

class TratamientoListCreateView(generics.ListCreateAPIView):
    serializer_class = TratamientoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Tratamiento.objects.all()
        id_animal = self.request.query_params.get('id_animal')
        if id_animal:
            queryset = queryset.filter(id_animal=id_animal)
        return queryset

class TratamientoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tratamiento.objects.all()
    serializer_class = TratamientoSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['GET', 'PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def refugio_me(request):
    user = request.user
    debug_info = {
        'user_id': getattr(user, 'id', None),
        'user_email': getattr(user, 'email', None),
        'has_refugio': hasattr(user, 'refugio'),
        'refugio_id': getattr(getattr(user, 'refugio', None), 'id_refugio', None)
    }
    if not hasattr(user, 'refugio') or not user.refugio:
        debug_info['error'] = 'El usuario no tiene refugio asociado.'
        return Response(debug_info, status=status.HTTP_404_NOT_FOUND)
    refugio = user.refugio
    if request.method == 'GET':
        try:
            serializer = RefugioSerializer(refugio, context={'request': request})
            debug_info['serializer_data'] = serializer.data
            return Response(serializer.data)
        except Exception as e:
            debug_info['error'] = str(e)
            return Response(debug_info, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method in ['PATCH', 'PUT']:
        partial = request.method == 'PATCH'
        eliminar_logo = request.data.get('eliminar_logo')
        nuevo_logo = request.FILES.get('logo')
        # Eliminar logo si se solicita
        if eliminar_logo == 'true' and refugio.logo:
            refugio.logo.delete(save=False)  # Elimina el archivo físico
            refugio.logo = None
        # Reemplazar logo si se sube uno nuevo
        if nuevo_logo:
            if refugio.logo:
                refugio.logo.delete(save=False)
            refugio.logo = nuevo_logo
        serializer = RefugioSerializer(refugio, data=request.data, partial=partial, context={'request': request})
        user = request.user
        # Actualizar datos del usuario asociado si se envían
        usuario_fields = ['usuario_nombre', 'usuario_email', 'usuario_telefono']
        updated = False
        for field in usuario_fields:
            value = request.data.get(field)
            if value is not None:
                if field == 'usuario_nombre':
                    user.username = value
                elif field == 'usuario_email':
                    user.email = value
                elif field == 'usuario_telefono':
                    user.telefono = value
                updated = True
        # Cambiar contraseña si se envía y coincide la confirmación
        password = request.data.get('usuario_password')
        password_confirm = request.data.get('usuario_password_confirm')
        if password:
            if password == password_confirm:
                user.set_password(password)
                updated = True
            else:
                return Response({'error': 'Las contraseñas no coinciden.'}, status=status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            serializer.save()
            if updated:
                user.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- Vacunas ---
from rest_framework import viewsets
from .models import Vacuna
from .serializers import VacunaSerializer

class VacunaViewSet(viewsets.ModelViewSet):
    serializer_class = VacunaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Vacuna.objects.all()
        animal_id = self.kwargs.get('animal_id')
        if animal_id:
            queryset = queryset.filter(animal_id=animal_id)
        return queryset

from .models import NecesidadRefugio
from .serializers import NecesidadRefugioSerializer
from rest_framework import generics, permissions

class NecesidadRefugioListCreateView(generics.ListCreateAPIView):
    serializer_class = NecesidadRefugioSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'refugio') and user.refugio:
            return NecesidadRefugio.objects.filter(refugio=user.refugio)
        return NecesidadRefugio.objects.none()
    def perform_create(self, serializer):
        user = self.request.user
        if hasattr(user, 'refugio') and user.refugio:
            serializer.save(refugio=user.refugio)

class NecesidadRefugioDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NecesidadRefugioSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = NecesidadRefugio.objects.all()