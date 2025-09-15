'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatPhone } from "@/utils/formatPhone";
import type { Costumer } from "@/interfaces/costumer";
import type { SaleItem } from "@/components/sale/new-sale/SaleCart";

type Props = {
  selectedCostumer: Costumer | null;
  saleItems: SaleItem[];
  saleDate: string;          // esperado no formato YYYY-MM-DD
  savingSale: boolean;
  onFinalize: () => void | Promise<void>;
  onClearAll: () => void;
  onClearCart: () => void;
};

// Exibe a string YYYY-MM-DD como DD/MM/YYYY sem criar Date (evita UTC -1 dia)
const formatDateBR = (yyyyMmDd: string) => {
  if (!yyyyMmDd) return "";
  const [y, m, d] = yyyyMmDd.split("-");
  return `${d}/${m}/${y}`;
};

export default function SaleSummary({
  selectedCostumer,
  saleItems,
  saleDate,
  savingSale,
  onFinalize,
  onClearAll,
  onClearCart,
}: Props) {
  const totalQty = saleItems.reduce((acc, it) => acc + it.quantity, 0);
  const totalAmount = saleItems.reduce((acc, it) => acc + it.total, 0);

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Resumo da Venda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cliente */}
        {selectedCostumer ? (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Cliente</div>
            <div className="p-3 bg-blue-50 rounded-lg border">
              <div className="font-medium text-blue-900">{selectedCostumer.name}</div>
              <div className="text-sm text-blue-700">
                {formatPhone(selectedCostumer.phone)}
              </div>
              {selectedCostumer.city && (
                <div className="text-sm text-blue-600">
                  {selectedCostumer.city.name} - {selectedCostumer.city.state}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Cliente</div>
            <div className="p-3 bg-gray-50 rounded-lg border border-dashed">
              <div className="text-sm text-gray-500 text-center">
                Nenhum cliente selecionado
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Data */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Data</div>
          <div className="text-sm text-gray-600">{formatDateBR(saleDate)}</div>
        </div>

        <Separator />

        {/* Itens */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Itens</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Produtos:</span>
              <span>{saleItems.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Quantidade total:</span>
              <span>{totalQty}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          {totalQty > 0 && (
            <div className="text-xs text-gray-500">
              Média por item: {formatCurrency(totalAmount / totalQty)}
            </div>
          )}
        </div>

        <Separator />

        {/* Ações */}
        <div className="space-y-3">
          <Button
            className="w-full cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
            size="lg"
            variant="outline"
            onClick={onFinalize}
            disabled={savingSale || !selectedCostumer || saleItems.length === 0}
          >
            {savingSale ? "Processando..." : "Finalizar Venda"}
          </Button>

          {(!selectedCostumer || saleItems.length === 0) && (
            <div className="text-xs text-center text-gray-500">
              {!selectedCostumer && "Selecione um cliente"}
              {!selectedCostumer && saleItems.length === 0 && " e "}
              {saleItems.length === 0 && "adicione produtos"}
              {" para finalizar"}
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm font-medium text-gray-700 mb-3">Ações Rápidas</div>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
              onClick={onClearAll}
              disabled={savingSale}
            >
              Limpar Tudo
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
              onClick={onClearCart}
              disabled={saleItems.length === 0 || savingSale}
            >
              Limpar Carrinho
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
