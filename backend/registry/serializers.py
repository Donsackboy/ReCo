
from django.conf import settings
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Usuario, HogaresTemporales, Refugio

class RefugioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refugio
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ('id', 'username', 'email', 'tipo_usuario', 'first_name', 'last_name', 'telefono')

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