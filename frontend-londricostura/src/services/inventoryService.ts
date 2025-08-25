import { API_URL, getHeaders } from "./loginService";
import { Inventory } from "@/interfaces/inventory";

export async function createMovement(inventory: Inventory) {
  const response = await fetch(`${API_URL}/inventory`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(inventory),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = (json as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
  return json;
}

export function movementTypeIn(input: Omit<Inventory, 'movement_type'>) {
  return createMovement({ ...input, movement_type: 'IN' });
}

export function movementTypeOut(input: Omit<Inventory, 'movement_type'>) {
  return createMovement({ ...input, movement_type: 'OUT' });
}

export async function getAvailable(id: number): Promise<{ product_id: number; product?: { name: string; code: string; price: number }, available: number }> {
  const response = await fetch(`${API_URL}/inventory/available/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = (json as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }

  return json.data;
}

export async function getAvailableBulk(ids: number[]): Promise<{ product_id: number; available: number }[]> {
  if (!ids.length) return [];
  const params = new URLSearchParams({ ids: ids.join(",") });
  const res = await fetch(`${API_URL}/inventory/available?${params.toString()}`, {
    headers: getHeaders(),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || `Erro ${res.status}`);
  
  return json.data ?? [];
}

