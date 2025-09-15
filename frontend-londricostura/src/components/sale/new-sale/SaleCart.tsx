'use client'
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from "@/interfaces/product";
import { formatCurrency } from "@/utils/formatCurrency";
import { toast } from "sonner";

export interface SaleItem {
  product_id: number;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

interface SaleCartProps {
  items: SaleItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onUpdatePrice: (productId: number, price: number) => void;
}

export default function SaleCart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onUpdatePrice
}: SaleCartProps) {

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }
    
    const item = items.find(i => i.product_id === productId);
    if (item && newQuantity > (item.product.available || 0)) {
      toast.error("Quantidade maior que o estoque disponível");
      return;
    }
    
    onUpdateQuantity(productId, newQuantity);
  };

  const handlePriceChange = (productId: number, newPrice: number) => {
    if (newPrice <= 0) {
      toast.error("Preço deve ser maior que zero");
      return;
    }
    
    onUpdatePrice(productId, newPrice);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.total, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Itens da Venda
          </div>
          <div className="text-sm font-normal text-gray-500">
            {items.length} produto(s) • {getTotalItems()} item(ns)
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <div className="text-lg font-medium mb-2">Carrinho vazio</div>
            <div className="text-sm">Adicione produtos para começar a venda</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-medium">Produto</TableHead>
                    <TableHead className="text-center font-medium w-24">Qtd</TableHead>
                    <TableHead className="text-center font-medium w-32">Preço Un.</TableHead>
                    <TableHead className="text-center font-medium w-32">Total</TableHead>
                    <TableHead className="text-center font-medium w-20">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.product_id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm text-gray-500">{item.product.code}</div>
                          <div className="text-xs text-gray-400">
                            Estoque: {item.product.available}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          max={item.product.available}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product_id, parseInt(e.target.value) || 1)}
                          className="w-20 text-center text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={item.price}
                          onChange={(e) => handlePriceChange(item.product_id, parseFloat(e.target.value) || 0)}
                          className="w-28 text-center text-sm"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-medium text-green-600">
                          {formatCurrency(item.total)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onRemoveItem(item.product_id)}
                          className="h-8 w-8 p-0 cursor-pointer hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Total Geral */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium">Total da Venda:</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(calculateTotal())}
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {getTotalItems()} item(ns) • {items.length} produto(s)
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}