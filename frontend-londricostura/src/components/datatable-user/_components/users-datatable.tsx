"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/interfaces/user";
import { DataTable } from "@/components/datatable"
import DialogRemoveUser from "@/components/dialogs-user/dialog-remove-user"
import DialogEditUser from "@/components/dialogs-user/dialog-edit-user"
import DialogPromoteUser from "@/components/dialogs-user/dialog-promote-user";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-center">ID</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center">Nome</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("name")}</div>
  },
  {
    accessorKey: "email",
    header: () => <div className="text-center">Email</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("email")}</div>
  },
  {
    accessorKey: "admin",
    header: () => <div className="text-center">Admin</div>,
    cell: ({ row }) => {
      const isAdmin = row.getValue("admin")
      return <div className="text-center">{isAdmin ? "Sim" : "Não"}</div>
    }
  },
  {
    accessorKey: "active",
    header: () => <div className="text-center ">Ativo</div>,
    cell: ({ row }) => {
      const isActive = row.getValue("active")
      return (
        <div className="text-center">{isActive ? "Sim" : "Não"}</div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center justify-evenly space-x-[-15px]">
          <DialogPromoteUser user={user} />
          <DialogEditUser user={user} />
          <DialogRemoveUser user={user} />
        </div>
      )
    }
  }
]

interface Props {
  users: User[];
}

export default function UsersDataTable({ users }: Props) {
  return (
    <DataTable columns={columns} data={users} />
  )
}