from django.core.management.base import BaseCommand, CommandError
from registry.models import Usuario  # Importa tu modelo de usuario
from django.db import transaction

class Command(BaseCommand):
    help = 'Promueve a un usuario existente a un Administrador completo (is_staff, is_superuser, tipo_usuario="admin").'

    def add_arguments(self, parser):
        # Agregamos un argumento para pasar el email del usuario
        parser.add_argument('email', type=str, help='El email del usuario que se va a promover.')

    @transaction.atomic
    def handle(self, *args, **options):
        email = options['email']

        try:
            # 1. Encontrar al usuario por su email
            user = Usuario.objects.get(email=email)
            self.stdout.write(f'Encontrado usuario: {user.email} (ID: {user.id})')

        except Usuario.DoesNotExist:
            raise CommandError(f'Error: No se encontró ningún usuario con el email "{email}".')
        except Exception as e:
            raise CommandError(f'Error buscando al usuario: {e}')

        # 2. Promover al usuario
        try:
            user.is_staff = True
            user.is_superuser = True
            user.tipo_usuario = 'admin'
            user.save()

            # 3. Mostrar éxito
            self.stdout.write(self.style.SUCCESS(
                f'¡Éxito! El usuario {user.email} ha sido promovido a Administrador.'
            ))
            self.stdout.write(f'  - is_staff: {user.is_staff}')
            self.stdout.write(f'  - is_superuser: {user.is_superuser}')
            self.stdout.write(f'  - tipo_usuario: {user.tipo_usuario}')

        except Exception as e:
            raise CommandError(f'Error al guardar los cambios: {e}')
