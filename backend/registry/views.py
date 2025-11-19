from django.conf import settings
from django.core.files.storage import default_storage
from django.db.models import F
import logging
import os
import random
import uuid

from rest_framework import (
    generics, permissions, status, viewsets
)
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from transbank.webpay.webpay_plus.transaction import Transaction

from .models import (
    AlergiaCondicion, Animal, CatalogoServicios, Cirugia, ComprobantesServicio,
    DonacionesEspecificas, FichaMedica, HogaresTemporales, ListaVacunasAnimal,
    ListaVacunasEspecie, NecesidadRefugio, PostulacionRefugio, Refugio,
    SolicitudAdopcion, Tratamiento, Usuario, Vacuna
)
from .permissions import IsAdmin, IsRefugio, IsRefugioOrAdmin
from .serializers import (
    AlergiaCondicionSerializer, AnimalSerializer, CirugiaSerializer,
    DonacionesEspecificasSerializer, FichaMedicaSerializer,
    HogarTemporalSerializer, ListaVacunasAnimalSerializer,
    ListaVacunasEspecieSerializer, LoginSerializer, NecesidadRefugioSerializer,
    PostulacionRefugioSerializer, RefugioSerializer, SolicitudAdopcionSerializer,
    TratamientoSerializer, UserSerializer, VacunaSerializer
)

logger = logging.getLogger(__name__)

class DonacionMedicaRespuestaView(APIView):
    def post(self, request, pk):
        try:
            donacion = DonacionesEspecificas.objects.get(id_donacion_especifica=pk)
            comprobante1 = request.FILES.get('comprobante_refugio_1')
            comprobante2 = request.FILES.get('comprobante_refugio_2')
            comentario = request.data.get('comentario', '')
            if comprobante1:
                donacion.comprobante_refugio_1 = comprobante1
            if comprobante2:
                donacion.comprobante_refugio_2 = comprobante2
            if comentario:
                donacion.notas = comentario
            donacion.estado_uso = 'respondida'
            donacion.save()
            # Devolver URLs absolutas de los comprobantes subidos
            comprobante1_url = request.build_absolute_uri(donacion.comprobante_refugio_1.url) if donacion.comprobante_refugio_1 else None
            comprobante2_url = request.build_absolute_uri(donacion.comprobante_refugio_2.url) if donacion.comprobante_refugio_2 else None
            return Response({
                'detail': 'Respuesta registrada correctamente.',
                'comprobante_refugio_1': comprobante1_url,
                'comprobante_refugio_2': comprobante2_url
            }, status=status.HTTP_200_OK)
        except DonacionesEspecificas.DoesNotExist:
            return Response({'error': 'Donación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)       

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def descartar_donacion_medica(request, donacion_id):
    try:
        motivo = request.data.get('motivo_descartar', '')
        donacion_especifica = DonacionesEspecificas.objects.get(id_donacion_especifica=donacion_id)
        donacion_especifica.estado_uso = 'descartado'
        if motivo:
            donacion_especifica.notas = f"Motivo de descarte: {motivo}"
        else:
            donacion_especifica.notas = "Donación descartada sin motivo especificado."
        donacion_especifica.save()
        return Response({"detail": "Donación descartada correctamente."}, status=200)
    except DonacionesEspecificas.DoesNotExist:
        return Response({"error": "Donación no encontrada."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


# Endpoint para obtener donaciones médicas de un usuario
class DonacionesMedicasUsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_usuario):
        donaciones = DonacionesEspecificas.objects.filter(id_usuario_id=id_usuario).order_by('-fecha_creacion')
        serializer = DonacionesEspecificasSerializer(donaciones, many=True, context={'request': request})
        return Response(serializer.data)

class DonacionesMedicasRefugioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_refugio):
        import logging
        logger = logging.getLogger("donaciones_medicas")
        # Obtener todas las donaciones médicas del refugio, ordenadas por fecha_creacion descendente
        donaciones_especificas = DonacionesEspecificas.objects.filter(
            id_refugio=id_refugio
        ).order_by("-fecha_creacion")
        logger.info(f"Donaciones específicas encontradas: {donaciones_especificas}")
        resultado = []
        for donacion in donaciones_especificas:
            animal = donacion.id_animal
            # Obtener la foto principal del animal (primer elemento de fotos si existe)
            foto_animal = None
            if animal and hasattr(animal, 'fotos') and isinstance(animal.fotos, list) and len(animal.fotos) > 0:
                foto_animal = animal.fotos[0]
            # Comprobante del donador (comprobante_imagen)
            comprobante_url = None
            if donacion.comprobante_imagen:
                comprobante_url = request.build_absolute_uri(donacion.comprobante_imagen.url)
            comentario = donacion.notas or ""
            vacuna_nombre = donacion.nombre_vacuna or ""
            usuario_nombre = donacion.nombre_donador or None
            respuesta_refugio = None
            if donacion.estado_uso == 'respondida':
                respuesta_refugio = {
                    "fotos": [
                        request.build_absolute_uri(donacion.comprobante_refugio_1.url) if donacion.comprobante_refugio_1 else None,
                        request.build_absolute_uri(donacion.comprobante_refugio_2.url) if donacion.comprobante_refugio_2 else None
                    ],
                    "comentario": comentario,
                    "estado": donacion.estado_uso
                }
            resultado.append({
                "id": donacion.id_donacion_especifica,
                "monto": float(donacion.monto_unitario),
                "animal": {
                    "id_animal": getattr(animal, 'id_animal', None),
                    "nombre": getattr(animal, 'nombre', None),
                    "foto": foto_animal
                } if animal else None,
                "comprobante_url": comprobante_url,
                "comentario": comentario,
                "vacuna_nombre": vacuna_nombre,
                "donador_nombre": usuario_nombre,
                "respuesta_refugio": respuesta_refugio,
                "estado_uso": donacion.estado_uso,
                "fecha_creacion": donacion.fecha_creacion
            })
        return Response(resultado)


class ListaVacunasAnimalViewSet(viewsets.ModelViewSet):
    queryset = ListaVacunasAnimal.objects.all()
    serializer_class = ListaVacunasAnimalSerializer

class ListaVacunasEspecieViewSet(viewsets.ModelViewSet):
    queryset = ListaVacunasEspecie.objects.all()
    serializer_class = ListaVacunasEspecieSerializer
    permission_classes = [permissions.IsAuthenticated]


# Endpoint para iniciar donación Webpay Plus
@api_view(['POST'])
@permission_classes([AllowAny])
def iniciar_donacion_webpay(request):
    logger = logging.getLogger("webpay_donacion")
    logger.warning(f"Headers: {dict(request.headers)}")
    logger.warning(f"Body: {request.body}")
    logger.warning(f"Data: {request.data}")
    # Loguear el token recibido en la cabecera Authorization
    auth_header = request.headers.get('Authorization')
    logger.warning(f"Authorization header: {auth_header}")
    # Loguear los valores y tipos exactos de las credenciales Webpay
    logger.warning(f"WEBPAY_API_KEY: {repr(getattr(settings, 'WEBPAY_API_KEY', None))} (type: {type(getattr(settings, 'WEBPAY_API_KEY', None))})")
    logger.warning(f"WEBPAY_COMMERCE_CODE: {repr(getattr(settings, 'WEBPAY_COMMERCE_CODE', None))} (type: {type(getattr(settings, 'WEBPAY_COMMERCE_CODE', None))})")
    logger.warning(f"WEBPAY_ENVIRONMENT: {repr(getattr(settings, 'WEBPAY_ENVIRONMENT', None))} (type: {type(getattr(settings, 'WEBPAY_ENVIRONMENT', None))})")

    monto = request.data.get('monto')
    email = request.data.get('email', 'donante@reco.cl')
    if not monto:
        logger.warning("No se recibió el monto en la solicitud.")
        return Response({'error': 'Monto requerido'}, status=status.HTTP_400_BAD_REQUEST)

    import random, string
    buy_order = ''.join(random.choices(string.ascii_uppercase + string.digits, k=20))
    session_id = str(uuid.uuid4())
    return_url = request.build_absolute_uri('/api/webpay/retorno/')
    import traceback
    try:
        # Configurar credenciales y ambiente
        from transbank.common.options import WebpayOptions
        options = WebpayOptions(
            settings.WEBPAY_API_KEY,
            settings.WEBPAY_COMMERCE_CODE,
            settings.WEBPAY_ENVIRONMENT
        )
        tx = Transaction(options)
        response = tx.create(buy_order, session_id, monto, return_url)
        return Response({
            'url': response['url'],
            'token': response['token'],
            'buy_order': buy_order,
            'session_id': session_id
        })
    except Exception as e:
        logger.error(f"Error en iniciar_donacion_webpay: {e}")
        logger.error(traceback.format_exc())
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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


@api_view(["GET"])
@permission_classes([AllowAny])
def listar_refugios_bancarios(request):
    refugios = Refugio.objects.all()
    resultado = []
    for refugio in refugios:
        resultado.append({
            "id_refugio": refugio.id_refugio,
            "nombre": refugio.nombre,
            "region": refugio.region,
            "banco": refugio.banco,
            "tipo_cuenta": refugio.tipo_cuenta,
            "numero_cuenta": refugio.numero_cuenta,
            "rut_titular": refugio.rut_titular,
            "titular_cuenta": refugio.titular_cuenta,
            "email_bancario": refugio.email_bancario,
        })
    return Response(resultado)

# Endpoint para logout seguro
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        user = request.user
        Token.objects.filter(user=user).delete()
        return Response({"detail": "Logout exitoso"}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error en logout: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def registrar_donacion_vacuna(request):
    """
    Espera: {
        'id_usuario': int,
        'id_refugio': int,
        'id_animal': int,
        'nombre_vacuna': str,
        'tipo_vacuna': str,
        'fecha_aplicacion': str (YYYY-MM-DD),
        'monto': float
    }
    """
    import logging
    logger = logging.getLogger("donacion_vacuna")
    data = request.data
    try:
        refugio_id = data.get('id_refugio')
        animal_id = data.get('id_animal')
        nombre_vacuna = data.get('nombre_vacuna')
        tipo_vacuna = data.get('tipo_vacuna', 'unica')
        fecha_aplicacion = data.get('fecha_aplicacion')
        monto = data.get('monto', 0)
        imagen = request.FILES.get('imagen')
        usuario = request.user if request.user.is_authenticated else None
        logger.info(f"Datos recibidos: usuario={usuario}, refugio_id={refugio_id}, animal_id={animal_id}, nombre_vacuna={nombre_vacuna}, monto={monto}")
        logger.info(f"Archivos recibidos: {request.FILES}")
        if not imagen:
            logger.error("No se recibió imagen de comprobante.")
            return Response({'error': 'Debes subir el comprobante de transferencia (imagen).'}, status=400)
        try:
            refugio = Refugio.objects.get(id_refugio=refugio_id)
        except Exception as e:
            logger.error(f"Error obteniendo refugio: {e}")
            return Response({'error': f'Refugio no encontrado: {e}'}, status=400)
        try:
            animal = Animal.objects.get(id_animal=animal_id)
        except Exception as e:
            logger.error(f"Error obteniendo animal: {e}")
            return Response({'error': f'Animal no encontrado: {e}'}, status=400)
        servicio = CatalogoServicios.objects.filter(categoria='vacuna', nombre__icontains=nombre_vacuna).first()
        if not servicio:
            servicio = CatalogoServicios.objects.create(
                categoria='vacuna',
                nombre=nombre_vacuna,
                descripcion=f'Vacuna {nombre_vacuna}',
                costo_promedio=monto,
                especie_aplicable='ambos',
                frecuencia='',
                es_obligatorio=False,
                activo=True
            )
        try:
            # Si no se envía nombre_donador, usar el nombre del usuario autenticado
            nombre_donador = data.get('nombre_donador', '')
            if not nombre_donador and usuario:
                nombre_donador = str(usuario)
                if hasattr(usuario, 'get_full_name') and usuario.get_full_name():
                    nombre_donador = usuario.get_full_name()
                elif hasattr(usuario, 'first_name') and usuario.first_name:
                    nombre_donador = usuario.first_name
                elif hasattr(usuario, 'username'):
                    nombre_donador = usuario.username
            donacion_especifica = DonacionesEspecificas.objects.create(
                id_servicio=servicio,
                id_animal=animal,
                id_refugio=refugio,
                id_usuario=usuario,
                cantidad=1,
                monto_unitario=monto,
                estado_uso='pendiente',
                nombre_vacuna=nombre_vacuna,
                comentario_donador=data.get('comentario_donador', ''),
                nombre_donador=nombre_donador,
                comprobante_imagen=imagen,
                comprobante_refugio_1=request.FILES.get('comprobante_refugio_1'),
                comprobante_refugio_2=request.FILES.get('comprobante_refugio_2')
            )
        except Exception as e:
            logger.error(f"Error creando DonacionesEspecificas: {e}")
            return Response({'error': f'Error al crear la donación: {e}'}, status=500)
        try:
            vacuna = Vacuna.objects.create(
                animal=animal,
                nombre=nombre_vacuna,
                tipo=tipo_vacuna,
                fecha_aplicacion=fecha_aplicacion
            )
        except Exception as e:
            logger.error(f"Error creando vacuna: {e}")
            return Response({'error': f'Error al registrar la vacuna: {e}'}, status=500)
        serializer = DonacionesEspecificasSerializer(donacion_especifica)
        logger.info(f"Donación específica creada: {donacion_especifica.id_donacion_especifica}")
        return Response({
            'id_donacion_especifica': donacion_especifica.id_donacion_especifica,
            'donacion_especifica': serializer.data,
            'vacuna_id': vacuna.id,
            'animal_id': animal.id_animal,
            'refugio_id': refugio.id_refugio
        }, status=201)
    except Exception as e:
        logger.error(f"Error general en registrar_donacion_vacuna: {e}")
        return Response({'error': str(e)}, status=500)


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


# Endpoint para listar y crear fichas médicas
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
            import traceback
            debug_info['error'] = str(e)
            debug_info['traceback'] = traceback.format_exc()
            debug_info['mensaje'] = 'Error interno en el backend. Por favor revisa el detalle para depurar.'
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
        # Mapear campos alternativos del frontend a los del modelo
        data = request.data.copy()
        if 'titularCuenta' in data:
            data['titular_cuenta'] = data['titularCuenta']
        if 'emailBancario' in data:
            data['email_bancario'] = data['emailBancario']
        serializer = RefugioSerializer(refugio, data=data, partial=partial, context={'request': request})
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
class VacunaViewSet(viewsets.ModelViewSet):
    serializer_class = VacunaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Vacuna.objects.all()
        animal_id = self.kwargs.get('animal_id')
        if animal_id:
            queryset = queryset.filter(animal_id=animal_id)
        return queryset

    @action(detail=False, methods=['get'], url_path='por-especie', permission_classes=[permissions.IsAuthenticated])
    def por_especie(self, request):
        vacunas = Vacuna.objects.all()
        resultado = {}
        for vacuna in vacunas:
            especie = vacuna.especie
            if especie not in resultado:
                resultado[especie] = []
            resultado[especie].append(self.get_serializer(vacuna).data)
        return Response(resultado)



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