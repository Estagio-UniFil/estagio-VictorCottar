'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Costumer } from "@/interfaces/costumer"
import { DataTable } from "@/components/datatable"
import { formatPhone } from "@/utils/formatPhone"
import DialogAddCostumer from "@/components/dialogs-costumers/dialog-add-costumer"
import DialogEditCostumer from "@/components/dialogs-costumers/dialog-edit-costumer"
import DialogRemoveCostumer from "@/components/dialogs-costumers/dialog-remove-costumer"

interface Props {
  costumers: Costumer[];
  onCostumerChanged: () => void;
}

// Definição das colunas da tabela
const columns = (
  onCostumerChanged: () => void
): ColumnDef<Costumer>[] => [
    {
      accessorKey: "id",
      header: () => <div className="text-center">ID</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: () => <div className="text-center">Nome</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "phone",
      header: () => <div className="text-center">Telefone</div>,
      cell: ({ row }) => {
        const phone = row.getValue("phone") as string;
        return (
          <div className="text-center">{formatPhone(phone)}</div>
        );
      },
    },
    {
      accessorKey: "city",
      header: () => <div className="text-center">Cidade</div>,
      cell: ({ row }) => {
        const costumer = row.original;
        return (
          <div className="text-center">
            {costumer.city?.name} - {costumer.city?.state}
          </div>
        )
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const costumer = row.original;
        return (
          <div className="flex items-center justify-evenly space-x-[-20px]">
            <DialogEditCostumer costumer={costumer} onCostumerChanged={onCostumerChanged} />
            <DialogRemoveCostumer costumer={costumer} onCostumerChanged={onCostumerChanged} />
          </div>
        )
      }
    }
  ];

export default function CostumersDataTable({ costumers, onCostumerChanged }: Props) {
  return (

    <DataTable columns={columns(onCostumerChanged)} data={costumers} />
  )
}
