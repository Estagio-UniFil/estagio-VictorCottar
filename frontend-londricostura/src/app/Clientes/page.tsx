'use client'
import DialogAddCity from "@/components/dialogs-city/dialog-add-city";
import DialogAddClient from "@/components/dialogs-clients/dialog-add-client";
import HeaderPage from "@/components/header-pages";
import { Product } from "@/interfaces/product";
import { fetchProductsPaginated } from "@/services/productService";
import { useEffect, useState } from "react";

export default function Clientes() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [filterField, setFilterField] = useState<keyof Product>("name");
  const [filterValue, setFilterValue] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshClients = () => {
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
      <HeaderPage pageName='Clientes' />
      <div className="flex justify-end mb-12">
        <div className="flex items-center space-x-4 mr-15">
          <DialogAddCity  />
          <DialogAddClient onClientAdded={refreshClients} />
        </div>
      </div>
      
    </>
  )
}