// services/userService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchUsers(): Promise<any[]> {
  const token = localStorage.getItem('access_token');
  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
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
