// frontend/src/api.js
export const API_BASE = import.meta.env.VITE_API_BASE;
export async function getExampleData() {
  const response = await fetch(`${API_BASE}/example/`);
  if (!response.ok) throw new Error("Error fetching data");
  return response.json();
}
