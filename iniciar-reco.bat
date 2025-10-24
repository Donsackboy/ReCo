@echo off
title ReCo - Refugio Conectado
color 0B
echo.
echo ================================
echo    🐾 INICIANDO RECO 🐾
echo   Refugio Conectado v1.0
echo ================================
echo.

REM Cambiar al directorio del proyecto
cd /d "%~dp0"

echo [1/4] 📁 Verificando directorio...
if not exist "docker-compose.yml" (
    echo ❌ Error: No se encuentra docker-compose.yml
    echo    Verifica que estés en la carpeta correcta
    pause
    exit /b 1
)

echo [2/4] 🐳 Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Docker no está instalado o no está en PATH
    echo    Instala Docker Desktop desde: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [3/4] 🛠️  Construyendo e iniciando contenedores...
docker compose up --build -d

if errorlevel 1 (
    echo ❌ Error al iniciar los contenedores
    pause
    exit /b 1
)

echo [4/4] ✅ Aplicando migraciones de base de datos...
timeout /t 5 /nobreak >nul
docker compose exec backend python manage.py migrate

echo.
echo ================================
echo    🎉 ¡RECO ESTÁ LISTO! 🎉
echo ================================
echo.
echo 📱 Frontend (React):   http://localhost:5173
echo 🔧 Backend API:        http://localhost:8000
echo 👤 Admin Django:       http://localhost:8000/admin
echo 🗃️  Base de datos:      localhost:5432
echo.
echo ⚡ Para detener: Ejecuta 'detener-reco.bat'
echo 📊 Para ver logs: Ejecuta 'ver-logs.bat'
echo.

REM Abrir automáticamente el navegador
echo 🌐 Abriendo navegador...
start http://localhost:5173

pause