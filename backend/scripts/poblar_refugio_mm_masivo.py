from registry.models import Refugio, Usuario, Animal, FichaMedica, SolicitudAdopcion, Cirugia, Tratamiento
from django.contrib.auth import get_user_model
from django.utils import timezone

# Buscar refugio exacto 'mm'
refugio = Refugio.objects.filter(nombre='mm').first()
if not refugio:
    raise Exception('No existe refugio con nombre mm')

User = get_user_model()
usuario = User.objects.filter(username='mm').first()
if not usuario:
    raise Exception('No existe usuario mm')
if not usuario.refugio:
    usuario.refugio = refugio
    usuario.save()

# Crear varios perros
for i in range(3):
    perro = Animal.objects.create(
        nombre=f'PerroTest{i+1}',
        especie='Perro',
        tipo_edad='anios',
        edad=2+i,
        sexo='Macho' if i % 2 == 0 else 'Hembra',
        tamano='Mediano',
        estado='disponible',
        refugio=refugio,
        descripcion=f'Perro de prueba número {i+1}',
        fecha_ingreso=timezone.now().date(),
        ubicacion_actual='refugio',
    )
    FichaMedica.objects.create(
        animal=perro,
        estado_salud='sano',
        peso_actual=15+i,
        fecha_ultimo_control=timezone.now().date(),
        veterinario_responsable='Dra. López',
    )
    SolicitudAdopcion.objects.create(
        usuario=usuario,
        animal=perro,
        nombre=f'Adoptante {i+1}',
        direccion=f'Calle Falsa {100+i}',
        fecha_nacimiento='1990-01-01',
        telefono=f'12345678{i}',
        email=f'adoptante{i+1}@correo.com',
        rol_familia='Padre',
        estado='pendiente',
    )
    Cirugia.objects.create(
        id_animal=perro,
        tipo='Esterilización',
        fecha=timezone.now().date(),
        costo=50000,
        veterinario='Dra. López',
    )
    Tratamiento.objects.create(
        id_animal=perro,
        tipo='Antiparasitario',
        nombre='Ivermectina',
        fecha_inicio=timezone.now().date(),
        dosis='1 tableta',
        via_administracion='Oral',
        estado='finalizado',
    )

print('Refugio mm poblado con 3 perros, fichas médicas, adopciones, cirugías y tratamientos.')
