import { API_BASE } from '../api';

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
