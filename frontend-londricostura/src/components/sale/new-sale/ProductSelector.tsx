'use client'
import { useState, useEffect } from "react";
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Product } from "@/interfaces/product";
import { formatCurrency } from "@/utils/formatCurrency";
import { fetchProducts } from "@/services/productService";
import { getAvailableBulk } from "@/services/inventoryService";
import { toast } from "sonner";

interface ProductSelectorProps {
  onProductAdd: (product: Product, quantity: number, price: number) => void;
}

export default function ProductSelector({ onProductAdd }: ProductSelectorProps) {
  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const searchProducts = async (search: string) => {
    if (!search.trim()) {
      setProductResults([]);
      return;
    }

    try {
      setLoading(true);

      const result = await fetchProducts(1, 20, "name", search);

      let productsWithStock: Product[] = Array.isArray(result)
        ? result
        : Array.isArray((result as any)?.data)
        ? (result as any).data
        : [];

      const productIds = productsWithStock
        .map((p) => p?.id)
        .filter((id): id is number => typeof id === "number");

      if (productIds.length > 0) {
        const stockUnsafe = await getAvailableBulk(productIds).catch(() => []);
        const stockData: Array<{ product_id: number; available: number }> =
          Array.isArray(stockUnsafe)
            ? stockUnsafe
            : Array.isArray((stockUnsafe as any)?.data)
            ? (stockUnsafe as any).data
            : [];

        const stockMap = new Map<number, number>(
          stockData.map((s) => [Number(s.product_id), Number(s.available ?? 0)])
        );

        productsWithStock = productsWithStock
          .map((product) => ({
            ...product,
            available: stockMap.get(product.id!) || 0,
          }))
          .filter((p) => (p.available || 0) > 0);
      }

      setProductResults(productsWithStock);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast.error("Erro ao buscar produtos");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (product: Product) => {
    if (selectedQuantity <= 0) {
      toast.error("Quantidade deve ser maior que zero");
      return;
    }

    if (selectedQuantity > (product.available || 0)) {
      toast.error("Quantidade maior que o estoque disponível");
      return;
    }

    const price = selectedPrice ? parseFloat(selectedPrice) : product.price || 0;

    if (price <= 0) {
      toast.error("Preço deve ser maior que zero");
      return;
    }

    onProductAdd(product, selectedQuantity, price);

    setShowProductDialog(false);
    setSelectedQuantity(1);
    setSelectedPrice("");
    setProductSearch("");
    setProductResults([]);
  };

  const resetForm = () => {
    setSelectedQuantity(1);
    setSelectedPrice("");
  };

  useEffect(() => {
    if (showProductDialog) {
      resetForm();
    }
  }, [showProductDialog]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Adicionar Produtos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
          <DialogTrigger asChild>
            <Button 
              className="w-full cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200" 
              size="lg" 
              variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Buscar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Buscar Produto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Buscar por nome ou código</Label>
                <Input
                  placeholder="Digite o nome ou código do produto..."
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    searchProducts(e.target.value);
                  }}
                  autoFocus
                />
              </div>

              {loading && (
                <div className="text-center text-sm text-gray-500">
                  Buscando produtos...
                </div>
              )}

              <div className="max-h-96 overflow-y-auto space-y-3">
                {productResults.map((product) => (
                  <div key={product.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          Código: {product.code}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          Estoque: {product.available}
                          <span className="text-sm font-medium text-green-600">
                            {formatCurrency(product.price || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`qty-${product.id}`} className="text-xs">
                          Quantidade
                        </Label>
                        <Input
                          id={`qty-${product.id}`}
                          type="number"
                          min="1"
                          max={product.available}
                          value={selectedQuantity}
                          onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`price-${product.id}`} className="text-xs">
                          Preço unitário
                        </Label>
                        <Input
                          id={`price-${product.id}`}
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder={String(product.price || 0)}
                          value={selectedPrice}
                          onChange={(e) => setSelectedPrice(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Total: </strong>
                      {formatCurrency(
                        selectedQuantity * (selectedPrice ? parseFloat(selectedPrice) : (product.price || 0))
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
                      onClick={() => handleAddProduct(product)}
                      disabled={selectedQuantity > (product.available || 0) || selectedQuantity <= 0}
                    >
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                ))}

                {!loading && productResults.length === 0 && productSearch.trim() && (
                  <div className="text-center text-sm text-gray-500 py-8">
                    <div>Nenhum produto encontrado</div>
                    <div className="text-xs mt-1">
                      Apenas produtos com estoque são exibidos
                    </div>
                  </div>
                )}

                {!productSearch.trim() && (
                  <div className="text-center text-sm text-gray-400 py-8">
                    Digite para buscar produtos
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
