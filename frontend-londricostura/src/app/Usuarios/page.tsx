"use client"

import { useEffect, useState } from "react";
import HeaderPage from "@/components/header-pages";
import UsersDataTable from "@/components/datatable-user/_components/users-datatable";
import { fetchUsers } from "@/services/userService";
import { User } from "@/interfaces/user";
import DialogAddUser from "@/components/dialogs-user/dialog-add-user";

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Função para forçar atualização da lista
  const refreshUsers = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Busca usuários sempre que refreshTrigger mudar
  useEffect(() => {
    console.log('Chamando o serviço para buscar os usuários');
    fetchUsers().then((data) => setUsers(data));
  }, [refreshTrigger]);

  return (
    <>
      <HeaderPage pageName='Usuários' />
      <DialogAddUser onUserAdded={refreshUsers} />
      <UsersDataTable users={users} onUserChanged={refreshUsers} />
    </>
  );
}