'use client'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select, SelectTrigger, SelectValue, SelectContent,
  SelectGroup, SelectLabel, SelectItem,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react";
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Client } from "@/interfaces/client"
import { City } from "@/interfaces/city"
import { fetchCities } from "@/services/cityService"
import { createClient } from "@/services/clientService"

interface DialogAddClientProps {
  onClientAdded: () => void;
}

export default function DialogAddClient({ onClientAdded }: DialogAddClientProps) {
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState<Client>({
    name: '',
    phone: '',
    city: undefined,
  });
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  
  // Função para obter o nome da cidade selecionada para exibição
  const getSelectedCityName = () => {
    const selectedCity = cities.find(city => city.id?.toString() === selectedCityId);
    return selectedCity ? `${selectedCity.name} - ${selectedCity.state}` : '';
  };
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    if (open) {
      fetchCities()
        .then(data => setCities(data))
        .catch(() => toast.error("Erro ao carregar cidades."));
    }
  }, [open]);

  const handleAddClient = async () => {
    if (!client.name || !client.phone || !selectedCityId) {
      toast.error("Por favor, preencha todos os campos obrigatórios para adicionar o cliente.");
      return;
    }
    
    // Encontrar a cidade selecionada
    const selectedCity = cities.find(city => city.id?.toString() === selectedCityId);
    if (!selectedCity || !selectedCity.id) {
      toast.error("Cidade selecionada não encontrada.");
      return;
    }
    
    // Payload para a API (com city_id)
    const clientPayload = {
      name: client.name,
      phone: client.phone,
      city_id: selectedCity.id
    };
    
    // Atualizar o estado local do cliente com o objeto cidade completo (para exibição)
    const updatedClient: Client = {
      ...client,
      city: {
        name: selectedCity.name
      }
    };
    
    try {
      await createClient(clientPayload); // Envia city_id para a API
      onClientAdded();
      toast.success("Cliente criado com sucesso!");
      
      // Reset do formulário
      setClient({ name: '', phone: '', city: undefined });
      setSelectedCityId('');
      setOpen(false);
    } catch (error: any) {
      toast.error("Erro ao criar cliente: " + error.message);
      console.error("Erro ao criar cliente:", error);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex justify-end w-[95%] mt-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
              variant="ghost"
            >
              <Plus size={16} /> Adicionar cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] h-[390px]">
            <DialogHeader>
              <DialogTitle>Adicionar cliente</DialogTitle>
              <DialogDescription>
                Insira os dados necessários para criação do cliente.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-7 py-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="name" className="w-1/4 text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={client.name}
                  onChange={(e) => setClient({ ...client, name: e.target.value })}
                  className="w-3/4"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="phone" className="w-1/4 text-right">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={client.phone}
                  onChange={(e) => setClient({ ...client, phone: e.target.value })}
                  className="w-3/4"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="city" className="w-1/4 text-right">
                  Cidade
                </Label>
                <Select
                  value={selectedCityId}
                  onValueChange={(value: string) => setSelectedCityId(value)}
                >
                  <SelectTrigger className="w-[343px]">
                    <SelectValue placeholder="Escolha a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Cidades</SelectLabel>
                      {cities.map((city) =>
                        city.id !== undefined ? (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name} - {city.state}
                          </SelectItem>
                        ) : null
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              <DialogFooter>
                <Button
                  className="p-4 w-[290px] cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
                  variant="ghost"
                  type="submit"
                  onClick={handleAddClient}
                >
                  Criar cliente
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}