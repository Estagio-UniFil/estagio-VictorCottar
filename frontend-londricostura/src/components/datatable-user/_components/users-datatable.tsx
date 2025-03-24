"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "../_interfaces/user"
import { DataTable } from "@/components/datatable"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    header: () => <div className="ml-22">Ativo</div>, 
    cell: ({ row }) => {
      const isActive = row.getValue("active")
      return (
        <div className="flex items-center justify-around gap-2">
          <div>{isActive ? "Sim" : "Não"}</div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="p-2 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200 cursor-pointer"
              onClick={() => handleEdit(row.getValue("id"))}
            >
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              className="p-2 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors duration-200 cursor-pointer"
              onClick={() => handleDelete(row.getValue("id"))}
            >
              <Trash2  />
            </Button>
          </div>
        </div>
      )
    }
  }
]

// Funções placeholder para as ações
const handleEdit = (id: string | number) => {
  console.log(`Editando usuário ${id}`)
}

const handleDelete = (id: string | number) => {
  console.log(`Excluindo usuário ${id}`)
}

interface Props {
  users: User[];
}

export default function UsersDataTable({ users }: Props) {
  return (
    <DataTable columns={columns} data={users} />
  )
}