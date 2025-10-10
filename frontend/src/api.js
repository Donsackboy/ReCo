// frontend/src/api.js
export const API_BASE = "http://backend:8000/api"; // nombre del servicio de Docker

export async function getExampleData() {
  const response = await fetch(`${API_BASE}/example/`);
  if (!response.ok) throw new Error("Error fetching data");
  return response.json();
}
