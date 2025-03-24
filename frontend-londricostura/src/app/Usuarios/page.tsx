"use client"

import { useEffect, useState } from "react";
import AuthCheck from '@/components/auth-check';
import HeaderPage from "@/components/header-pages";
import UsersDataTable from "@/components/datatable-user/_components/users-datatable";
import { fetchUsers } from "@/services/userService";
import { User } from "@/components/datatable-user/_interfaces/user";
import ButtonAddUser from "@/components/button-add-user";

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>([]);

  // chama o serviço para buscar os usuários e popular a tabela.
  useEffect(() => {
    fetchUsers().then((data) => setUsers(data));
  }, []);

  return (
    <AuthCheck>
      <HeaderPage pageName='Usuários' />
      <ButtonAddUser />
      <UsersDataTable users={users} />
    </AuthCheck>
  );
}
