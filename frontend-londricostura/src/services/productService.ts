import { Product } from "@/interfaces/product";
import { API_URL, getHeaders } from "./api";

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error("Erro ao buscar produtos:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Erro na requisição de produtos:", error);
    return [];
  }
}

export async function removeProduct(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, {
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

export async function createProduct(product: Product): Promise<void> {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}

export async function updateProduct(product: Product): Promise<void> {
  const response = await fetch(`${API_URL}/products/${product.id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}
