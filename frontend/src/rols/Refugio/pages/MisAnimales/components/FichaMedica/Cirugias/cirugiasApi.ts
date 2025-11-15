const API_BASE = 'http://localhost:8000/api';

export async function getCirugias(token: string, animalId: number) {
  const response = await fetch(`${API_BASE}/cirugias/?id_animal=${animalId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
  });
  if (!response.ok) throw new Error('Error al obtener cirugías');
  return response.json();
}

export async function createCirugia(data: any, token: string) {
  let headers: any = {
    'Authorization': `Token ${token}`,
  };
  let body: any = data;
  if (!(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  }
  const response = await fetch(`${API_BASE}/cirugias/`, {
    method: 'POST',
    headers,
    body,
  });
  if (!response.ok) throw new Error('Error al crear cirugía');
  return response.json();
}

export async function updateCirugia(id: number, data: any, token: string) {
  const response = await fetch(`${API_BASE}/cirugias/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al actualizar cirugía');
  return response.json();
}

export async function deleteCirugia(id: number, token: string) {
  const response = await fetch(`${API_BASE}/cirugias/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
  });
  if (!response.ok) throw new Error('Error al eliminar cirugía');
  return true;
}
