import { User } from "@/interfaces/user";
import { API_URL, getHeaders } from "./loginService";

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error("Erro ao buscar usuários:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Erro na requisição de usuários:", error);
    return [];
  }
}

export async function removeUser(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/users/${id}`, {
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

export async function inactivateUser(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/users/inactivate/${id}`, {
    method: "PUT",
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

export async function createUser(user: User): Promise<void> {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}

export async function updateUser(user: User): Promise<void> {
  const response = await fetch(`${API_URL}/users/${user.id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}

export async function promoteUser(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/users/promote/${id}`, {
    method: "PUT",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}

export async function demoteUser(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/users/demote/${id}`, {
    method: "PUT",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = (errJson as any).message || `Erro ${response.status}`;
    throw new Error(message);
  }
}
