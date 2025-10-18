from django.contrib import admin
from .models import Usuario, Refugio, Animal

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ("id_usuario", "nombre", "email", "tipo_usuario", "contador_voluntariados", "contador_hogares_temporales")
    search_fields = ("nombre", "email")

@admin.register(Refugio)
class RefugioAdmin(admin.ModelAdmin):
    list_display = ("id_refugio", "nombre", "comuna", "region", "telefono")
    search_fields = ("nombre", "comuna", "region")

@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ("id_animal", "nombre", "especie", "estado", "refugio", "busca_hogar_temporal")
    list_filter = ("estado", "especie", "busca_hogar_temporal")
    search_fields = ("nombre",)