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
import { Costumer } from "@/interfaces/costumer"
import { City } from "@/interfaces/city"
import { createCostumer } from "@/services/costumerService"
import { resolveCityByCep } from "@/services/cityService"

interface DialogAddCostumerProps {
  onCostumerAdded: () => void;
}

export default function DialogAddCostumer({ onCostumerAdded }: DialogAddCostumerProps) {
  const [open, setOpen] = useState(false);
  const [cep, setCep] = useState('');
  const [resolving, setResolving] = useState(false);

  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [cities, setCities] = useState<City[]>([]);
  const [costumer, setCostumer] = useState<Costumer>({
    name: '',
    phone: '',
    city: undefined,
  });

  useEffect(() => {
    if (!open) {
      setCep('');
      setCities([]);
      setSelectedCityId('');
      setCostumer({ name: '', phone: '', city: undefined });
    }
  }, [open]);

  const handleResolveCep = async () => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) {
      toast.error('Informe um CEP com 8 dígitos.');
      return;
    }
    try {
      setResolving(true);
      const resolved = await resolveCityByCep(clean);
      const c: City = { id: resolved.id, name: resolved.name, state: resolved.state };
      setCities([c]);
      setSelectedCityId(String(resolved.id));
      toast.success(`${resolved.name} - ${resolved.state} selecionada pelo CEP.`);
    } catch (e: any) {
      toast.error(e.message || 'Erro ao resolver CEP');
      setCities([]);
      setSelectedCityId('');
    } finally {
      setResolving(false);
    }
  };

  const handleAddCostumer = async () => {
    if (!costumer.name || !costumer.phone || !selectedCityId) {
      toast.error("Preencha nome, telefone e um CEP válido para resolver a cidade.");
      return;
    }

    const selectedCity = cities.find(city => city.id?.toString() === selectedCityId);
    if (!selectedCity || !selectedCity.id) {
      toast.error("Cidade não resolvida. Verifique o CEP.");
      return;
    }

    const costumerPayload = {
      name: costumer.name,
      phone: costumer.phone,
      city_id: selectedCity.id
    };

    try {
      await createCostumer(costumerPayload as any);
      onCostumerAdded();
      toast.success("Cliente criado com sucesso!");
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
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Adicionar cliente</DialogTitle>
              <DialogDescription>Insira os dados. A cidade será resolvida pelo CEP.</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6 py-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="name" className="w-1/4 text-right">Nome</Label>
                <Input
                  id="name"
                  value={costumer.name}
                  onChange={(e) => setCostumer({ ...costumer, name: e.target.value })}
                  className="w-3/4"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="phone" className="w-1/4 text-right">Telefone</Label>
                <Input
                  id="phone"
                  value={costumer.phone}
                  placeholder="99999999999"
                  onChange={(e) => setCostumer({ ...costumer, phone: e.target.value })}
                  className="w-3/4"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="cep" className="w-1/4 text-right">CEP</Label>
                <div className="w-3/4 flex gap-2">
                  <Input
                    id="cep"
                    value={cep}
                    placeholder="00000000"
                    onChange={(e) => setCep(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleResolveCep(); }}
                    className="w-full"
                    required
                    max={8}
                    min={8}
                  />
                  <Button type="button" variant="secondary" onClick={handleResolveCep} disabled={resolving}>
                    {resolving ? 'Buscando...' : 'Buscar'}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label className="w-1/4 text-right">Cidade</Label>
                <Select
                  value={selectedCityId}
                  onValueChange={(v: string) => setSelectedCityId(v)}
                  disabled={true} // travado: vem do CEP
                >
                  <SelectTrigger className="w-[343px]">
                    <SelectValue placeholder="Resolva pelo CEP" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {cities.length > 0 ? (
                        <>
                          <SelectLabel>Cidade detectada</SelectLabel>
                          {cities.map((city) =>
                            city.id !== undefined ? (
                              <SelectItem key={city.id} value={city.id.toString()}>
                                {city.name} - {city.state}
                              </SelectItem>
                            ) : null
                          )}
                        </>
                      ) : (
                        <SelectLabel>Nenhuma cidade resolvida</SelectLabel>
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
                  onClick={handleAddCostumer}
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
