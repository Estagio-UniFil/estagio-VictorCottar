import { Client } from "@/interfaces/client";
import { API_URL, getHeaders } from "./loginService";

export async function fetchClients(): Promise<Client[]> {
  try {
    const response = await fetch(`${API_URL}/clients`, {
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
  const response = await fetch(`${API_URL}/clients/${id}`, {
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

export async function createClient(client: Client): Promise<void> {
  const response = await fetch(`${API_URL}/clients`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(client),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}

export async function updateClient(client: Client): Promise<void> {
  const response = await fetch(`${API_URL}/clients/${client.id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(client),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}
