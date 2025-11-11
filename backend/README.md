#### Backend

Requisitos
python3

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
si eso no funciona, entonces este. funcionara directamente en los contenedores:

sudo docker compose exec backend python manage.py migrate
sudo docker compose exec backend python manage.py createsuperuser

# Creacion de Admins
## Promover Usuario
Como la cracion de admins directamente desde el Django funciona como el oyo, aqui hay un script para promover un usuario a admin:

docker-compose exec backend python manage.py promote_to_admin "tu_email_de_admin@example.com"

Ojo, primero crea el superusuario con este commando:
docker-compose exec backend python manage.py createsuperuser

Recuenda que estamos promoviendo un usuario, no creando.

## Creacion de admin
TODO: me da paja

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:8000
- **Admin Django**: http://localhost:8000/admin


# DANJO
