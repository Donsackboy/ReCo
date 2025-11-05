from rest_framework import serializers
# --- Solicitud de Adopción ---
from .models import SolicitudAdopcion

class SolicitudAdopcionSerializer(serializers.ModelSerializer):
    def get_animal_nombre(self, obj):
        try:
            return obj.animal.nombre if obj.animal else None
        except Exception:
            return None

    animal_nombre = serializers.SerializerMethodField()

    class Meta:
        model = SolicitudAdopcion
        fields = '__all__'
        extra_fields = ['animal_nombre']
from .models import PostulacionRefugio, Usuario, HogaresTemporales, Refugio, Animal, HistorialMedico, Cirugia, Tratamiento, AlergiaCondicion
from django.conf import settings
from django.contrib.auth import authenticate

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
    class Meta:
        model = Refugio
        fields = '__all__'

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
class AnimalSerializer(serializers.ModelSerializer):
    refugio = serializers.PrimaryKeyRelatedField(queryset=Refugio.objects.all())
    sexo = serializers.ChoiceField(choices=[
        "Macho", "Hembra"
    ], required=False, allow_null=True)
    tamano = serializers.ChoiceField(choices=[
        "Pequeño", "Pequeño-Grande", "Media", "Mediano", "Mediano-Grande", "Grande", "Gigante"
    ], required=False, allow_null=True)
    class Meta:
        model = Animal
        fields = '__all__'

# Serializer para Historial Médico
class HistorialMedicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialMedico
        fields = '__all__'

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