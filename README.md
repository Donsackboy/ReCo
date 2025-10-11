# 🐾 ReCo - Refugio Conectado

Plataforma web integral para la gestión y conexión de refugios de animales, facilitando la adopción, donaciones, y voluntariado.

**Proyecto:** INF276 - Ingeniería, Informática y Sociedad
**Profesor**: Mauricio Olivares
**Universidad:** Universidad Técnica Federico Santa María
**Año:** 2025

## 📋 Descripción

ReCo es una plataforma que conecta refugios de animales con personas interesadas en adoptar, hacer donaciones o ser voluntarios. La aplicación facilita la gestión integral de refugios y mejora la experiencia de los usuarios en el proceso de adopción de mascotas.

### ✨ Características Principales

- 🏠 **Gestión de Refugios**: Registro y administración completa de refugios
- 🐕 **Catálogo de Animales**: Visualización detallada de animales disponibles para adopción
- 💝 **Sistema de Donaciones**: Donaciones únicas y recurrentes
- 🏡 **Hogares Temporales**: Conexión con familias dispuestas a cuidar temporalmente (por ver)
- 📅 **Eventos y Voluntariado**: Organización de eventos y actividades de voluntariado
- 🗺️ **Mapa Interactivo**: Localización de refugios (por ver)
- 📱 **Notificaciones**: Sistema de alertas y comunicaciones por ver)
- 👤 **Dashboard Personalizado**: Paneles específicos para usuarios y refugios

## 🛠️ Tecnologías

### Backend

- **Framework**: Django 4.2+ con Django REST Framework
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT Token Authentication
- **Tareas Asíncronas**: Celery + Redis
- **Contenedorización**: Docker

### Frontend

- **Framework**: React 18+ con Vite
- **Enrutamiento**: React Router
- **Estado Global**: Context API / Redux Toolkit
- **Estilos**: CSS Modules / Styled Components
- **Mapas**: Leaflet / Google Maps API

### Infraestructura

- **Contenedores**: Docker & Docker Compose
- **Proxy Reverso**: Nginx
- **CI/CD**: GitHub Actions
- **Hosting**: Heroku / DigitalOcean

## 📁 Estructura del Proyecto

```
ReCo/
│
├── backend/                    # Django + Django REST Framework
│   ├── reco/                   # Proyecto principal
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   ├── apps/
│   │   ├── usuarios/           # App de usuarios y autenticación
│   │   ├── refugios/           # App de refugios
│   │   ├── animales/           # App de animales
│   │   ├── donaciones/         # App de donaciones y suscripciones
│   │   ├── hogares_temporales/ # App de hogares temporales
│   │   ├── eventos/            # App de eventos y voluntariado
│   │   └── notificaciones/     # App de notificaciones
│   │
│   ├── requirements.txt
│   ├── Dockerfile
│   └── manage.py
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── pages/              # Páginas principales
│   │   ├── services/           # API calls
│   │   ├── hooks/              # Custom hooks
│   │   ├── context/            # Context providers
│   │   └── utils/              # Utilidades
│   │
│   ├── package.json
│   ├── Dockerfile
│   └── vite.config.js
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)
- Python 3.9+ (para desarrollo local)
- Git

### 🔧 Instalación y Ejecución

1. **Clonar y configurar**
   ```bash
   git clone https://github.com/Donsackboy/ReCo.git
   cd ReCo/ReCo
   cp .env.example .env
   ```

2. **Ejecutar con Docker**
   ```bash
   docker compose up --build
   ```

3. **Configurar base de datos (primera vez)**
   ```bash
   docker compose exec backend python manage.py migrate
   docker compose exec backend python manage.py createsuperuser
   ```

### 🌐 Acceso Local
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Django**: http://localhost:8000/admin

### 🛠️ Desarrollo Local (Opcional)

<details>
<summary>Configuración para desarrollo sin Docker</summary>

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
</details>

## 📚 APIs y Endpoints

### Autenticación

- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/register/` - Registrar usuario
- `POST /api/auth/logout/` - Cerrar sesión

### Refugios

- `GET /api/refugios/` - Listar refugios
- `POST /api/refugios/` - Crear refugio
- `GET /api/refugios/{id}/` - Detalle de refugio

### Animales

- `GET /api/animales/` - Listar animales
- `POST /api/animales/` - Crear animal
- `GET /api/animales/{id}/` - Detalle de animal

### Donaciones

- `POST /api/donaciones/` - Realizar donación
- `GET /api/donaciones/suscripciones/` - Gestionar suscripciones

## 🧪 Testing

### Backend

```bash
cd backend
python manage.py test
```

### Frontend

```bash
cd frontend
npm run test
```


## 📦 Despliegue

### Producción con Docker

1. **Configurar variables de entorno de producción**
2. **Construir imágenes**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```
3. **Ejecutar en producción**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

### Estándares de Código

- **Backend**: Seguir PEP 8 para Python
- **Frontend**: Usar ESLint y Prettier
- **Commits**: Usar Conventional Commits

## 🔄 Estado del Proyecto

🟡 **En Desarrollo** - Versión 1.0.0
