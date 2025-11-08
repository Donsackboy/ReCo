from rest_framework import serializers
from django.conf import settings
from django.contrib.auth import authenticate
from .models import (
    SolicitudAdopcion, PostulacionRefugio, Usuario, HogaresTemporales, Refugio, Animal,
    Cirugia, Tratamiento, AlergiaCondicion, FichaMedica, Vacuna, NecesidadRefugio
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
    region = serializers.ChoiceField(choices=[
        "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío", "La Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes"
    ], required=False, allow_null=True)
    logo = serializers.SerializerMethodField()

    def get_logo(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None
    usuario = serializers.SerializerMethodField()

    def get_usuario(self, obj):
        # Buscar el usuario asociado al refugio
        usuario = getattr(obj, 'usuario', None)
        if usuario:
            return {
                'id': usuario.id,
                'username': usuario.username,
                'email': usuario.email,
                'telefono': usuario.telefono,
                'tipo_usuario': usuario.tipo_usuario,
            }
        return None

    class Meta:
        model = Refugio
        fields = '__all__'
        extra_fields = ['usuario']

class UserSerializer(serializers.ModelSerializer):
    refugio = RefugioSerializer(read_only=True)
    class Meta:
        model = Usuario
        fields = ('id', 'username', 'email', 'tipo_usuario', 'first_name', 'last_name', 'telefono', 'refugio')

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