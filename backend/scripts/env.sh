#!/usr/bin/env bash
# ...existing code...
# Activate backend venv if present (safe to `source env.bash`)
VENV_DIR="$(dirname -- "${BASH_SOURCE[0]}")/venv"

# If already inside a venv, do nothing
if [ -n "${VIRTUAL_ENV:-}" ]; then
  return 0 2>/dev/null || exit 0
fi

if [ -d "$VENV_DIR" ]; then
  # shellcheck disable=SC1090
  source "$VENV_DIR/bin/activate"
else
  echo "Virtualenv no encontrado en: $VENV_DIR"
  echo "Crea uno con: cd /home/sannfabio/usm/repos/ReCo/backend && python3 -m venv venv"
fi