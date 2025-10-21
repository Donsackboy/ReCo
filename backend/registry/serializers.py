from django.conf import settings
from rest_framework import serializers


from django.contrib.auth import authenticate
from .models import Usuario

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ('id', 'username', 'email', 'tipo_usuario', 'first_name', 'last_name', 'telefono')

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError('Credenciales incorrectas')