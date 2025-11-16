# ...existing code...
#!/usr/bin/env bash
set -euo pipefail

# Determinar directorio del script y root del repo de forma relativa
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

# Levantar servicios necesarios
docker compose up -d

# Intentar ejecutar un comando dentro del contenedor con reintentos
run_with_retries() {
  local cmd="$*"
  local max=12
  local i=1
  until docker compose exec backend sh -c "$cmd"; do
    if [ "$i" -ge "$max" ]; then
      echo "Fallo al ejecutar: $cmd" >&2
      return 1
    fi
    echo "Esperando backend/DB (intento $i/$max)..."
    i=$((i+1))
    sleep 5
  done
  return 0
}

run_with_retries "python manage.py migrate --noinput"

# Crear superusuario admin@reco.cl por defecto si no existe
run_with_retries "python manage.py initadmin"
echo "Superusuario admin@reco.cl verificado/creado."
echo "Migraciones aplicadas correctamente."