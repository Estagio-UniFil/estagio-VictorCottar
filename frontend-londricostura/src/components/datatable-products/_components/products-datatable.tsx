import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/interfaces/product";
import { DataTable } from "@/components/datatable";
import DialogEditProduct from "@/components/dialogs-products/dialog-edit-product";
import DialogRemoveProduct from "@/components/dialogs-products/dialog-remove-product";
import DialogDetailsProduct from "@/components/dialogs-products/dialog-remove-product";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/button";

export const columns = (
  onProductsChanged: () => void
): ColumnDef<Product>[] => [
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
    accessorKey: "code",
    header: () => <div className="text-center">Cód. do produto</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("code")}</div>,
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-center">Quantidade</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("quantity")}</div>,
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center">Preço</div>,
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return <div className="text-center">{formatCurrency(price)}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center justify-evenly space-x-[-20px]">
          <DialogEditProduct product={product} onProductsChanged={onProductsChanged} />
          <DialogRemoveProduct product={product} onProductsChanged={onProductsChanged} />
          <DialogDetailsProduct product={product} />
        </div>
      );
    },
  },
];

// Definição de Props para o componente ProductsDataTable
interface Props {
  products: Product[];
  onProductsChanged: () => void;
  total: number;
  page: number;
  limit: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  filterField: keyof Product;
  setFilterField: (field: keyof Product) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
}

export default function ProductsDataTable({
  products,
  onProductsChanged,
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

  const fieldLabels: Record<keyof Product, string> = {
    id: "ID",
    name: "Nome",
    code: "Cód. do produto",
    price: "Preço",
    user: "Usuário",
  };

  const filteredProducts = useMemo(() => {
    if (!filterValue) return products;
    return products.filter((prod) => {
      const val = prod[filterField];
      return String(val).toLowerCase().includes(filterValue.toLowerCase());
    });
  }, [products, filterField, filterValue]);

  return (
    <div>
      <div className="flex items-center space-x-2 ml-21">
        <Input
          placeholder={`Buscar por ${fieldLabels[filterField]}`}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="w-2xl"
        />
        <Select
          onValueChange={(value) => {
            setFilterField(value as keyof Product);
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
            <SelectItem value="code">Cód. do produto</SelectItem>
            <SelectItem value="price">Preço</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns(onProductsChanged)} data={filteredProducts} />

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
