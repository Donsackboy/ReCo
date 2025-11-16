// services/refugioService.ts
import type { Refugio, RefugioFormData } from "../types/Refugio";

// Ajusta según tu configuración de Django
const API_BASE = "http://localhost:8000"; // URL de tu backend Django

export const refugioService = {
  // Cambiamos el endpoint admin por el normal temporalmente
  getRefugiosAdmin: async (): Promise<Refugio[]> => {
    const token = localStorage.getItem("token");
    // Usamos el endpoint normal en vez del admin
    const response = await fetch(`${API_BASE}/registry/refugios/`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching refugios: ${response.statusText}`);
    }

    return response.json();
  },

  // Crear refugio
  createRefugio: async (refugioData: RefugioFormData): Promise<Refugio> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/registry/refugios/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(refugioData),
    });

    if (!response.ok) {
      throw new Error(`Error creating refugio: ${response.statusText}`);
    }

    return response.json();
  },

  // Actualizar refugio
  updateRefugio: async (
    id: number,
    refugioData: RefugioFormData
  ): Promise<Refugio> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/registry/refugios/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(refugioData),
    });

    if (!response.ok) {
      throw new Error(`Error updating refugio: ${response.statusText}`);
    }

    return response.json();
  },

  // Eliminar refugio
  deleteRefugio: async (id: number): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/registry/refugios/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting refugio: ${response.statusText}`);
    }
  },
};
