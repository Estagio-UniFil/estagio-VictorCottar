import { Product } from "@/interfaces/product";
import { API_URL, getHeaders } from "./loginService";

export async function fetchProducts(
  page: number,
  limit: number,
  filterField: keyof Product = 'name',
  filterValue: string = ''
): Promise<{ data: Product[]; total: number }> {
  try {
    const response = await fetch(`${API_URL}/products/paginated?page=${page}&limit=${limit}&filterField=${filterField}&filterValue=${filterValue}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error("Erro ao buscar produtos:", response.statusText);
      return { data: [], total: 0 };
    }

    const data = await response.json();
    return { data: data.data || [], total: data.total || 0 };
  } catch (error) {
    console.error("Erro na requisição de produtos:", error);
    return { data: [], total: 0 };
  }
}

export async function fetchProductsPaginated(
  page: number,
  limit: number,
  filterField?: keyof Product,
  filterValue?: string
): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
  const url = new URL(`${API_URL}/products/paginated`);
  url.searchParams.append('page', String(page));
  url.searchParams.append('limit', String(limit));
  if (filterField && filterValue) {
    url.searchParams.append('filterField', filterField);
    url.searchParams.append('filterValue', filterValue);
  }

  const response = await fetch(url.toString(), {
    headers: getHeaders(),
  });

  if (!response.ok) {
    console.error("Erro ao buscar produtos paginados:", response.statusText);
    return { data: [], total: 0, page, limit };
  }

  return response.json();
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
