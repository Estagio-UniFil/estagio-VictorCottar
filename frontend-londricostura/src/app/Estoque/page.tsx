'use client'
import ProductsDataTable from "@/components/datatable-products/_components/products-datatable";
import DialogAddProduct from "@/components/dialogs-products/dialog-add-product";
import HeaderPage from "@/components/header-pages";
import { Product } from "@/interfaces/product";
import { fetchProductsPaginated } from "@/services/productService";
import { FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Estoque() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [filterField, setFilterField] = useState<keyof Product>("name");
  const [filterValue, setFilterValue] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshProducts = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchProductsPaginated(page, limit, filterField, filterValue).then((result) => {
      setProducts(result.data);
      setTotal(result.total);
    });
  }, [page, limit, filterField, filterValue, refreshTrigger]);

  return (
    <>
      <HeaderPage pageName='Estoque' />
      <div className="flex justify-end mb-12">
        <div className="flex items-center space-x-6 mr-15">
          <Link
            href="/Estoque/Logs"
            className="inline-flex items-center mt-3 gap-2 px-3 py-2 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
          >
            <FileText size={18} />
            <p className="text-[15px]">Movimentações</p>
          </Link>
          <DialogAddProduct onProductAdded={refreshProducts} />
        </div>
      </div>
      <ProductsDataTable
        products={products}
        onProductsChanged={refreshProducts}
        total={total}
        page={page}
        limit={limit}
        setPage={setPage}
        filterField={filterField}
        setFilterField={setFilterField}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
    </>
  )
}