
const API_BASE = 'http://localhost:8000/api';

// Obtener vacunas de un animal
export async function getVacunas(token, animalId) {
  const response = await fetch(`${API_BASE}/animales/${animalId}/vacunas/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
  });
  if (!response.ok) throw new Error('Error al obtener vacunas');
  return response.json();
}

// Crear vacuna para un animal
export async function createVacuna(token, animalId, data) {
  const response = await fetch(`${API_BASE}/animales/${animalId}/vacunas/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear vacuna');
  return response.json();
}

// Eliminar vacuna
export async function deleteVacuna(token, animalId, vacunaId) {
  const response = await fetch(`${API_BASE}/animales/${animalId}/vacunas/${vacunaId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
  });
  if (!response.ok) throw new Error('Error al eliminar vacuna');
  return true;
}

// Actualizar vacuna
export async function updateVacuna(token, animalId, vacunaId, data) {
  const response = await fetch(`${API_BASE}/animales/${animalId}/vacunas/${vacunaId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al actualizar vacuna');
  return response.json();
}
