// Obtener 5 animales random con foto principal (público)
export async function getAnimalesCarousel() {
  const response = await fetch(`${API_BASE}/public/animales/carousel/`);
  if (!response.ok) throw new Error('Error al obtener animales para el carrusel');
  return response.json();
}
// frontend/src/api.js
export const API_BASE = import.meta.env.VITE_API_BASE;
export async function getExampleData() {
  const response = await fetch(`${API_BASE}/example/`);
  if (!response.ok) throw new Error("Error fetching data");
  return response.json();
}

// Obtener todos los usuarios (solo admin)
export async function getUsuarios(token) {
  const response = await fetch(`${API_BASE}/admin/users/`, {
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
  if (!response.ok) throw new Error('Error al obtener usuarios');
  return response.json();
}

// Editar usuario (solo admin)
export async function updateUsuario(id, data, token) {
  const response = await fetch(`${API_BASE}/admin/users/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al editar usuario');
  return response.json();
}

// Eliminar usuario (solo admin)
export async function deleteUsuario(id, token) {
  const response = await fetch(`${API_BASE}/admin/users/${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
  if (!response.ok) throw new Error('Error al eliminar usuario');
  return true;
}

// Obtener todos los animales (refugio o admin)
export async function getAnimales(token) {
  const response = await fetch(`${API_BASE}/animales/`, {
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
  if (!response.ok) throw new Error('Error al obtener animales');
  return response.json();
}

// Obtener cantidad de animales (público)
export async function getAnimalesCount() {
  const response = await fetch(`${API_BASE}/public/animales/count/`);
  if (!response.ok) throw new Error('Error al obtener cantidad de animales');
  const data = await response.json();
  return data.count;
}

// Crear animal (refugio o admin)
export async function createAnimal(data, token) {
  const response = await fetch(`${API_BASE}/animales/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear animal');
  return response.json();
}

// Editar animal (refugio o admin)
export async function updateAnimal(id, data, token) {
  const response = await fetch(`${API_BASE}/animales/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al editar animal');
  return response.json();
}

// Cirugías
export async function getCirugias(token, animalId) {
  const url = animalId ? `${API_BASE}/cirugias/?id_animal=${animalId}` : `${API_BASE}/cirugias/`;
  const response = await fetch(url, {
    headers: { 'Authorization': `Token ${token}` },
  });
  if (!response.ok) throw new Error('Error al obtener cirugías');
  return response.json();
}

export async function createCirugia(data, token) {
  const response = await fetch(`${API_BASE}/cirugias/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear cirugía');
  return response.json();
}

export async function updateCirugia(id, data, token) {
  const response = await fetch(`${API_BASE}/cirugias/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al actualizar cirugía');
  return response.json();
}

export async function deleteCirugia(id, token) {
  const response = await fetch(`${API_BASE}/cirugias/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` },
  });
  if (!response.ok) throw new Error('Error al eliminar cirugía');
  return true;
}

// Tratamientos
export async function getTratamientos(token, animalId) {
  const url = animalId ? `${API_BASE}/tratamientos/?id_animal=${animalId}` : `${API_BASE}/tratamientos/`;
  const response = await fetch(url, {
    headers: { 'Authorization': `Token ${token}` },
  });
  if (!response.ok) throw new Error('Error al obtener tratamientos');
  return response.json();
}

export async function createTratamiento(data, token) {
  const response = await fetch(`${API_BASE}/tratamientos/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear tratamiento');
  return response.json();
}

export async function updateTratamiento(id, data, token) {
  const response = await fetch(`${API_BASE}/tratamientos/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al actualizar tratamiento');
  return response.json();
}

export async function deleteTratamiento(id, token) {
  const response = await fetch(`${API_BASE}/tratamientos/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` },
  });
  if (!response.ok) throw new Error('Error al eliminar tratamiento');
  return true;
}
