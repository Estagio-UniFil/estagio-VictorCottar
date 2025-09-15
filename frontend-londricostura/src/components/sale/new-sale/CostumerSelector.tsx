'use client'
import { useState } from "react";
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Costumer } from "@/interfaces/costumer";
import { formatPhone } from "@/utils/formatPhone";
import { fetchCostumer } from "@/services/costumerService";
import { toast } from "sonner";

interface CostumerSelectorProps {
  selectedCostumer: Costumer | null;
  onCostumerSelect: (costumer: Costumer | null) => void;
  saleDate: string;
  onDateChange: (date: string) => void;
}

export default function CostumerSelector({
  selectedCostumer,
  onCostumerSelect,
  saleDate,
  onDateChange,
}: CostumerSelectorProps) {
  const [costumerSearch, setCostumerSearch] = useState("");
  const [costumerResults, setCostumerResults] = useState<Costumer[]>([]);
  const [showCostumerDialog, setShowCostumerDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchCostumers = async (search: string) => {
    if (!search.trim()) {
      setCostumerResults([]);
      return;
    }

    try {
      setLoading(true);
      const result = await fetchCostumer(1, 10, 'name', search);
      setCostumerResults(result.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast.error("Erro ao buscar clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleCostumerSelect = (costumer: Costumer) => {
    onCostumerSelect(costumer);
    setShowCostumerDialog(false);
    setCostumerSearch("");
    setCostumerResults([]);
  };

  const clearCostumer = () => {
    onCostumerSelect(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Dados da Venda
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="costumer">Cliente</Label>
            <div className="flex gap-2">
              <Input
                id="costumer"
                placeholder="Cliente selecionado"
                value={selectedCostumer ? selectedCostumer.name : ""}
                readOnly
                className="flex-1"
              />
              <Dialog open={showCostumerDialog} onOpenChange={setShowCostumerDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Search className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Buscar Cliente</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Digite o nome do cliente..."
                      value={costumerSearch}
                      onChange={(e) => {
                        setCostumerSearch(e.target.value);
                        searchCostumers(e.target.value);
                      }}
                    />

                    {loading && (
                      <div className="text-center text-sm text-gray-500">
                        Buscando clientes...
                      </div>
                    )}

                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {costumerResults.map((costumer) => (
                        <div
                          key={costumer.id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => handleCostumerSelect(costumer)}
                        >
                          <div className="font-medium">{costumer.name}</div>
                          <div className="text-sm text-gray-500">
                            {formatPhone(costumer.phone)}
                          </div>
                          {costumer.city && (
                            <div className="text-sm text-gray-400">
                              {costumer.city.name} - {costumer.city.state}
                            </div>
                          )}
                        </div>
                      ))}

                      {!loading && costumerResults.length === 0 && costumerSearch.trim() && (
                        <div className="text-center text-sm text-gray-500 py-4">
                          Nenhum cliente encontrado
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {selectedCostumer && (
                <Button variant="outline" onClick={clearCostumer}>
                  Limpar
                </Button>
              )}
            </div>

            {selectedCostumer && (
              <div className="text-sm text-gray-500 space-y-1">
                <div>Telefone: {formatPhone(selectedCostumer.phone)}</div>
                {selectedCostumer.city && (
                  <div>Cidade: {selectedCostumer.city.name} - {selectedCostumer.city.state}</div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data da Venda</Label>
            <Input
              id="date"
              type="date"
              value={saleDate}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}