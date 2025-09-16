'use client'
import { useState, useCallback, useRef, useEffect } from "react";
import { Search, Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Costumer } from "@/interfaces/costumer";
import { formatPhone } from "@/utils/formatPhone";
import { fetchCostumer } from "@/services/costumerService";
import { toast } from "sonner";

// Função para remover acentos (alternativa ao UNACCENT do PostgreSQL)
const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const prepareSearchTerm = (term: string): string => {
  return removeAccents(term.toLowerCase().trim());
};

interface CostumerSelectorProps {
  selectedCostumer: Costumer | null;
  onCostumerSelect: (costumer: Costumer | null) => void;
  saleDate: string;
  onDateChange: (date: string) => void;
}

interface CostumerFilters {
  search: string;
  name: string;
  phone: string;
  city: string;
  neighborhood: string;
}

export default function CostumerSelector({
  selectedCostumer,
  onCostumerSelect,
  saleDate,
  onDateChange,
}: CostumerSelectorProps) {
  const [costumerResults, setCostumerResults] = useState<Costumer[]>([]);
  const [showCostumerDialog, setShowCostumerDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Ref para o timeout do debounce
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [filters, setFilters] = useState<CostumerFilters>({
    search: "",
    name: "",
    phone: "",
    city: "",
    neighborhood: "",
  });

  // Função debouncedSearch - adicione no seu componente
  const debouncedSearch = useCallback((currentFilters: CostumerFilters) => {
    // Cancela a requisição anterior se existir
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    // Verifica se há filtros antes de agendar a busca
    const hasFilter = Object.values(currentFilters).some(value => value.trim() !== '');

    if (!hasFilter) {
      setCostumerResults([]);
      setLoading(false);
      return;
    }

    // Mostra loading imediatamente para feedback do usuário
    setLoading(true);

    // Agenda a busca com delay de 500ms
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        // Prepara os filtros, enviando apenas os que têm valor
        const activeFilters: any = {};
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value && value.trim() !== '') {
            activeFilters[key] = value.trim();
          }
        });

        const result = await fetchCostumer(1, 20, activeFilters);
        setCostumerResults(result.data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        toast.error("Erro ao buscar clientes");
        setCostumerResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  const handleFilterChange = (field: keyof CostumerFilters, value: string) => {
    const newFilters = { ...filters };

    if (field === 'search') {
      newFilters.name = "";
      newFilters.phone = "";
      newFilters.city = "";
      newFilters.neighborhood = "";
    }
    else {
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
      phone: "",
      city: "",
      neighborhood: "",
    };
    setFilters(emptyFilters);

    debouncedSearch(emptyFilters);
  };

  const handleCostumerSelect = (costumer: Costumer) => {
    onCostumerSelect(costumer);
    setShowCostumerDialog(false);
    clearAllFilters();
  };

  const clearCostumer = () => {
    onCostumerSelect(null);
  };

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
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Buscar Cliente</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Busca Geral</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite nome, telefone ou cidade..."
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
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
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
                            <Label>Telefone</Label>
                            <Input
                              placeholder="Filtrar por telefone..."
                              value={filters.phone}
                              onChange={(e) => handleFilterChange('phone', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Cidade</Label>
                            <Input
                              placeholder="Filtrar por cidade..."
                              value={filters.city}
                              onChange={(e) => handleFilterChange('city', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Bairro</Label>
                            <Input
                              placeholder="Filtrar por bairro..."
                              value={filters.neighborhood}
                              onChange={(e) => handleFilterChange('neighborhood', e.target.value)}
                            />
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAllFilters}
                          className="w-full"
                        >
                          Limpar Todos os Filtros
                        </Button>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Status da Busca */}
                    {loading && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                          Buscando clientes...
                        </div>
                      </div>
                    )}

                    {/* Resultados */}
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {costumerResults.map((costumer) => (
                        <div
                          key={costumer.id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => handleCostumerSelect(costumer)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{costumer.name}</div>
                              <div className="text-sm text-gray-500">
                                {formatPhone(costumer.phone)}
                              </div>
                              {costumer.city && (
                                <div className="text-sm text-gray-400">
                                  {costumer.city.name} - {costumer.city.state}
                                </div>
                              )}
                              {costumer.neighborhood && (
                                <div className="text-xs text-gray-400">
                                  {costumer.neighborhood}
                                  {costumer.street && `, ${costumer.street}`}
                                  {costumer.number && `, ${costumer.number}`}
                                </div>
                              )}
                            </div>
                            <Button size="sm" variant="ghost">
                              Selecionar
                            </Button>
                          </div>
                        </div>
                      ))}

                      {!loading && costumerResults.length === 0 &&
                        Object.values(filters).some(v => v.trim() !== '') && (
                          <div className="text-center text-sm text-gray-500 py-8">
                            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            Nenhum cliente encontrado com os filtros aplicados
                          </div>
                        )}

                      {!loading && costumerResults.length === 0 &&
                        Object.values(filters).every(v => v.trim() === '') && (
                          <div className="text-center text-sm text-gray-500 py-8">
                            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            Digite algo para buscar clientes
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
                {selectedCostumer.neighborhood && (
                  <div>
                    Endereço: {selectedCostumer.neighborhood}
                    {selectedCostumer.street && `, ${selectedCostumer.street}`}
                    {selectedCostumer.number && `, ${selectedCostumer.number}`}
                  </div>
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