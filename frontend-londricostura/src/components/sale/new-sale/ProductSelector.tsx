'use client'
import { useState, useCallback, useRef, useEffect } from "react";
import { Plus, Search, Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Product } from "@/interfaces/product";
import { formatCurrency } from "@/utils/formatCurrency";
import { fetchProducts } from "@/services/productService";
import { getAvailableBulk } from "@/services/inventoryService";
import { toast } from "sonner";

interface ProductSelectorProps {
  onProductAdd: (product: Product, quantity: number, price: number) => void;
}

interface ProductFilters {
  search: string;
  name: string;
  code: string;
}

export default function ProductSelector({ onProductAdd }: ProductSelectorProps) {
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    name: "",
    code: "",
  });

  const debouncedSearch = useCallback((currentFilters: ProductFilters) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    const hasFilter = Object.values(currentFilters).some(value => value.trim() !== '');

    if (!hasFilter) {
      setProductResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        let result;

        if (currentFilters.search.trim()) {
          result = await fetchProducts(1, 20, "name", currentFilters.search.trim());
        } else if (currentFilters.name.trim()) {
          result = await fetchProducts(1, 20, "name", currentFilters.name.trim());
        } else if (currentFilters.code.trim()) {
          result = await fetchProducts(1, 20, "code", currentFilters.code.trim());
        } else {
          // Se não tem busca específica, busca tudo
          result = await fetchProducts(1, 20);
        }

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
        console.error('Erro ao buscar produtos:', error);
        toast.error("Erro ao buscar produtos");
        setProductResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  const handleFilterChange = (field: keyof ProductFilters, value: string) => {
    const newFilters = { ...filters };

    if (field === 'search') {
      newFilters.name = "";
      newFilters.code = "";
    } else {
      newFilters.search = "";
    }

    newFilters[field] = value;

    setFilters(newFilters);
    debouncedSearch(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      search: "",
      name: "",
      code: "",
    };
    setFilters(emptyFilters);
    debouncedSearch(emptyFilters);
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
    clearAllFilters();
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

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Buscar Produto</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Busca Geral</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite nome ou código do produto..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="flex-1"
                  />
                  {filters.search && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFilterChange('search', '')}
                    >
                      <X className="w-4 h-4 cursor-pointer hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors duration-200" />
                    </Button>
                  )}
                </div>
              </div>

              <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200">
                    <Filter className="w-4 h-4" />
                    Filtros Avançados
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 pt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Nome</Label>
                      <Input
                        placeholder="Filtrar por nome..."
                        value={filters.name}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Código</Label>
                      <Input
                        placeholder="Filtrar por código..."
                        value={filters.code}
                        onChange={(e) => handleFilterChange('code', e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="w-full cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
                  >
                    Limpar Todos os Filtros
                  </Button>
                </CollapsibleContent>
              </Collapsible>

              {loading && (
                <div className="text-center text-sm text-gray-500 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    Buscando produtos...
                  </div>
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

                {!loading && productResults.length === 0 &&
                  Object.values(filters).some(v => v.trim() !== '') && (
                    <div className="text-center text-sm text-gray-500 py-8">
                      <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      Nenhum produto encontrado com os filtros aplicados
                      <div className="text-xs mt-1">
                        Apenas produtos com estoque são exibidos
                      </div>
                    </div>
                  )}

                {!loading && productResults.length === 0 &&
                  Object.values(filters).every(v => v.trim() === '') && (
                    <div className="text-center text-sm text-gray-500 py-8">
                      <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      Digite algo para buscar produtos
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
