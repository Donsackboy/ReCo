from django.db import migrations

def crear_especies_default(apps, schema_editor):
    Especie = apps.get_model('registry', 'Especie')
    Especie.objects.get_or_create(nombre='Perro')
    Especie.objects.get_or_create(nombre='Gato')

class Migration(migrations.Migration):
    dependencies = [
        ('registry', '0034_especie'),
    ]
    operations = [
        migrations.RunPython(crear_especies_default),
    ]
