"use client"

import { useEffect, useState } from "react";
import AuthCheck from '@/components/auth-check';
import HeaderPage from "@/components/header-pages";
import UsersDataTable from "@/components/datatable-user/_components/users-datatable";
import { fetchUsers } from "@/services/userService";
import { User } from "@/interfaces/user";
import DialogAddUser from "@/components/dialogs-user/dialog-add-user";
import { useRouter } from "next/navigation";

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  // chama o serviço para buscar os usuários e popular a tabela.
  useEffect(() => {
    console.log('Chamando o serviço para buscar os usuários');
    fetchUsers().then((data) => setUsers(data));
  }, [router]);

  return (
    <AuthCheck>
      <HeaderPage pageName='Usuários' />
      <DialogAddUser />
      <UsersDataTable users={users} />
    </AuthCheck>
  );
}
