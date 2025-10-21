import { Sale } from "@/interfaces/sale";
import { SaleItem } from "@/interfaces/saleItem";
import { API_URL, getHeaders } from "./loginService";

export async function fetchSales(page: number = 1, limit: number = 10): Promise<{ data: Sale[], total: number, page: number, limit: number }> {
  const url = new URL(`${API_URL}/sale`);
  url.searchParams.append('page', String(page));
  url.searchParams.append('limit', String(limit));

  const response = await fetch(url.toString(), {
    headers: getHeaders(),
  });

  if (!response.ok) {
    console.error("Erro ao buscar vendas:", response.statusText);
    return { data: [], total: 0, page, limit };
  }

  return response.json();
}

export async function fetchSaleById(id: number): Promise<Sale | null> {
  const response = await fetch(`${API_URL}/sale/${id}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    console.error("Erro ao buscar venda:", response.statusText);
    return null;
  }

  const data = await response.json();
  return data.data;
}

export async function createSale(sale: any): Promise<void> {
  const response = await fetch(`${API_URL}/sale`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(sale),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}

export async function updateSale(id: number, sale: Sale): Promise<void> {
  const response = await fetch(`${API_URL}/sale/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(sale),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}

export async function deleteSale(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/sale/${id}`, {
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

export async function fetchSalesIndicatorsToday(): Promise<{
  totalSalesValue: number;
  customersServed: number;
  averageTicket: number;
}> {
  const response = await fetch(`${API_URL}/sale/indicators/today`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    console.error("Error ao buscar indicadores:", response.statusText);
    return {
      totalSalesValue: 0,
      customersServed: 0,
      averageTicket: 0,
    };
  }

  const result = await response.json();
  return result.data;
}

