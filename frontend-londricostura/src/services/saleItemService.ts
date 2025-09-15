import { SaleItem } from "@/interfaces/saleItem";
import { API_URL, getHeaders } from "./loginService";

export async function fetchSaleItems(saleId: number): Promise<SaleItem[]> {
  const response = await fetch(`${API_URL}/sale-item?saleId=${saleId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    console.error("Erro ao buscar itens da venda:", response.statusText);
    return [];
  }

  const data = await response.json();
  return data.data;
}

export async function addSaleItem(saleItem: SaleItem): Promise<void> {
  const response = await fetch(`${API_URL}/sale-item`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(saleItem),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}

export async function updateSaleItem(id: number, saleItem: SaleItem): Promise<void> {
  const response = await fetch(`${API_URL}/sale-item/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(saleItem),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}

export async function deleteSaleItem(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/sale-item/${id}`, {
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
