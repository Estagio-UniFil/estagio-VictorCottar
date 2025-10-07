'use client'
import { ColumnDef } from "@tanstack/react-table"
import { Sale } from "@/interfaces/sale"
import { DataTable } from "@/components/datatable"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link"
import { Plus } from "lucide-react"

const columns = (onSaleChanged: () => void): ColumnDef<Sale>[] => [
  {
    accessorKey: "id",
    header: () => <div className="text-center">ID</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "costumer_name",
    header: () => <div className="text-center">Cliente</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("costumer_name")}</div>,
  },
  {
    id: "items_count",
    header: () => <div className="text-center">Itens</div>,
    cell: ({ row }) => {
      const sale = row.original;
      const itemCount = sale.items?.length || 0;
      return (
        <div className="text-center">
          {itemCount > 1 ? `+${itemCount - 1} item(s)` : "1 item"}
        </div>
      );
    },
  },
  {
    id: "product_name",
    header: () => <div className="text-center">Produto</div>,
    cell: ({ row }) => {
      const sale = row.original;
      const itemCount = sale.items?.length || 0;
      const productName = sale.items?.[0]?.product_name || 'N/A';
      return (
        <div className="text-center">
           {itemCount === 1 ? productName : `${productName} (+${itemCount - 1} item${itemCount > 1 ? 's' : productName})`}
        </div>
      );
    },
  },
  {
    id: "product_code",
    header: () => <div className="text-center">Cód. Produto</div>,
    cell: ({ row }) => {
      const sale = row.original;
      const itemCount = sale.items?.length || 0;
      const productCode = sale.items?.[0]?.product_code || 'N/A';
      return (
        <div className="text-center">
          {itemCount === 1 ? productCode : `${productCode} (+${itemCount - 1} item${itemCount > 2 ? 's' : productCode})`}
        </div>
      );
    },
  },
  {
    id: "quantity",
    header: () => <div className="text-center">Quantidade</div>,
    cell: ({ row }) => {
      const sale = row.original;
      const firstItem = sale.items?.[0];
      return <div className="text-center">{firstItem?.quantity || 0}</div>;
    },
  },
  {
    id: "price",
    header: () => <div className="text-center">Valor Unitário</div>,
    cell: ({ row }) => {
      const sale = row.original;
      const firstItem = sale.items?.[0];
      const price = firstItem?.price ? parseFloat(firstItem.price.toString()) : 0;
      return (
        <div className="text-center">
          {formatCurrency(price)}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: () => <div className="text-center">Data</div>,
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      const formattedDate = date ? new Date(date).toLocaleDateString('pt-BR') : '-';
      return (
        <div className="text-center">
          {formattedDate}
        </div>
      );
    },
  },
  {
    id: "total",
    header: () => <div className="text-center">Total</div>,
    cell: ({ row }) => {
      const sale = row.original;
      const total = sale.items?.reduce((sum, item) => {
        const itemTotal = item.total || (item.quantity * parseFloat(item.price?.toString() || '0'));
        return sum + itemTotal;
      }, 0) || 0;

      return (
        <div className="text-center font-medium">
          R$ {total.toFixed(2)}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Ações</div>,
    cell: ({ row }) => {
      const sale = row.original;
      return (
        <div className="flex items-center justify-center space-x-2">
          <Button variant="outline" className="cursor-pointer font-medium items-center rounded-lg transition-colors duration-200 p-3 hover:bg-blue-100 hover:text-blue-700" size="sm">
            Ver Detalhes
          </Button>
        </div>
      );
    },
  },
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
          defaultValue="costumer_name"
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