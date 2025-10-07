'use client'
import HeaderPage from "@/components/header-pages";
import CostumerSelector from "@/components/sale/new-sale/CostumerSelector";
import ProductSelector from "@/components/sale/new-sale/ProductSelector";
import SaleCart, { SaleItem } from "@/components/sale/new-sale/SaleCart";
import SaleSummary from "@/components/sale/new-sale/SaleSummary";
import { Costumer } from "@/interfaces/costumer";
import { Product } from "@/interfaces/product";
import { ArrowLeft } from 'lucide-react';
import { useState } from "react";
import Link from "next/link";
import { createSale } from "@/services/saleService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const getLocalYYYYMMDD = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const isoAtLocalMidnight = (yyyyMmDd: string) => {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return new Date(y, m - 1, d).toISOString();
};

export default function NovaVenda() {
  const router = useRouter();
  const [selectedCostumer, setSelectedCostumer] = useState<Costumer | null>(null);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [saleDate, setSaleDate] = useState<string>(getLocalYYYYMMDD());
  const [savingSale, setSavingSale] = useState(false);

  const handleProductAdd = (product: Product, quantity: number, price: number) => {
    const existingItemIndex = saleItems.findIndex(item => item.product_id === product.id);

    if (existingItemIndex >= 0) {
      const updatedItems = [...saleItems];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;

      if (newQuantity > (product.available || 0)) {
        toast.error("Quantidade total maior que o estoque disponível");
        return;
      }

      updatedItems[existingItemIndex].quantity = newQuantity;
      updatedItems[existingItemIndex].total = newQuantity * updatedItems[existingItemIndex].price;
      setSaleItems(updatedItems);
    } else {
      const newItem: SaleItem = {
        product_id: product.id!,
        product,
        quantity,
        price,
        total: quantity * price
      };
      setSaleItems([...saleItems, newItem]);
    }

    toast.success("Produto adicionado ao carrinho");
  };

  // Atualizar quantidade no carrinho
  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    const updatedItems = saleItems.map(item => {
      if (item.product_id === productId) {
        return {
          ...item,
          quantity: newQuantity,
          total: newQuantity * item.price
        };
      }
      return item;
    });
    setSaleItems(updatedItems);
  };

  // Atualizar preço no carrinho
  const handleUpdatePrice = (productId: number, newPrice: number) => {
    const updatedItems = saleItems.map(item => {
      if (item.product_id === productId) {
        return {
          ...item,
          price: newPrice,
          total: item.quantity * newPrice
        };
      }
      return item;
    });
    setSaleItems(updatedItems);
  };

  const handleRemoveItem = (productId: number) => {
    setSaleItems(saleItems.filter(item => item.product_id !== productId));
    toast.success("Produto removido do carrinho");
  };

  const finalizeSale = async () => {
    if (!selectedCostumer) {
      toast.error("Selecione um cliente");
      return;
    }

    if (saleItems.length === 0) {
      toast.error("Adicione pelo menos um produto");
      return;
    }

    const userId = localStorage.getItem('userID');

    try {
      setSavingSale(true);

      const saleData = {
        costumer_id: selectedCostumer.id!,
        costumer_name: selectedCostumer.name!,
        user_id: userId,
        date: isoAtLocalMidnight(saleDate),
        items: saleItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
          sale_id: undefined
        }))
      };

      await createSale(saleData);

      toast.success("Venda realizada com sucesso!");

      setSelectedCostumer(null);
      setSaleItems([]);
      setSaleDate(getLocalYYYYMMDD());
      router.push('/Vendas');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao realizar venda";
      toast.error(errorMessage);
    } finally {
      setSavingSale(false);
    }
  };

  return (
    <>
      <div className="flex items-center w-100 p-2">
        <Link
          href="/Vendas"
          className="mt-5 ml-6 inline-flex items-center gap-2 rounded-lg transition-colors duration-200 p-3 hover:bg-blue-100 hover:text-blue-700"
        >
          <ArrowLeft size={25} />
        </Link>
        <HeaderPage pageName="Nova venda" />
      </div>

      <div className="container mx-auto p-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          <div className="lg:col-span-3 space-y-6">
            <CostumerSelector
              selectedCostumer={selectedCostumer}
              onCostumerSelect={setSelectedCostumer}
              saleDate={saleDate}
              onDateChange={setSaleDate}
            />

            <ProductSelector onProductAdd={handleProductAdd} />

            <SaleCart
              items={saleItems}
              onUpdateQuantity={handleUpdateQuantity}
              onUpdatePrice={handleUpdatePrice}
              onRemoveItem={handleRemoveItem}
            />
          </div>

          <div className="lg:col-span-1">
            <SaleSummary
              selectedCostumer={selectedCostumer}
              saleItems={saleItems}
              saleDate={saleDate}
              savingSale={savingSale}
              onFinalize={finalizeSale}
              onClearAll={() => {
                setSelectedCostumer(null);
                setSaleItems([]);
                setSaleDate(getLocalYYYYMMDD());
                toast.success("Formulário limpo");
              }}
              onClearCart={() => {
                setSaleItems([]);
                toast.success("Carrinho limpo");
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
