from registry.models import Refugio, Usuario, Animal, FichaMedica, SolicitudAdopcion, Cirugia, Tratamiento
from django.contrib.auth import get_user_model
from django.utils import timezone

# Buscar o crear refugio
refugio, _ = Refugio.objects.get_or_create(nombre='mm', defaults={
    'comuna': 'Santiago',
    'region': 'Metropolitana',
    'descripcion': 'Refugio de prueba para poblar datos',
})

# Buscar usuario y asociar al refugio si corresponde
User = get_user_model()
usuario = User.objects.filter(username='mm').first()
if usuario and not usuario.refugio:
    usuario.refugio = refugio
    usuario.save()

# Crear un perro
perro = Animal.objects.create(
    nombre='Firulais',
    especie='Perro',
    tipo_edad='anios',
    edad=3,
    sexo='Macho',
    tamano='Mediano',
    estado='disponible',
    refugio=refugio,
    descripcion='Perro juguetón y amigable',
    fecha_ingreso=timezone.now().date(),
    ubicacion_actual='refugio',
)

# Ficha médica
FichaMedica.objects.create(
    animal=perro,
    estado_salud='sano',
    peso_actual=18.5,
    fecha_ultimo_control=timezone.now().date(),
    veterinario_responsable='Dra. López',
)

# Solicitud de adopción
SolicitudAdopcion.objects.create(
    usuario=usuario,
    animal=perro,
    nombre='Juan Perez',
    direccion='Calle Falsa 123',
    fecha_nacimiento='1990-01-01',
    telefono='123456789',
    email='juan@correo.com',
    rol_familia='Padre',
    estado='pendiente',
)

# Cirugía
Cirugia.objects.create(
    id_animal=perro,
    tipo='Esterilización',
    fecha=timezone.now().date(),
    costo=50000,
    veterinario='Dra. López',
)

# Tratamiento
Tratamiento.objects.create(
    id_animal=perro,
    tipo='Antiparasitario',
    nombre='Ivermectina',
    fecha_inicio=timezone.now().date(),
    dosis='1 tableta',
    via_administracion='Oral',
    estado='finalizado',
)

print('Datos de ejemplo agregados para el refugio mm.')
