@echo off
title Deteniendo ReCo
color 0C
echo.
echo ================================
echo    🛑 DETENIENDO RECO 🛑
echo ================================
echo.

cd /d "%~dp0"

echo [1/2] 🛑 Deteniendo contenedores...
docker compose down

echo [2/2] 🧹 Limpiando recursos...
docker system prune -f --volumes >nul 2>&1

echo.
echo ================================
echo    ✅ RECO DETENIDO ✅
echo ================================
echo.
pause