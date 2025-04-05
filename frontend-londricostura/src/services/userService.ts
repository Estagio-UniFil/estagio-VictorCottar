import { User } from "@/interfaces/user";
import { API_URL, getHeaders } from './api';

export async function fetchUsers(): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error("Erro ao buscar usuários:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Erro na requisição:", error);
    return [];
  }
}

export async function removeUser(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error("Erro ao remover usuário:", response.statusText);
    }

  } catch (error) {
    console.error("Erro ao remover usuário:", error);
  }
}

export async function inactivateUser(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/users/inactivate/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error("Erro ao inativar usuário:", response.statusText);
    }

  } catch (error) {
    console.error("Erro ao inativar usuário:", error);
  }
}

export async function createUser(user: User): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(user)
    });

    if (!response.ok) {
      console.error("Erro ao criar usuário:", response.statusText);
    }

  } catch (error) {
    console.error("Erro ao criar usuário:", error);
  }
}

export async function updateUser(user: User): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/users/${user.id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(user)
    });

    if (!response.ok) {
      console.error("Erro ao atualizar usuário:", response.statusText);
    }

  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
  }
}

export async function promoteUser(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/users/promote/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error("Erro ao promover usuário:", response.statusText);
    }

  } catch (error) {
    console.error("Erro ao promover usuário:", error);
  }
}