# ...existing code...
#!/usr/bin/env bash
set -euo pipefail

# Script para crear/activar venv e instalar requirements.txt del backend.
# Ubicación esperada: backend/scripts/python-requisites.sh
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV_DIR="$PROJECT_ROOT/venv"
REQ_FILE="$PROJECT_ROOT/requirements.txt"

# Verificar python3
if ! command -v python3 >/dev/null 2>&1; then
  echo "Error: python3 no encontrado. Instala python3 antes de continuar."
  exit 1
fi

# Crear venv si no existe
if [ ! -d "$VENV_DIR" ]; then
  echo "Creando virtualenv en $VENV_DIR ..."
  python3 -m venv "$VENV_DIR"
fi

# Activar venv
# shellcheck disable=SC1090
source "$VENV_DIR/bin/activate"

# Actualizar pip y herramientas de build
pip install --upgrade pip setuptools wheel

# Instalar dependencias del sistema para psycopg2 si corresponde (Debian/Ubuntu)
if grep -qE '^psycopg2(-binary)?' "$REQ_FILE" 2>/dev/null; then
  if command -v apt-get >/dev/null 2>&1; then
    echo "Instalando dependencias del sistema necesarias para psycopg2 (requiere sudo)..."
    sudo apt-get update && sudo apt-get install -y build-essential libpq-dev python3-dev || true
  else
    echo "Advertencia: no se detectó apt-get. Asegúrate de tener instaladas las dependencias del sistema para psycopg2."
  fi
fi

# Instalar requirements
if [ -f "$REQ_FILE" ]; then
  echo "Instalando paquetes from $REQ_FILE ..."
  pip install -r "$REQ_FILE"
else
  echo "Error: requirements.txt no encontrado en $REQ_FILE"
  exit 1
fi

echo "Listo. Para activar el entorno manualmente: source $VENV_DIR/bin/activate"
# ...existing code...