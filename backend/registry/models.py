from django.db import models

class Usuario(models.Model):
    class TipoUsuario(models.TextChoices):
        ADOPTANTE = "adoptante", "Adoptante"
        DONANTE = "donante", "Donante"
        VOLUNTARIO = "voluntario", "Voluntario"
        OTRO = "otro", "Otro"

    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=255)  # almacenar hash
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=150, blank=True, null=True)
    tipo_usuario = models.CharField(max_length=20, choices=TipoUsuario.choices, default=TipoUsuario.OTRO)
    contador_voluntariados = models.PositiveIntegerField(default=0)
    contador_hogares_temporales = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.nombre} <{self.email}>"

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
    region = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.nombre

class Animal(models.Model):
    class Estado(models.TextChoices):
        DISPONIBLE = "disponible", "Disponible"
        ADOPTADO = "adoptado", "Adoptado"
        HOGAR_TEMPORAL = "en_hogar_temporal", "En hogar temporal"

    id_animal = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    especie = models.CharField(max_length=50)
    edad = models.IntegerField(blank=True, null=True)
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.DISPONIBLE)
    refugio = models.ForeignKey(Refugio, on_delete=models.CASCADE, db_column="id_refugio", related_name="animales")
    busca_hogar_temporal = models.BooleanField(default=False)
    motivo_hogar_temporal = models.TextField(blank=True, null=True)
    duracion_estimada_hogar = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} ({self.especie})"