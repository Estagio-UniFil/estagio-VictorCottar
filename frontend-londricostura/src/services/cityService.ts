import { City } from "@/interfaces/city";
import { API_URL, getHeaders } from "./loginService";

export async function fetchCities(): Promise<City[]> {
  try {
    const response = await fetch(`${API_URL}/cities`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error("Erro ao buscar cidades:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Erro na requisição de cidades:", error);
    return [];
  }
}

export async function removeCity(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/cities/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    let msg = response.statusText || `Erro ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson.message) msg = errJson.message;
    } catch { }
    throw new Error(msg);
  }
}

export async function createCity(city: City): Promise<void> {
  const response = await fetch(`${API_URL}/cities`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(city),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}

export async function updateCity(city: City): Promise<void> {
  const response = await fetch(`${API_URL}/cities/${city.id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(city),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}
