from rest_framework import serializers
from .models import ListaVacunasAnimal, ListaVacunasEspecie


class ListaVacunasAnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListaVacunasAnimal
        fields = '__all__'

class ListaVacunasEspecieSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListaVacunasEspecie
        fields = '__all__'
from django.conf import settings
from django.contrib.auth import authenticate
from .models import (
    SolicitudAdopcion, PostulacionRefugio, Usuario, HogaresTemporales, Refugio, Animal,
    Cirugia, Tratamiento, AlergiaCondicion, FichaMedica, Vacuna, NecesidadRefugio, DonacionesEspecificas
)

# --- Solicitud de Adopción ---
class SolicitudAdopcionSerializer(serializers.ModelSerializer):
    def get_animal_nombre(self, obj):
        try:
            return obj.animal.nombre if obj.animal else None
        except Exception:
            return None

    def get_foto_principal(self, obj):
        try:
            fotos = getattr(obj.animal, 'fotos', None)
            if fotos and isinstance(fotos, list) and len(fotos) > 0:
                return fotos[0]
        except Exception:
            pass
        return None

    animal_nombre = serializers.SerializerMethodField()
    foto_principal = serializers.SerializerMethodField()

    class Meta:
        model = SolicitudAdopcion
        fields = '__all__'
        extra_fields = ['animal_nombre', 'foto_principal']

# --- Ficha Médica ---
class FichaMedicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = FichaMedica
        fields = '__all__'

# --- Postulación de Refugio ---
class PostulacionRefugioSerializer(serializers.ModelSerializer):
    region = serializers.ChoiceField(choices=[
        "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío", "La Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes"
    ])
    class Meta:
        model = PostulacionRefugio
        fields = '__all__'

class RefugioSerializer(serializers.ModelSerializer):
    region = serializers.ChoiceField(
        choices=[
            "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
            "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío",
            "La Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes"
        ],
        required=False,
        allow_null=True
    )

    comprobante_donador = serializers.SerializerMethodField()
    comentario_donador = serializers.SerializerMethodField()
    usuario_nombre = serializers.SerializerMethodField()
    servicio_nombre = serializers.SerializerMethodField()

    comprobante_refugio_1 = serializers.ImageField(required=False, allow_null=True)
    comprobante_refugio_2 = serializers.ImageField(required=False, allow_null=True)

    # ------------------------------
    # MÉTODOS
    # ------------------------------


    def get_usuario_nombre(self, obj):
        # El modelo Refugio no tiene relación directa con Usuario
        # Si necesitas mostrar el nombre de usuario, debes obtenerlo por otra vía
        return None

    def get_servicio_nombre(self, obj):
        # El modelo Refugio no tiene relación directa con Servicio
        # Si necesitas mostrar el nombre de servicio, debes obtenerlo por otra vía
        return None

    # Si realmente necesitas estos campos personalizados:
    def get_comprobante_donador(self, obj):
        return getattr(obj, "comprobante_donador", None)

    def get_comentario_donador(self, obj):
        return getattr(obj, "comentario_donador", None)

    # ------------------------------
    # META
    # ------------------------------
    class Meta:
        model = Refugio
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    refugio = RefugioSerializer(read_only=True, allow_null=True, required=False)
    tipo_usuario = serializers.SerializerMethodField()  # <-- nuevo

    def get_tipo_usuario(self, obj):
        # Prioriza flags de Django (superuser/staff) sobre el campo db
        if getattr(obj, "is_superuser", False) or getattr(obj, "is_staff", False):
            return "admin"
        return obj.tipo_usuario

    class Meta:
        model = Usuario
        fields = (
            'id',
            'username',
            'email',
            'tipo_usuario',
            'first_name',
            'last_name',
            'telefono',
            'refugio',
            'is_superuser',
            'is_staff',
            'is_active',
        )

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        # tipo_usuario = data.get("tipo_usuario")
        print(f"[DEBUG] LoginSerializer.validate called with email={email}, password={'*' * len(password) if password else None}")
        user = authenticate(request=None, email=email, password=password)
        print(f"[DEBUG] authenticate returned: {user}")
        if not user:
            print(f"[DEBUG] Credenciales incorrectas para email={email}")
            raise serializers.ValidationError('Credenciales incorrectas')
        if not user.is_active:
            print(f"[DEBUG] Usuario inactivo: {email}")
            raise serializers.ValidationError('Usuario inactivo')
        print(f"[DEBUG] LoginSerializer returning user: {user} (type: {type(user)})")
        return {'user': user}

class HogarTemporalSerializer(serializers.ModelSerializer):
    class Meta:
        model = HogaresTemporales
        fields = '__all__'

# Serializer para Animal

class VacunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacuna
        fields = '__all__'

class AnimalSerializer(serializers.ModelSerializer):
    refugio = serializers.SerializerMethodField()
    sexo = serializers.ChoiceField(choices=[
        "Macho", "Hembra"
    ], required=False, allow_null=True)
    tamano = serializers.ChoiceField(choices=[
        "Pequeño", "Pequeño-Grande", "Media", "Mediano", "Mediano-Grande", "Grande", "Gigante"
    ], required=False, allow_null=True)
    vacunas = VacunaSerializer(many=True, read_only=True)

    def get_refugio(self, obj):
        if obj.refugio:
            return {
                "id_refugio": obj.refugio.id_refugio,
                "nombre": obj.refugio.nombre,
                "descripcion": obj.refugio.descripcion,
                "region": obj.refugio.region,
            }
        return None

    class Meta:
        model = Animal
        fields = '__all__'
        # Asegura que tipo_edad y edad estén incluidos explícitamente
        extra_fields = ['tipo_edad', 'edad', 'vacunas']


# Serializer para Cirugia
class CirugiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cirugia
        fields = '__all__'

# Serializer para Tratamiento
class TratamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tratamiento
        fields = '__all__'

# Serializer para AlergiaCondicion
class AlergiaCondicionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlergiaCondicion
        fields = '__all__'

# Serializer para NecesidadRefugio
class NecesidadRefugioSerializer(serializers.ModelSerializer):
    refugio = serializers.PrimaryKeyRelatedField(required=False, queryset=Refugio.objects.all())
    estado = serializers.CharField(required=False, default='activa')
    fecha_limite = serializers.DateField(required=False, allow_null=True)
    class Meta:
        model = NecesidadRefugio
        fields = '__all__'

# Serializer para Donaciones Especificas
class DonacionesEspecificasSerializer(serializers.ModelSerializer):
    donador_nombre = serializers.CharField(source='nombre_donador', default=None)
    vacuna_nombre = serializers.CharField(source='nombre_vacuna', default=None)
    animal = serializers.SerializerMethodField()
    comprobante_donador = serializers.SerializerMethodField()
    comentario_donador = serializers.SerializerMethodField()
    usuario_nombre = serializers.SerializerMethodField()
    servicio_nombre = serializers.SerializerMethodField()
    comprobante_refugio_1 = serializers.ImageField(required=False, allow_null=True)
    comprobante_refugio_2 = serializers.ImageField(required=False, allow_null=True)

    def get_animal(self, obj):
        animal = obj.id_animal
        if animal:
            fotos = getattr(animal, 'fotos', None)
            foto = fotos[0] if fotos and isinstance(fotos, list) and len(fotos) > 0 else None
            return {
                'id_animal': getattr(animal, 'id_animal', None),
                'nombre': getattr(animal, 'nombre', None),
                'foto': foto
            }
        return None

    def get_usuario_nombre(self, obj):
        usuario = obj.id_usuario
        if usuario:
            if hasattr(usuario, 'get_full_name') and usuario.get_full_name():
                return usuario.get_full_name()
            elif hasattr(usuario, 'first_name') and usuario.first_name:
                return usuario.first_name
            elif hasattr(usuario, 'username'):
                return usuario.username
            return str(usuario)
        return None

    def get_servicio_nombre(self, obj):
        servicio = obj.id_servicio
        if servicio and hasattr(servicio, 'nombre'):
            return servicio.nombre
        return None

    def get_comprobante_donador(self, obj):
        if obj.comprobante_imagen:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.comprobante_imagen.url)
            return obj.comprobante_imagen.url
        return None

    def get_comentario_donador(self, obj):
        return obj.comentario_donador or ""

    class Meta:
        model = DonacionesEspecificas
        fields = '__all__'
        extra_fields = [
            'donador_nombre', 'vacuna_nombre', 'animal', 'comprobante_donador',
            'comentario_donador', 'comprobante_refugio_1', 'comprobante_refugio_2',
            'usuario_nombre', 'servicio_nombre'
        ]