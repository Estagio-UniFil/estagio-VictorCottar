import { Costumer } from "@/interfaces/costumer";
import { API_URL, getHeaders } from "./loginService";

export async function fetchCostumer(): Promise<Costumer[]> {
  try {
    const response = await fetch(`${API_URL}/costumer`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error("Erro ao buscar clientes:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Erro na requisição de clientes:", error);
    return [];
  }
}

export async function removeClient(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/costumer/${id}`, {
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

export async function createCostumer(costumer: Costumer): Promise<void> {
  const response = await fetch(`${API_URL}/costumer`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(costumer),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}

export async function updateClient(costumer: Costumer): Promise<void> {
  const response = await fetch(`${API_URL}/costumer/${costumer.id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(costumer),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}
