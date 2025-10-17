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


- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Django**: http://localhost:8000/admin
