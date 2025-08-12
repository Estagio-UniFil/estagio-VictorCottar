import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { SquarePenIcon } from "../ui/square-pen";
import { Costumer } from "@/interfaces/costumer";
import { City } from "@/interfaces/city";
import { updateCostumer } from "@/services/costumerService";
import { fetchCities } from "@/services/cityService";
import {
  Select, SelectTrigger, SelectValue, SelectContent,
  SelectGroup, SelectLabel, SelectItem,
} from "@/components/ui/select"

interface DialogEditCostumerProps {
  costumer: Costumer;
  onCostumerChanged: () => void;
  children?: React.ReactNode;
}

export default function DialogEditCostumer({ costumer, onCostumerChanged, children }: DialogEditCostumerProps) {
  const [open, setOpen] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string>(costumer.city?.id?.toString() || '');
  const [cities, setCities] = useState<City[]>([]);
  const [formData, setFormData] = useState({
    name: costumer.name,
    phone: costumer.phone,
  });

  // Fetch das cidades quando o dialog abrir
  useEffect(() => {
    if (open) {
      fetchCities()
        .then(data => setCities(data))
        .catch(() => toast.error("Erro ao carregar cidades."));
    }
  }, [open]);

  // Atualizar os dados quando o costumer prop mudar
  useEffect(() => {
    setFormData({
      name: costumer.name,
      phone: costumer.phone,
    });
    setSelectedCityId(costumer.city?.id?.toString() || '');
  }, [costumer]);

  // Resetar dados quando o dialog fechar
  useEffect(() => {
    if (!open) {
      setFormData({
        name: costumer.name,
        phone: costumer.phone,
      });
      setSelectedCityId(costumer.city?.id?.toString() || '');
    }
  }, [open, costumer]);

  const handleEditCostumer = async () => {
    if (!formData.name || !formData.phone || !selectedCityId) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const selectedCity = cities.find(city => city.id?.toString() === selectedCityId);
    if (!selectedCity || !selectedCity.id) {
      toast.error("Cidade selecionada não encontrada.");
      return;
    }

    if (costumer.id != undefined) {
      try {
        const payload = {
          id: costumer.id,
          name: formData.name,
          phone: formData.phone,
          city_id: Number(selectedCity.id),
        };
        
        console.log('📤 Payload sendo enviado:', payload);
        
        // Log antes da requisição
        console.log('🔄 Fazendo requisição para updateCostumer...');
        
        const result = await updateCostumer(payload);
        
        // Log após a requisição
        console.log('✅ Resultado do updateCostumer:', result);
        
        // Fechar o dialog primeiro
        setOpen(false);
        
        // Depois chamar a função de callback para atualizar a lista
        onCostumerChanged();
        
        toast.success("Cliente editado com sucesso!");
      } catch (error: any) {
        console.log('❌ Erro na requisição:', error);
        toast.error("Erro ao editar cliente: " + error.message);
        console.error("Erro ao editar cliente:", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
          variant="ghost"
        >
          <SquarePenIcon size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[390px]">
        <DialogHeader>
          <DialogTitle>Editar cliente</DialogTitle>
          <DialogDescription>
            Insira os dados que deseja alterar do cliente.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-7 py-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="name" className="w-1/4 text-right">
              Nome
            </Label>
            <Input
              id="name"
              className="w-3/4"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="phone" className="w-1/4 text-right">
              Telefone
            </Label>
            <Input
              id="phone"
              className="w-3/4"
              value={formData.phone}
              placeholder="99999999999"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  {cities.length > 0 ? (
                    <>
                      <SelectLabel>Cidades</SelectLabel>
                      {cities.map((city) =>
                        city.id !== undefined ? (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name} - {city.state}
                          </SelectItem>
                        ) : null
                      )}
                    </>
                  ) : (
                    <SelectLabel>Carregando cidades...</SelectLabel>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-center items-center w-full">
            <DialogFooter>
              <Button
                className="p-4 w-[290px] cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
                variant="ghost"
                type="submit"
                onClick={handleEditCostumer}
              >
                Editar cliente
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}