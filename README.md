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
- 📱 **Notificaciones**: Sistema de alertas y comunicaciones (por ver)
- 👤 **Dashboard Personalizado**: Paneles específicos para usuarios y refugios

## 📊 Estado Actual del Proyecto

### ✅ Completado
- **🎨 Interfaz Frontend**: Sistema de headers responsive con tema verde
- **📱 Navegación**: Menú hamburguesa y navegación adaptativa
- **👥 Tipos de Usuario**: Headers específicos para admin, refugio, usuario y postulante
- **🔧 Desarrollo**: Scripts .bat para inicio rápido en Windows
- **📁 Estructura**: Organización modular de componentes

### 🚧 En Desarrollo
- **🔐 Autenticación**: Sistema de login y registro
- **🏠 Dashboard**: Paneles personalizados por tipo de usuario
- **🐕 Gestión de Animales**: CRUD completo de mascotas
- **🔌 Backend API**: Integración Django REST Framework

### 📋 Pendiente
- **💝 Sistema de Donaciones**: Pagos y suscripciones
- **🗺️ Mapa Interactivo**: Localización de refugios
- **📱 Notificaciones**: Sistema de alertas
- **🏡 Hogares Temporales**: Gestión de cuidado temporal

## 🛠️ Tecnologías

### Backend

- **Framework**: Django 4.2+ con Django REST Framework
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT Token Authentication
- **Tareas Asíncronas**: Celery + Redis
- **Contenedorización**: Docker

### Frontend

- **Framework**: React 18+ con TypeScript + Vite
- **Enrutamiento**: React Router DOM
- **Estilos**: CSS Modules personalizado con tema verde
- **Componentes**: Sistema modular de headers responsive
- **Estado**: Context API (implementado para autenticación)
- **Build Tool**: Vite para desarrollo rápido
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
├── frontend/                   # React + Vite + TypeScript
│   ├── public/
│   │   └── Images/            # Imágenes y assets públicos
│   │       └── reco-logo.png  # Logo del proyecto
│   │
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   │   └── Header/        # Sistema de headers
│   │   │       ├── Header.css # Estilos del header (tema verde)
│   │   │       ├── Header.tsx # Componente principal del header
│   │   │       ├── HeaderWrapper.tsx # Wrapper dinámico
│   │   │       ├── shared/    # Componentes compartidos
│   │   │       │   └── Logo.tsx
│   │   │       └── variants/  # Headers específicos por tipo de usuario
│   │   │           ├── HeaderPublic.tsx
│   │   │           ├── HeaderAdmin.tsx
│   │   │           ├── HeaderRefugio.tsx
│   │   │           └── HeaderUsuario.tsx
│   │   │
│   │   ├── pages/             # Páginas principales
│   │   │   └── Home/          # Página de inicio
│   │   │       ├── Home.tsx
│   │   │       └── Home.css
│   │   │
│   │   ├── App.tsx            # Componente principal
│   │   ├── App.css            # Estilos globales (tema verde)
│   │   ├── index.css          # Estilos base
│   │   └── main.tsx           # Punto de entrada
│   │
│   ├── package.json           # Dependencias y scripts npm
│   ├── package-lock.json      # Lock file de dependencias
│   ├── vite.config.ts         # Configuración de Vite
│   ├── tsconfig.json          # Configuración TypeScript
│   └── Dockerfile             # Contenedor Docker
│
├── iniciar-reco.bat           # 🚀 Script para iniciar desarrollo rápido
├── detener-reco.bat           # 🛑 Script para detener servicios
├── docker-compose.yml         # Configuración Docker Compose
├── .env.example               # Variables de entorno de ejemplo
└── README.md                  # Documentación del proyecto
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)
- Python 3.9+ (para desarrollo local)
- Git

### 🔧 Instalación y Ejecución

#### 🚀 Opción 1: Inicio Rápido con archivos .bat (Windows)

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Donsackboy/ReCo.git
   cd ReCo/ReCo
   ```

2. **Ejecutar directamente**
   ```bash
   # Para levantar solo el frontend (desarrollo)
   iniciar-reco.bat
   
   # Para detener los servicios
   detener-reco.bat
   ```

#### 🐳 Opción 2: Con Docker (Completo - Frontend + Backend)

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

#### 💻 Opción 3: Desarrollo Local Manual

**Frontend únicamente:**
```bash
cd frontend
npm install
npm run dev
```

**Nota:** El puerto puede variar si otros servicios están en uso. Vite automáticamente buscará un puerto disponible (5173, 5174, 5175, etc.)

### 🌐 Acceso Local

#### 🎨 Frontend (Interfaz de Usuario)
- **URL principal**: http://localhost:5173
- **URLs alternativas** (si el puerto está ocupado): 
  - http://localhost:5174
  - http://localhost:5175
  - http://localhost:5176
  - etc.

**💡 Tip**: Revisa la terminal donde ejecutaste `npm run dev` para ver el puerto exacto asignado.

#### 🔧 Backend (Solo con Docker)
- **API Backend**: http://localhost:8000
- **Panel Admin Django**: http://localhost:8000/admin

### ✨ Características Actuales

- **🎨 Tema Verde**: Interfaz completamente rediseñada con paleta de colores verde
- **📱 Header Responsivo**: Navegación adaptativa con menú hamburguesa
- **🔗 Routing**: Sistema de navegación entre páginas
- **👤 Tipos de Usuario**: Headers específicos para admin, refugio, usuario y postulante
- **🚀 Desarrollo Rápido**: Archivos .bat para Windows que facilitan el inicio

### � Solución de Problemas Comunes

#### "Puerto en uso" o "Port 5173 is in use"
```bash
# Vite automáticamente buscará el siguiente puerto disponible
# Revisa la terminal para ver el puerto asignado (ej: 5174, 5175, etc.)
```

#### "No se ve la página diseñada"
1. Verifica que estés en la URL correcta mostrada en la terminal
2. Refresca la página (F5 o Ctrl+R)
3. Limpia caché del navegador (Ctrl+Shift+R)
4. Abre en ventana privada/incógnito

#### "npm error ENOENT package.json"
```bash
# Asegúrate de estar en el directorio correcto
cd C:\ruta\completa\al\proyecto\ReCo\ReCo\frontend
npm run dev
```

#### Reiniciar servidor completamente
```bash
# Presiona Ctrl+C en la terminal donde corre el servidor
# Luego ejecuta nuevamente:
npm run dev
```

### �🛠️ Desarrollo Local (Opcional)

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
