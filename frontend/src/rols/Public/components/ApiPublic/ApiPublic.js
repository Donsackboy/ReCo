import { API_BASE } from '../../../../api/apiBase.js';

// Obtener 5 animales random con foto principal (público)
export async function getAnimalesCarousel() {
	const response = await fetch(`${API_BASE}/public/animales/carousel/`);
	if (!response.ok) throw new Error('Error al obtener animales para el carrusel');
	return response.json();
}

// Obtener cantidad de animales (público)
export async function getAnimalesCount() {
	const response = await fetch(`${API_BASE}/public/animales/count/`);
	if (!response.ok) throw new Error('Error al obtener cantidad de animales');
	const data = await response.json();
	return data.count;
}
// Obtener todos los animales (público)
export async function getAnimales() {
    const response = await fetch(`${API_BASE}/public/animales/`);
    if (!response.ok) throw new Error('Error al obtener animales');
    return response.json();
}
