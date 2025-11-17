// CRUD para animales
export async function getAnimales(token: string): Promise<any[]> {
    const response = await fetch(`${API_BASE}/animales/`, {
        headers: {
            'Authorization': `Token ${token}`,
        },
    });
    if (!response.ok) throw new Error('Error al obtener animales');
    return response.json();
}

// Crear vacuna para un animal (admin)
export async function createVacunaAdmin(token: string, animalId: number, data: any): Promise<any> {
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
// CRUD para listas de vacunas por especie (admin)
export async function getListasVacunasEspecie(token: string): Promise<any[]> {
    const response = await fetch(`${API_BASE}/listas-vacunas-especie/`, {
        headers: {
            'Authorization': `Token ${token}`,
        },
    });
    if (!response.ok) throw new Error('Error al obtener listas de vacunas por especie');
    return response.json();
}

export async function createListaVacunasEspecie(token: string, data: any): Promise<any> {
    const response = await fetch(`${API_BASE}/listas-vacunas-especie/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al crear lista de vacunas por especie');
    return response.json();
}
// CRUD para especies
export async function getEspecies(token: string): Promise<any[]> {
    const response = await fetch(`${API_BASE}/especies/`, {
        headers: {
            'Authorization': `Token ${token}`,
        },
    });
    if (!response.ok) throw new Error('Error al obtener especies');
    return response.json();
}

export async function createEspecie(token: string, data: any): Promise<any> {
    const response = await fetch(`${API_BASE}/especies/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al crear especie');
    return response.json();
}

import { API_BASE } from '../../../api/apiBase.js';

// Obtener usuarios (admin)
export async function getUsuarios(token: string): Promise<any[]> {
    const response = await fetch(`${API_BASE}/admin/users/`, {
        headers: {
            'Authorization': `Token ${token}`,
        },
    });
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return response.json();
}

// Actualizar usuario (admin)
export async function updateUsuario(id: number, data: any, token: string): Promise<any> {
    const response = await fetch(`${API_BASE}/admin/users/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al actualizar usuario');
    return response.json();
}

// Eliminar usuario (admin)
export async function deleteUsuario(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE}/admin/users/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Token ${token}`,
        },
    });
    if (!response.ok) throw new Error('Error al eliminar usuario');
    return;
}

export { API_BASE };
