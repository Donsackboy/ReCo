from django.core.management.base import BaseCommand
from registry.models import Usuario

class Command(BaseCommand):
    help = 'Crea el superusuario admin@reco.cl por defecto si no existe.'

    def handle(self, *args, **options):
        email = 'admin@reco.cl'
        username = 'adminreco'
        password = 'adminreco2025'
        if Usuario.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING('El usuario admin@reco.cl ya existe.'))
            return
        user = Usuario.objects.create_superuser(
            email=email,
            username=username,
            password=password,
        )
        user.tipo_usuario = 'admin'
        user.save()
        self.stdout.write(self.style.SUCCESS('Superusuario admin@reco.cl creado correctamente.'))
