import { API_BASE } from '../../../Api/apiBase.js';

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

// Obtener todos los animales (admin)
export async function getAnimales(token) {
	const response = await fetch(`${API_BASE}/animales/`, {
		headers: {
			'Authorization': `Token ${token}`,
		},
	});
	if (!response.ok) throw new Error('Error al obtener animales');
	return response.json();
}

// Crear animal (admin)
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

// Editar animal (admin)
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
