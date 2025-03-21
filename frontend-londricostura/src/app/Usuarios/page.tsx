"use client"

import { useEffect, useState } from "react";
import AuthCheck from '@/components/auth-check';
import HeaderPage from "@/components/header-pages";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import UsersDataTable from "@/components/datatable-user/_components/users-datatable";
import { fetchUsers } from "@/services/userService";
import { User } from "@/components/datatable-user/_interfaces/user";

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>([]);

  // Chama o serviço para buscar os usuários
  useEffect(() => {
    fetchUsers().then((data) => setUsers(data));
  }, []);

  return (
    <AuthCheck>
      <HeaderPage pageName='Usuários' />
      <div className="flex w-full">
        <div className="flex justify-end w-[95%] mt-3">
          <Button className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200" variant="ghost">
            <Plus size={16} /> Adicionar usuário
          </Button>
        </div>
      </div>
      <UsersDataTable users={users} />
    </AuthCheck>
  );
}
