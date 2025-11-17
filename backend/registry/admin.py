# Imports primero
from django.contrib import admin
from .models import PostulacionRefugio, Usuario, Refugio, Animal, HogaresTemporales, Donaciones, Suscripciones, Eventos, InscripcionesEventos, CatalogoServicios, DonacionesEspecificas, ComprobantesServicio, NecesidadesRefugio, PerfilAdoptante, Cirugia, Tratamiento, SolicitudAdopcion, AlergiaCondicion, FichaMedica, Vacuna
from .models_especie import Especie

admin.site.register(Especie)
# Imports primero
from django.contrib import admin
from .models import PostulacionRefugio, Usuario, Refugio, Animal, HogaresTemporales, Donaciones, Suscripciones, Eventos, InscripcionesEventos, CatalogoServicios, DonacionesEspecificas, ComprobantesServicio, NecesidadesRefugio, PerfilAdoptante, Cirugia, Tratamiento, SolicitudAdopcion, AlergiaCondicion, FichaMedica

@admin.register(AlergiaCondicion)
class AlergiaCondicionAdmin(admin.ModelAdmin):
    list_display = ("id", "animal", "tipo", "nombre", "descripcion", "fecha_diagnostico")
    list_filter = ("tipo", "fecha_diagnostico")
    search_fields = ("nombre", "descripcion")
# Registrar FichaMedica en el admin
@admin.register(FichaMedica)
class FichaMedicaAdmin(admin.ModelAdmin):
    list_display = ("id_ficha", "animal", "estado_salud", "peso_actual", "fecha_ultimo_control", "veterinario_responsable", "clinica")
    search_fields = ("animal__nombre", "clinica", "veterinario_responsable")

# Postulación de Refugio
@admin.register(PostulacionRefugio)
class PostulacionRefugioAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "email", "comuna", "region", "estado", "fecha_postulacion")
    list_filter = ("estado", "region")
    search_fields = ("nombre", "email", "comuna", "region")

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "tipo_usuario", "contador_voluntariados", "contador_hogares_temporales")
    search_fields = ("username", "email")  # 'nombre' cambió a 'username'

@admin.register(Refugio)
class RefugioAdmin(admin.ModelAdmin):
    list_display = ("id_refugio", "nombre", "comuna", "region", "telefono")
    search_fields = ("nombre", "comuna", "region")
    fieldsets = (
        (None, {
            'fields': ('nombre', 'direccion', 'correo_contacto', 'telefono', 'descripcion', 'region', 'comuna', 'logo', 'sitio_web', 'redes_sociales', 'horario_atencion', 'servicios_ofrecidos', 'ano_fundacion', 'personalidad_juridica', 'estado', 'banco', 'tipo_cuenta', 'numero_cuenta', 'rut_titular')
        }),
    )

@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ("id_animal", "nombre", "especie", "sexo", "fecha_cumpleanos", "estado")
    list_filter = ("estado", "especie", "sexo")
    search_fields = ("nombre", "especie", "estado")

@admin.register(HogaresTemporales)
class HogaresTemporalesAdmin(admin.ModelAdmin):
    list_display = ("id_hogar", "id_usuario", "id_animal", "estado", "fecha_postulacion", "tipo_vivienda")
    list_filter = ("estado", "tipo_vivienda")
    search_fields = ("motivo_postulacion",)

@admin.register(Donaciones)
class DonacionesAdmin(admin.ModelAdmin):
    list_display = ("id_donacion", "id_usuario", "id_refugio", "monto", "tipo", "estado", "fecha")
    list_filter = ("tipo", "estado")
    search_fields = ("transbank_token",)

@admin.register(Suscripciones)
class SuscripcionesAdmin(admin.ModelAdmin):
    list_display = ("id_suscripcion", "id_usuario", "id_refugio", "monto_mensual", "estado", "fecha_inicio", "fecha_proximo_cobro")
    list_filter = ("estado",)
    search_fields = ("id_usuario__nombre", "id_refugio__nombre")

@admin.register(Eventos)
class EventosAdmin(admin.ModelAdmin):
    list_display = ("id_evento", "id_refugio", "nombre", "fecha", "lugar")
    list_filter = ("fecha",)
    search_fields = ("nombre", "lugar")

@admin.register(InscripcionesEventos)
class InscripcionesEventosAdmin(admin.ModelAdmin):
    list_display = ("id_inscripcion", "id_usuario", "id_evento", "asistencia")
    list_filter = ("asistencia",)
    search_fields = ("id_usuario__nombre", "id_evento__nombre")


@admin.register(CatalogoServicios)
class CatalogoServiciosAdmin(admin.ModelAdmin):
    list_display = ("id_servicio", "categoria", "nombre", "costo_promedio", "especie_aplicable", "activo")
    list_filter = ("categoria", "especie_aplicable", "activo")
    search_fields = ("nombre", "descripcion")

@admin.register(DonacionesEspecificas)
class DonacionesEspecificasAdmin(admin.ModelAdmin):
    list_display = ("id_donacion_especifica", "id_donacion", "id_servicio", "cantidad", "monto_unitario", "estado_uso")
    list_filter = ("estado_uso",)
    search_fields = ("notas",)

@admin.register(ComprobantesServicio)
class ComprobantesServicioAdmin(admin.ModelAdmin):
    list_display = ("id_comprobante", "id_donacion_especifica", "tipo_documento", "fecha_subida", "verificado")
    list_filter = ("tipo_documento", "verificado")
    search_fields = ("descripcion",)

@admin.register(NecesidadesRefugio)
class NecesidadesRefugioAdmin(admin.ModelAdmin):
    list_display = ("id_necesidad", "id_refugio", "tipo", "prioridad", "estado", "monto_necesario", "monto_recaudado")
    list_filter = ("tipo", "prioridad", "estado")
    search_fields = ("descripcion",)

@admin.register(PerfilAdoptante)
class PerfilAdoptanteAdmin(admin.ModelAdmin):
    list_display = ("id_perfil", "id_usuario", "tipo_vivienda", "tiene_patio", "horas_disponibles", "nivel_energia")
    list_filter = ("tipo_vivienda", "horas_disponibles", "nivel_energia")
    search_fields = ("id_usuario__nombre",)

@admin.register(Cirugia)
class CirugiaAdmin(admin.ModelAdmin):
    list_display = ("id_cirugia", "id_animal", "tipo", "fecha", "costo", "pago_estado", "monto_pagado")
    list_filter = ("pago_estado", "tipo")
    search_fields = ("tipo", "motivo", "veterinario")

@admin.register(Tratamiento)
class TratamientoAdmin(admin.ModelAdmin):
    list_display = ("id_tratamiento", "id_animal", "tipo", "nombre", "fecha_inicio", "estado", "estado_pago", "monto_pagado")
    list_filter = ("estado", "tipo", "estado_pago")
    search_fields = ("nombre", "motivo", "veterinario")

@admin.register(SolicitudAdopcion)
class SolicitudAdopcionAdmin(admin.ModelAdmin):
    list_display = ("id_solicitud", "usuario", "animal", "estado", "fecha_solicitud")
    list_filter = ("estado",)

    # Registrar el modelo Vacuna en el admin
    @admin.register(Vacuna)
    class VacunaAdmin(admin.ModelAdmin):
        list_display = ("id", "animal", "nombre", "tipo", "fecha_aplicacion", "fecha_refuerzo", "observaciones")
        list_filter = ("tipo", "fecha_aplicacion", "nombre")
        search_fields = ("animal__nombre", "nombre", "tipo", "observaciones")