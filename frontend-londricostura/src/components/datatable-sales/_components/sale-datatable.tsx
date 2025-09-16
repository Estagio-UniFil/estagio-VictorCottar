'use client'
import { ColumnDef } from "@tanstack/react-table"
import { Sale } from "@/interfaces/sale"
import { DataTable } from "@/components/datatable"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

const columns = (onSaleChanged: () => void): ColumnDef<Sale>[] => [
  {
    accessorKey: "id",
    header: () => <div className="text-center">ID</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
  },
  {
    id: "costumer_name",
    header: () => <div className="text-center">Cliente</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("costumer_name")}
      </div>
    ),
  },
  {
    id: "product_name",
    header: () => <div className="text-center">Produto</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {(row.getValue("items") as Sale["items"] | undefined)?.[0]?.product_name}
      </div>
    ),
  },
  {
    id: "product_code",
    header: () => <div className="text-center">Cód. Produto</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {(row.getValue("items") as Sale["items"] | undefined)?.[0]?.product_id}
      </div>
    ),
  },
  {
    id: "quantity",
    header: () => <div className="text-center">Quantidade</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {(row.getValue("items") as Sale["items"] | undefined)?.[0]?.quantity}
      </div>
    ),
  },
  {
    id: "price",
    header: () => <div className="text-center">Valor</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {(row.getValue("items") as Sale["items"] | undefined)?.[0]?.price}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const sale = row.original;
      return (
        <div className="flex items-center justify-evenly space-x-[-20px]">
          
        </div>
      );
    }
  }
];

interface Props {
  sales: Sale[];
  onSaleChanged: () => void;
  total: number;
  page: number;
  limit: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  filterField: keyof Sale;
  setFilterField: (field: keyof Sale) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
}

export default function SalesDataTable({
  sales,
  onSaleChanged,
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
          placeholder={`Buscar por ${filterField}`}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="w-xl"
        />
        <Select
          onValueChange={(value) => {
            setFilterField(value as keyof Sale);
            setFilterValue("");
          }}
          defaultValue="name"
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Campo de filtro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="costumer_name">Cliente</SelectItem>
            <SelectItem value="date">Data</SelectItem>
          </SelectContent>
        </Select>
        <div className="p-2 mr-20 w-1/2 flex justify-end">
          <Link
            href="/Vendas/NovaVenda"
            className="inline-flex font-medium items-center gap-2 rounded-lg transition-colors duration-200 p-2 hover:bg-blue-100 hover:text-blue-700"
          >
            <Plus size={16} />
            <span>Nova venda</span>
          </Link>
        </div>
      </div>

      <DataTable columns={columns(onSaleChanged)} data={sales} />

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
