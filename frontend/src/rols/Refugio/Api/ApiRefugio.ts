// ---------------------------------------------------------------------------
// 💊 Donaciones médicas
// ---------------------------------------------------------------------------
export async function getDonacionesMedicas(refugioId: number): Promise<any> {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE}/refugio/${refugioId}/donaciones-medicas/`,
    {
      headers: token ? { Authorization: `Token ${token}` } : {},
    }
  );
  if (!response.ok) throw new Error("Error al obtener donaciones médicas");
  return response.json();
}
export async function deleteVacuna(
  token: string,
  animalId: number,
  vacunaId: number
): Promise<boolean> {
  const response = await fetch(
    `${API_BASE}/animales/${animalId}/vacunas/${vacunaId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error("Error al eliminar vacuna");
  return true;
}
import { API_BASE } from "../../../Api/apiBase.js";

export type AnimalData = Record<string, any>;
export type CirugiaData = Record<string, any>;
export type TratamientoData = Record<string, any>;
export type VacunaData = Record<string, any>;

// ---------------------------------------------------------------------------
// 🏠 Necesidades del Refugio
// ---------------------------------------------------------------------------
export async function getNecesidadesRefugio(token: string): Promise<any> {
  const response = await fetch(`${API_BASE}/necesidades-refugio/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (!response.ok) throw new Error("Error al obtener necesidades del refugio");
  return response.json();
}

export async function createNecesidadRefugio(
  data: any,
  token: string
): Promise<any> {
  const response = await fetch(`${API_BASE}/necesidades-refugio/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear necesidad");
  return response.json();
}

export async function updateNecesidadRefugio(
  id: number,
  data: any,
  token: string
): Promise<any> {
  const response = await fetch(`${API_BASE}/necesidades-refugio/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al editar necesidad");
  return response.json();
}

export async function deleteNecesidadRefugio(
  id: number,
  token: string
): Promise<boolean> {
  const response = await fetch(`${API_BASE}/necesidades-refugio/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (!response.ok) throw new Error("Error al eliminar necesidad");
  return true;
}

// ---------------------------------------------------------------------------
// 🐶 Animales (Refugio)
// ---------------------------------------------------------------------------
// 💉 Registrar donación de vacuna
export async function registrarDonacionVacuna(
  data: any,
  token: string
): Promise<any> {
  const response = await fetch(`${API_BASE}/registrar-donacion-vacuna/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al registrar donación de vacuna");
  return response.json();
}
// ---------------------------------------------------------------------------
export async function getAnimales(token: string): Promise<any> {
  const response = await fetch(`${API_BASE}/animales/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (!response.ok) throw new Error("Error al obtener animales");
  return response.json();
}

export async function createAnimal(
  data: AnimalData,
  token: string
): Promise<any> {
  const response = await fetch(`${API_BASE}/animales/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear animal");
  return response.json();
}

export async function updateAnimal(
  id: number,
  data: AnimalData,
  token: string
): Promise<any> {
  const response = await fetch(`${API_BASE}/animales/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al editar animal");
  return response.json();
}

// ---------------------------------------------------------------------------
// 🩺 Cirugías
// ---------------------------------------------------------------------------
export async function getCirugias(
  token: string,
  animalId?: number
): Promise<any> {
  const url = animalId
    ? `${API_BASE}/cirugias/?id_animal=${animalId}`
    : `${API_BASE}/cirugias/`;
  const response = await fetch(url, {
    headers: { Authorization: `Token ${token}` },
  });
  if (!response.ok) throw new Error("Error al obtener cirugías");
  return response.json();
}

export async function createCirugia(
  data: CirugiaData | FormData,
  token: string
): Promise<any> {
  let headers: any = { Authorization: `Token ${token}` };
  let body: any = data;
  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }
  const response = await fetch(`${API_BASE}/cirugias/`, {
    method: "POST",
    headers,
    body,
  });
  if (!response.ok) throw new Error("Error al crear cirugía");
  return response.json();
}

export async function updateCirugia(
  id: number,
  data: CirugiaData | FormData,
  token: string
): Promise<any> {
  let headers: any = { Authorization: `Token ${token}` };
  let body: any = data;
  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }
  const response = await fetch(`${API_BASE}/cirugias/${id}/`, {
    method: "PUT",
    headers,
    body,
  });
  if (!response.ok) throw new Error("Error al actualizar cirugía");
  return response.json();
}

export async function deleteCirugia(
  id: number,
  token: string
): Promise<boolean> {
  const response = await fetch(`${API_BASE}/cirugias/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Token ${token}` },
  });
  if (!response.ok) throw new Error("Error al eliminar cirugía");
  return true;
}

// ---------------------------------------------------------------------------
// 💊 Tratamientos
// ---------------------------------------------------------------------------
export async function getTratamientos(
  token: string,
  animalId?: number
): Promise<any> {
  const url = animalId
    ? `${API_BASE}/tratamientos/?id_animal=${animalId}`
    : `${API_BASE}/tratamientos/`;
  const response = await fetch(url, {
    headers: { Authorization: `Token ${token}` },
  });
  if (!response.ok) throw new Error("Error al obtener tratamientos");
  return response.json();
}

export async function createTratamiento(
  data: TratamientoData,
  token: string
): Promise<any> {
  const response = await fetch(`${API_BASE}/tratamientos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear tratamiento");
  return response.json();
}

export async function updateTratamiento(
  id: number,
  data: TratamientoData,
  token: string
): Promise<any> {
  const response = await fetch(`${API_BASE}/tratamientos/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al actualizar tratamiento");
  return response.json();
}

export async function deleteTratamiento(
  id: number,
  token: string
): Promise<boolean> {
  const response = await fetch(`${API_BASE}/tratamientos/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Token ${token}` },
  });
  if (!response.ok) throw new Error("Error al eliminar tratamiento");
  return true;
}

// ---------------------------------------------------------------------------
// 🐾 Adopciones pendientes del refugio
// ---------------------------------------------------------------------------
export async function getAdopcionesPendientesRefugio(
  token: string
): Promise<number> {
  const response = await fetch(`${API_BASE}/refugio/adopciones-pendientes/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (!response.ok)
    throw new Error("Error al obtener adopciones pendientes del refugio");
  const data = await response.json();
  return data.count;
}

// ---------------------------------------------------------------------------
// 📋 Ficha médica de un animal
// ---------------------------------------------------------------------------
export async function getFichaMedica(
  token: string,
  animalId: number
): Promise<any> {
  const response = await fetch(`${API_BASE}/fichamedica/${animalId}/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (!response.ok) throw new Error("Error al obtener ficha médica");
  return response.json();
}

export async function updateFichaMedica(
  token: string,
  animalId: number,
  data: any
): Promise<any> {
  const response = await fetch(`${API_BASE}/fichamedica/${animalId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al actualizar ficha médica");
  return response.json();
}

// ---------------------------------------------------------------------------
// 💉 Vacunas de un animal
// ---------------------------------------------------------------------------
export async function getVacunas(
  token: string,
  animalId: number
): Promise<any> {
  const response = await fetch(`${API_BASE}/animales/${animalId}/vacunas/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (!response.ok) throw new Error("Error al obtener vacunas");
  return response.json();
}

export async function createVacuna(
  token: string,
  animalId: number,
  data: VacunaData
): Promise<any> {
  const response = await fetch(`${API_BASE}/animales/${animalId}/vacunas/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear vacuna");
  return response.json();
}

export async function updateVacuna(
  token: string,
  animalId: number,
  vacunaId: number,
  data: VacunaData
): Promise<any> {
  const response = await fetch(
    `${API_BASE}/animales/${animalId}/vacunas/${vacunaId}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Error al actualizar vacuna");
  return response.json();
}
