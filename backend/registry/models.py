from django.db import models
# --- Postulación de Refugio ---
class PostulacionRefugio(models.Model):
    nombre = models.CharField(max_length=120)
    persona_contacto = models.CharField(max_length=120)
    email = models.EmailField()
    telefono = models.CharField(max_length=30)
    direccion = models.CharField(max_length=200)
    comuna = models.CharField(max_length=80)
    REGIONES_CHILE = [
        ("Arica y Parinacota", "Arica y Parinacota"),
        ("Tarapacá", "Tarapacá"),
        ("Antofagasta", "Antofagasta"),
        ("Atacama", "Atacama"),
        ("Coquimbo", "Coquimbo"),
        ("Valparaíso", "Valparaíso"),
        ("Metropolitana", "Metropolitana"),
        ("O'Higgins", "O'Higgins"),
        ("Maule", "Maule"),
        ("Ñuble", "Ñuble"),
        ("Biobío", "Biobío"),
        ("La Araucanía", "La Araucanía"),
        ("Los Ríos", "Los Ríos"),
        ("Los Lagos", "Los Lagos"),
        ("Aysén", "Aysén"),
        ("Magallanes", "Magallanes")
    ]
    region = models.CharField(max_length=80, choices=REGIONES_CHILE)
    cantidad_animales = models.PositiveIntegerField(default=0)
    tipos_animales = models.CharField(max_length=120)  # Ej: "Perros, Gatos, Otros"
    descripcion = models.TextField()
    ano_fundacion = models.CharField(max_length=10, blank=True)
    sitios_web = models.JSONField(default=list, blank=True, help_text="Lista de enlaces y redes sociales del refugio")
    personalidad_juridica = models.BooleanField(default=False)
    organizaciones_previas = models.TextField(blank=True)
    necesidades_actuales = models.TextField(blank=True)
    estado = models.CharField(max_length=20, default='pendiente')  # pendiente, aceptada, rechazada
    fecha_postulacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} ({self.comuna}, {self.region})"
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    # Hacer que email sea el campo de identificación
    username = models.CharField(max_length=150, blank=True)  # Hacerlo opcional
    email = models.EmailField(unique=True)  # Email como único
    
    USERNAME_FIELD = 'email'  # ← Usar email para login
    REQUIRED_FIELDS = ['username']  # ← username ya no es requerido
    
    TIPO_USUARIO_CHOICES = [
        ('admin', 'Administrador'),
        ('refugio', 'Refugio'),
        ('default', 'Usuario Default'),
    ]
    
    tipo_usuario = models.CharField(max_length=10, choices=TIPO_USUARIO_CHOICES, default='default')
    telefono = models.CharField(max_length=15, blank=True)
    contador_voluntariados = models.IntegerField(default=0)
    contador_hogares_temporales = models.IntegerField(default=0)
    refugio = models.OneToOneField('Refugio', on_delete=models.CASCADE, null=True, blank=True)
    
    # Agregar related_name único para evitar conflictos
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='usuario_set',  # ← Cambiado
        related_query_name='usuario',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='usuario_set',  # ← Cambiado
        related_query_name='usuario',
    )

    def __str__(self):
        return f"{self.username} ({self.tipo_usuario})"

class Refugio(models.Model):
    id_refugio = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=150, blank=True, null=True)
    correo_contacto = models.EmailField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    latitud = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitud = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    direccion_completa = models.CharField(max_length=255, blank=True, null=True)
    comuna = models.CharField(max_length=100, blank=True, null=True)
    REGIONES_CHILE = [
        ("Arica y Parinacota", "Arica y Parinacota"),
        ("Tarapacá", "Tarapacá"),
        ("Antofagasta", "Antofagasta"),
        ("Atacama", "Atacama"),
        ("Coquimbo", "Coquimbo"),
        ("Valparaíso", "Valparaíso"),
        ("Metropolitana", "Metropolitana"),
        ("O'Higgins", "O'Higgins"),
        ("Maule", "Maule"),
        ("Ñuble", "Ñuble"),
        ("Biobío", "Biobío"),
        ("La Araucanía", "La Araucanía"),
        ("Los Ríos", "Los Ríos"),
        ("Los Lagos", "Los Lagos"),
        ("Aysén", "Aysén"),
        ("Magallanes", "Magallanes")
    ]
    region = models.CharField(max_length=80, choices=REGIONES_CHILE, blank=True, null=True)

    def __str__(self):
        return self.nombre

class Animal(models.Model):
    class Estado(models.TextChoices):
        DISPONIBLE = "disponible", "Disponible"
        ADOPTADO = "adoptado", "Adoptado"
        HOGAR_TEMPORAL = "en_hogar_temporal", "En hogar temporal"
        BUSCANDO_NUEVO_HOGAR_TEMPORAL = "buscando_nuevo_hogar_temporal", "Buscando nuevo hogar temporal"

    class Sexo(models.TextChoices):
        MACHO = "Macho", "Macho"
        HEMBRA = "Hembra", "Hembra"

    class Tamano(models.TextChoices):
        PEQUENO = "Pequeño", "Pequeño"
        PEQUENO_GRANDE = "Pequeño-Grande", "Pequeño-Grande"
        MEDIA = "Media", "Media"
        MEDIANO = "Mediano", "Mediano"
        MEDIANO_GRANDE = "Mediano-Grande", "Mediano-Grande"
        GRANDE = "Grande", "Grande"
        GIGANTE = "Gigante", "Gigante"

    id_animal = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    especie = models.CharField(max_length=50)
    edad = models.IntegerField(blank=True, null=True)
    sexo = models.CharField(max_length=10, choices=Sexo.choices, blank=True, null=True)
    tamano = models.CharField(max_length=20, choices=Tamano.choices, blank=True, null=True)
    estado = models.CharField(max_length=30, choices=Estado.choices, default=Estado.DISPONIBLE)
    refugio = models.ForeignKey(Refugio, on_delete=models.CASCADE, db_column="id_refugio", related_name="animales")
    busca_hogar_temporal = models.BooleanField(default=False)
    motivo_hogar_temporal = models.TextField(blank=True, null=True, help_text="Descripción si busca hogar temporal")
    vacunas = models.JSONField(default=list, blank=True, help_text="Lista de vacunas del animal")
    motivo_cambio_hogar_temporal = models.TextField(blank=True, null=True, help_text="Motivo por el que el animal necesita cambiar de hogar temporal")
    duracion_estimada_hogar = models.CharField(max_length=50, blank=True, null=True)
    fotos = models.JSONField(default=list, blank=True, help_text="Lista de hasta 3 URLs de fotos del animal")

    def __str__(self):
        return f"{self.nombre} ({self.especie})"
    
class HogaresTemporales(models.Model):
    ESTADO_OPCIONES = [
        ('en_proceso', 'En Proceso'),
        ('aprobado', 'Aprobado'),
        ('finalizado', 'Finalizado'),
        ('rechazado', 'Rechazado'),
        ('cancelado_usuario', 'Cancelado por Usuario'),
    ]
    
    TIPO_VIVIENDA_OPCIONES = [
        ('casa', 'Casa'),
        ('departamento', 'Departamento'),
        ('otro', 'Otro'),
    ]

    id_hogar = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    id_animal = models.ForeignKey('Animal', on_delete=models.CASCADE)  # Asumiendo modelo Animal
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADO_OPCIONES, default='en_proceso')
    motivo_postulacion = models.TextField()
    experiencia_previa = models.TextField()
    tipo_vivienda = models.CharField(max_length=15, choices=TIPO_VIVIENDA_OPCIONES)
    tiene_otras_mascotas = models.BooleanField()
    duracion_disponible = models.CharField(max_length=50)
    fecha_postulacion = models.DateTimeField(auto_now_add=True)
    motivo_rechazo = models.TextField(blank=True, null=True)
    motivo_cancelacion = models.TextField(blank=True, null=True)
    fecha_cancelacion = models.DateTimeField(blank=True, null=True)
    regiones_postulacion = models.JSONField(default=list, blank=True, help_text="Lista de regiones donde el usuario acepta ser hogar temporal")
    region_hogar_temporal = models.CharField(max_length=100, blank=True, null=True, help_text="Región actual donde se encuentra el animal en hogar temporal")

    def __str__(self):
        return f"Hogar Temporal {self.id_hogar} - {self.id_usuario}"

    class Meta:
        db_table = 'hogares_temporales'
        verbose_name_plural = 'Hogares Temporales'

class Donaciones(models.Model):
    TIPO_OPCIONES = [
        ('unica', 'Única'),
        ('recurrente', 'Recurrente'),
    ]
    
    ESTADO_OPCIONES = [
        ('pendiente', 'Pendiente'),
        ('completada', 'Completada'),
        ('fallida', 'Fallida'),
    ]

    id_donacion = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    id_refugio = models.ForeignKey('Refugio', on_delete=models.CASCADE)  # Asumiendo modelo Refugio
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    tipo = models.CharField(max_length=15, choices=TIPO_OPCIONES)
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=15, choices=ESTADO_OPCIONES, default='pendiente')
    transbank_token = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Donación {self.id_donacion} - ${self.monto}"

    class Meta:
        db_table = 'donaciones'
        verbose_name_plural = 'Donaciones'

class Suscripciones(models.Model):
    ESTADO_OPCIONES = [
        ('activa', 'Activa'),
        ('pausada', 'Pausada'),
        ('cancelada', 'Cancelada'),
    ]

    id_suscripcion = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    id_refugio = models.ForeignKey('Refugio', on_delete=models.CASCADE)
    monto_mensual = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=15, choices=ESTADO_OPCIONES, default='activa')
    fecha_inicio = models.DateField(auto_now_add=True)
    fecha_proximo_cobro = models.DateField()

    def __str__(self):
        return f"Suscripción {self.id_suscripcion} - ${self.monto_mensual}/mes"

    class Meta:
        db_table = 'suscripciones'
        verbose_name_plural = 'Suscripciones'

class Eventos(models.Model):
    id_evento = models.AutoField(primary_key=True)
    id_refugio = models.ForeignKey('Refugio', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    fecha = models.DateField()
    lugar = models.CharField(max_length=150)
    descripcion = models.TextField()

    def __str__(self):
        return f"{self.nombre} - {self.fecha}"

    class Meta:
        db_table = 'eventos'
        verbose_name_plural = 'Eventos'

class InscripcionesEventos(models.Model):
    id_inscripcion = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    id_evento = models.ForeignKey('Eventos', on_delete=models.CASCADE)
    asistencia = models.BooleanField(default=False)

    def __str__(self):
        return f"Inscripción {self.id_inscripcion} - {self.id_usuario}"

    class Meta:
        db_table = 'inscripciones_eventos'
        verbose_name_plural = 'Inscripciones a Eventos'

class HistorialMedico(models.Model):
    TIPO_ATENCION_OPCIONES = [
        ('vacuna', 'Vacuna'),
        ('desparasitacion', 'Desparasitación'),
        ('cirugia', 'Cirugía'),
        ('consulta', 'Consulta'),
        ('tratamiento', 'Tratamiento'),
        ('otro', 'Otro'),
    ]

    id_historial = models.AutoField(primary_key=True)
    id_animal = models.ForeignKey('Animal', on_delete=models.CASCADE)
    tipo_atencion = models.CharField(max_length=20, choices=TIPO_ATENCION_OPCIONES)
    descripcion = models.TextField()
    veterinario = models.CharField(max_length=100)
    clinica = models.CharField(max_length=150)
    fecha = models.DateField()
    proximo_control = models.DateField(blank=True, null=True)
    costo = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    documentos_url = models.CharField(max_length=255, blank=True, null=True)
    notas = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Historial {self.id_historial} - {self.tipo_atencion}"

    class Meta:
        db_table = 'historial_medico'
        verbose_name_plural = 'Historiales Médicos'

class CatalogoServicios(models.Model):
    CATEGORIA_OPCIONES = [
        ('vacuna', 'Vacuna'),
        ('desparasitacion', 'Desparasitación'),
        ('cirugia', 'Cirugía'),
        ('tratamiento', 'Tratamiento'),
        ('examen', 'Examen'),
        ('otro', 'Otro'),
    ]
    
    ESPECIE_APLICABLE_OPCIONES = [
        ('perro', 'Perro'),
        ('gato', 'Gato'),
        ('ambos', 'Ambos'),
    ]

    id_servicio = models.AutoField(primary_key=True)
    categoria = models.CharField(max_length=20, choices=CATEGORIA_OPCIONES)
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField()
    costo_promedio = models.DecimalField(max_digits=10, decimal_places=2)
    especie_aplicable = models.CharField(max_length=10, choices=ESPECIE_APLICABLE_OPCIONES)
    frecuencia = models.CharField(max_length=50)
    es_obligatorio = models.BooleanField(default=False)
    icono_url = models.CharField(max_length=255, blank=True, null=True)
    activo = models.BooleanField(default=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nombre} - ${self.costo_promedio}"

    class Meta:
        db_table = 'catalogo_servicios'
        verbose_name_plural = 'Catálogo de Servicios'

class DonacionesEspecificas(models.Model):
    ESTADO_USO_OPCIONES = [
        ('pendiente', 'Pendiente'),
        ('utilizado', 'Utilizado'),
        ('parcial', 'Parcial'),
    ]

    id_donacion_especifica = models.AutoField(primary_key=True)
    id_donacion = models.ForeignKey('Donaciones', on_delete=models.CASCADE)
    id_servicio = models.ForeignKey('CatalogoServicios', on_delete=models.CASCADE)
    id_animal = models.ForeignKey('Animal', on_delete=models.CASCADE, blank=True, null=True)
    id_refugio = models.ForeignKey('Refugio', on_delete=models.CASCADE)
    cantidad = models.IntegerField(default=1)
    monto_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    estado_uso = models.CharField(max_length=15, choices=ESTADO_USO_OPCIONES, default='pendiente')
    fecha_uso = models.DateTimeField(blank=True, null=True)
    notas = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Donación Específica {self.id_donacion_especifica} - {self.cantidad}u"

    class Meta:
        db_table = 'donaciones_especificas'
        verbose_name_plural = 'Donaciones Específicas'

class ComprobantesServicio(models.Model):
    TIPO_DOCUMENTO_OPCIONES = [
        ('foto_animal', 'Foto del Animal'),
        ('boleta', 'Boleta'),
        ('receta', 'Receta'),
        ('carnet_vacuna', 'Carnet de Vacuna'),
        ('otro', 'Otro'),
    ]

    id_comprobante = models.AutoField(primary_key=True)
    id_donacion_especifica = models.ForeignKey('DonacionesEspecificas', on_delete=models.CASCADE)
    id_animal = models.ForeignKey('Animal', on_delete=models.CASCADE)
    tipo_documento = models.CharField(max_length=20, choices=TIPO_DOCUMENTO_OPCIONES)
    url_archivo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    fecha_subida = models.DateTimeField(auto_now_add=True)
    subido_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    verificado = models.BooleanField(default=False)
    fecha_verificacion = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Comprobante {self.id_comprobante} - {self.tipo_documento}"

    class Meta:
        db_table = 'comprobantes_servicio'
        verbose_name_plural = 'Comprobantes de Servicio'

class NecesidadesRefugio(models.Model):
    TIPO_OPCIONES = [
        ('alimento', 'Alimento'),
        ('medicamento', 'Medicamento'),
        ('servicio', 'Servicio'),
        ('articulo', 'Artículo'),
        ('otro', 'Otro'),
    ]
    
    PRIORIDAD_OPCIONES = [
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta'),
        ('urgente', 'Urgente'),
    ]
    
    ESTADO_OPCIONES = [
        ('activa', 'Activa'),
        ('cumplida', 'Cumplida'),
        ('cancelada', 'Cancelada'),
    ]

    id_necesidad = models.AutoField(primary_key=True)
    id_refugio = models.ForeignKey('Refugio', on_delete=models.CASCADE)
    tipo = models.CharField(max_length=15, choices=TIPO_OPCIONES)
    descripcion = models.CharField(max_length=200)
    monto_necesario = models.DecimalField(max_digits=10, decimal_places=2)
    monto_recaudado = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    prioridad = models.CharField(max_length=10, choices=PRIORIDAD_OPCIONES, default='media')
    estado = models.CharField(max_length=15, choices=ESTADO_OPCIONES, default='activa')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_limite = models.DateField(blank=True, null=True)
    imagen_url = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Necesidad {self.id_necesidad} - {self.descripcion}"

    class Meta:
        db_table = 'necesidades_refugio'
        verbose_name_plural = 'Necesidades de Refugio'

class PerfilAdoptante(models.Model):
    TIPO_VIVIENDA_OPCIONES = [
        ('casa', 'Casa'),
        ('depto', 'Departamento'),
    ]
    
    HORAS_DISPONIBLES_OPCIONES = [
        ('muchas', 'Muchas'),
        ('algunas', 'Algunas'),
        ('pocas', 'Pocas'),
    ]
    
    NIVEL_ENERGIA_OPCIONES = [
        ('activo', 'Activo'),
        ('moderado', 'Moderado'),
        ('tranquilo', 'Tranquilo'),
    ]

    id_perfil = models.AutoField(primary_key=True)
    id_usuario = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tipo_vivienda = models.CharField(max_length=10, choices=TIPO_VIVIENDA_OPCIONES)
    tiene_patio = models.BooleanField()
    horas_disponibles = models.CharField(max_length=10, choices=HORAS_DISPONIBLES_OPCIONES)
    nivel_energia = models.CharField(max_length=10, choices=NIVEL_ENERGIA_OPCIONES)
    tiene_mascotas = models.BooleanField()
    tiene_ninos = models.BooleanField()
    experiencia_previa = models.BooleanField()

    def __str__(self):
        return f"Perfil Adoptante - {self.id_usuario}"

    class Meta:
        db_table = 'perfil_adoptante'
        verbose_name_plural = 'Perfiles de Adoptantes'