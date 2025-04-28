'use client'
import DialogAddProduct from "@/components/dialogs-products/dialog-add-product";
import HeaderPage from "@/components/header-pages";
import { Product } from "@/interfaces/product";
import { fetchProducts } from "@/services/productService";
import { useEffect, useState } from "react";

export default function Estoque() {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshProducts = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchProducts().then((data) => setProducts(data));
  }, [refreshTrigger]);


  return (
    <>
      <HeaderPage pageName='Estoque' />
      <DialogAddProduct onProductAdded={refreshProducts} />
    </>
  )
}