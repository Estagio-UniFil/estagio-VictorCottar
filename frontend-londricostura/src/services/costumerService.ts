import { Costumer } from "@/interfaces/costumer";
import { API_URL, getHeaders } from "./loginService";

interface UpdateCostumerPayload {
  id: number;
  name?: string;
  phone?: string;
  city_id?: number;
  cep?: string;
  neighborhood?: string;
  street?: string;
  number?: number;
}

interface CostumerFilters {
  search?: string;
  name?: string;
  phone?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
}

export async function fetchCostumer(
  page: number, 
  limit: number, 
  filters?: CostumerFilters
): Promise<{ data: Costumer[]; total: number }> {
  try {
    let url = `${API_URL}/costumer?page=${page}&limit=${limit}`;

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          url += `&${key}=${encodeURIComponent(value.trim())}`;
        }
      });
    }

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error("Erro ao buscar clientes:", response.statusText);
      return { data: [], total: 0 };
    }

    const data = await response.json();

    return {
      data: data.data || [],
      total: data.total || 0,
    };
  } catch (error) {
    console.error("Erro na requisição de clientes:", error);
    return { data: [], total: 0 };
  }
}

export async function fetchCostumerDetails(id: number): Promise<Costumer> {
  try {
    const response = await fetch(`${API_URL}/costumer/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar os dados do cliente");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao buscar os dados do cliente", error);
    throw error;
  }
}

export async function removeCostumer(id: number): Promise<void> {
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

export async function updateCostumer(data: UpdateCostumerPayload): Promise<void> {
  const { id, ...updateData } = data;

  const response = await fetch(`${API_URL}/costumer/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}