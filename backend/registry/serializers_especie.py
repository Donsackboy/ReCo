from rest_framework import serializers
from .models_especie import Especie

class EspecieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especie
        fields = ['id', 'nombre']
