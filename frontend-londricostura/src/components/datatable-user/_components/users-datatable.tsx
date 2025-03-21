"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "../_interfaces/user"
import { DataTable } from "@/components/datatable"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <div>{row.getValue("id")}</div>
    }
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      return <div>{row.getValue("name")}</div>
    }
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div>{row.getValue("email")}</div>
    }
  },
  {
    accessorKey: "admin",
    header: "Admin",
    cell: ({ row }) => {
      const isAdmin = row.getValue("admin")
      return <div>{isAdmin ? "Sim" : "Não"}</div>
    }
  },
  {
    accessorKey: "active",
    header: "Ativo",
    cell: ({ row }) => {
      const isActive = row.getValue("active")
      return <div>{isActive ? "Sim" : "Não"}</div>
    }
  },
]

interface Props {
  users: User[];
}

export default function UsersDataTable({ users }: Props) {
  return (
    <DataTable columns={columns} data={users} />
  )
}