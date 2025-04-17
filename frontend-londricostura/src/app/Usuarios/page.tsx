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

  const isAdmin = localStorage.getItem('userAdmin') === 'true';

  const refreshUsers = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchUsers().then((data) => setUsers(data));
  }, [refreshTrigger]);

  return isAdmin ? (
    <>
      <HeaderPage pageName='Usuários' />
      <DialogAddUser onUserAdded={refreshUsers} />
      <UsersDataTable users={users} onUserChanged={refreshUsers} />
    </>
  ) : (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      <h1 className="text-3xl ml-60 text-neutral-400">Usuário não autorizado!</h1>
      <h1 className="text-3xl ml-60 text-neutral-400">Necessário estar logado com um usuário administrador.</h1>
    </div>
  );
}