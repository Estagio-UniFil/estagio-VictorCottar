import React, { useState, useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Product } from "@/interfaces/product"
import { DataTable } from "@/components/datatable"
import DialogEditProduct from "@/components/dialogs-products/dialog-edit-product"
import DialogRemoveProduct from "@/components/dialogs-products/dialog-remove-product"
import DialogDetailsProduct from "@/components/dialogs-products/dialog-details-product"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/utils/formatCurrency";


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
          <div className="flex items-center justify-center space-x-[50px]">
            <DialogDetailsProduct product={product} />
            <DialogEditProduct product={product} onProductsChanged={onProductsChanged} />
            <DialogRemoveProduct product={product} onProductsChanged={onProductsChanged} />
          </div>
        )
      }
    }
    // {
    //   id: "actions",
    //   cell: ({ row }) => {
    //     const product = row.original
    //     return <div className="text-center"><DialogRemoveProduct product={product} onProductsChanged={onProductsChanged} /></div>;
    //   },
    // },
    // {
    //   id: "actions",
    //   cell: ({ row }) => {
    //     const product = row.original
    //     return <div className="text-center"> <DialogDetailsProduct product={product} /></div>;
    //   },
    // },
    // {
    //   id: "actions",
    //   cell: ({ row }) => {
    //     const product = row.original
    //     return <div className="text-center"> <DialogDetailsProduct product={product} /></div>;
    //   },
    // },
    // {
    //   id: "actions",
    //   cell: ({ row }) => {
    //     const product = row.original
    //     return <div className="text-center"> <DialogDetailsProduct product={product} /></div>;
    //   },
    // },
  ]

interface Props {
  products: Product[]
  onProductsChanged: () => void
}

export default function ProductsDataTable({ products, onProductsChanged }: Props) {
  // Estado para filtro
  const [filterField, setFilterField] = useState<keyof Product>("name")
  const [filterValue, setFilterValue] = useState<string>("")

  const fieldLabels: Record<keyof Product, string> = {
    id: "ID",
    name: "nome",
    code: "cód. do produto",
    quantity: "Quantidade",
    price: "preço",
  }

  // Dados filtrados dinamicamente
  const filteredProducts = useMemo(() => {
    if (!filterValue) return products
    return products.filter((prod) => {
      const val = prod[filterField]
      return String(val).toLowerCase().includes(filterValue.toLowerCase())
    })
  }, [products, filterField, filterValue])

  return (
    <div>
      <div className="flex items-center space-x-2 ml-21">
        <Input
          placeholder={`Buscar por ${fieldLabels[filterField]}`}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="w-2xl"
        />
        <Select onValueChange={(value) => {
          setFilterField(value as keyof Product)
          setFilterValue("")
        }} defaultValue="name">
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

    </div>
  )
}
