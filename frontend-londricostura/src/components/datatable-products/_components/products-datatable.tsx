import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/interfaces/product";
import { DataTable } from "@/components/datatable";
import DialogEditProduct from "@/components/dialogs-products/dialog-edit-product";
import DialogRemoveProduct from "@/components/dialogs-products/dialog-remove-product";
import DialogDetailsProduct from "@/components/dialogs-products/dialog-details-product";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/button";
import DialogInInventory from "@/components/dialogs-products/dialogs-inventory/dialog-in-inventory";
import DialogOutInventory from "@/components/dialogs-products/dialogs-inventory/dialog-out-inventory";
import { getAvailable, getAvailableBulk } from "@/services/inventoryService";

export const columns = (
  onProductsChanged: () => void,
  onRowRefresh: (id: number) => void
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
      accessorKey: "available",
      header: () => <div className="text-center">Estoque</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("available") ?? 0}</div>,
    },
    {
      accessorKey: "price",
      header: () => <div className="text-center">Preço Un.</div>,
      cell: ({ row }) => {
        const price = row.getValue("price") as number;
        return <div className="text-center">{formatCurrency(price)}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        const id = product.id!;

        return (
          <div className="flex items-center justify-evenly space-x-[-20px]">
            <DialogInInventory product={product} onProductAdded={() => onRowRefresh(id)} />
            <DialogOutInventory product={product} onProductAdded={() => onRowRefresh(id)} />
            <DialogEditProduct product={product} onProductsChanged={onProductsChanged} />
            <DialogRemoveProduct product={product} onProductsChanged={onProductsChanged} />
            <DialogDetailsProduct product={product} />
          </div>
        );
      },
    },
  ];

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
  const [localProducts, setLocalProducts] = useState<Product[]>(products);

  useEffect(() => {
    setLocalProducts(products);
    const ids = products.map(p => p.id!).filter(Boolean);
    if (!ids.length) return;

    getAvailableBulk(ids).then(rows => {
      const byId = new Map(rows.map(r => [r.product_id, r.available]));
      setLocalProducts(prev =>
        prev.map(p => ({ ...p, available: byId.get(p.id!) ?? 0 }))
      );
    });
  }, [products]);

  const refreshAvailable = useCallback(async (id: number) => {
    try {
      const { available } = await getAvailable(id);
      setLocalProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, available } : p))
      );
    } catch (err) {
      console.error("Erro ao atualizar disponibilidade:", err);
    }
  }, []);

  const fieldLabels: Record<keyof Product, string> = {
    id: "ID",
    name: "Nome",
    code: "Cód. do produto",
    price: "Preço",
    user: "Usuário",
    available: "Estoque",
  };

  const filteredProducts = useMemo(() => {
    const base = localProducts;
    if (!filterValue) return base;

    return base.filter((prod) => {
      const val = prod[filterField] as any;
      return String(val ?? "").toLowerCase().includes(filterValue.toLowerCase());
    });
  }, [localProducts, filterField, filterValue]);


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

      <DataTable columns={columns(onProductsChanged, refreshAvailable)} data={filteredProducts} />


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
