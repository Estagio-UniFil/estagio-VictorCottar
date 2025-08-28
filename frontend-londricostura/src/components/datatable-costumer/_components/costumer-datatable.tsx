'use client'
import { ColumnDef } from "@tanstack/react-table"
import { Costumer } from "@/interfaces/costumer"
import { DataTable } from "@/components/datatable"
import { formatPhone } from "@/utils/formatPhone"
import DialogEditCostumer from "@/components/dialogs-costumers/dialog-edit-costumer"
import DialogRemoveCostumer from "@/components/dialogs-costumers/dialog-remove-costumer"
import DialogDetailsCostumer from "@/components/dialogs-costumers/dialog-details-costumer"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const columns = (onCostumerChanged: () => void): ColumnDef<Costumer>[] => [
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
      return <div className="text-center">{formatPhone(phone)}</div>;
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
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const costumer = row.original;
      return (
        <div className="flex items-center justify-evenly space-x-[-20px]">
          <DialogEditCostumer costumer={costumer} onCostumerChanged={onCostumerChanged} />
          <DialogRemoveCostumer costumer={costumer} onCostumerChanged={onCostumerChanged} />
          <DialogDetailsCostumer costumer={costumer} />
        </div>
      );
    }
  }
];

interface Props {
  costumers: Costumer[];
  onCostumerChanged: () => void;
  total: number;
  page: number;
  limit: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  filterField: keyof Costumer;
  setFilterField: (field: keyof Costumer) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
}

const fieldLabels: Record<keyof Costumer, string> = {
  id: "ID",
  name: "Nome",
  phone: "Telefone",
  city: "Cidade",
  user: "Usuário",
  street: "Rua",
  neighborhood: "Bairro",
  number: "Número",
};

export default function CostumersDataTable({
  costumers,
  onCostumerChanged,
  total,
  page,
  limit,
  setPage,
  filterField,
  setFilterField,
  filterValue,
  setFilterValue,
}: Props) {

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex items-center space-x-2 ml-21">
        <Input
          placeholder={`Buscar por ${fieldLabels[filterField]}`}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="w-xl"
        />
        <Select
          onValueChange={(value) => {
            setFilterField(value as keyof Costumer);
            setFilterValue("");
          }}
          defaultValue="name"
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Campo de filtro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="name">Nome</SelectItem>
            <SelectItem value="phone">Telefone</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns(onCostumerChanged)} data={costumers} />

      <div className="flex justify-center items-center gap-4 mb-4 h-[80px]">
        <Button
          variant="outline"
          className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Anterior
        </Button>

        <span className="text-sm">
          Página {page} de {totalPages}
        </span>

        <Button
          variant="outline"
          className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || totalPages === 0}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
