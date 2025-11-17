from rest_framework import viewsets
from .models_especie import Especie
from .serializers_especie import EspecieSerializer

class EspecieViewSet(viewsets.ModelViewSet):
    queryset = Especie.objects.all()
    serializer_class = EspecieSerializer
