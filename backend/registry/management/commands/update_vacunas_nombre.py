from django.core.management.base import BaseCommand
from registry.models import Vacuna

class Command(BaseCommand):
    help = 'Actualiza el campo nombre de las vacunas que tienen el valor por defecto.'

    def handle(self, *args, **options):
        vacunas = Vacuna.objects.filter(nombre='Sin nombre')
        for vacuna in vacunas:
            vacuna.nombre = vacuna.tipo.capitalize()
            vacuna.save()
        self.stdout.write(self.style.SUCCESS(f'Se actualizaron {vacunas.count()} vacunas.'))
