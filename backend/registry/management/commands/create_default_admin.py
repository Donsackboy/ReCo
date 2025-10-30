from django.core.management.base import BaseCommand
from registry.models import Usuario

class Command(BaseCommand):
    help = 'Crea un usuario admin por defecto si no existe.'

    def handle(self, *args, **options):
        email = 'admin@reco.cl'
        password = 'adminreco2025'
        if not Usuario.objects.filter(email=email).exists():
            Usuario.objects.create_superuser(
                email=email,
                username='admin',
                password=password,
                tipo_usuario='admin'
            )
            self.stdout.write(self.style.SUCCESS(f'Usuario admin creado: {email}'))
        else:
            self.stdout.write(self.style.WARNING(f'El usuario admin ya existe: {email}'))
