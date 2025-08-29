'use client'
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { SquarePenIcon } from "../ui/square-pen";
import { Costumer } from "@/interfaces/costumer";
import { City } from "@/interfaces/city";
import { updateCostumer } from "@/services/costumerService";
import { resolveCityByCep } from "@/services/cityService";
import {
  Select, SelectTrigger, SelectValue, SelectContent,
  SelectGroup, SelectLabel, SelectItem,
} from "@/components/ui/select"

interface DialogEditCostumerProps {
  costumer: Costumer;
  onCostumerChanged: () => void;
  children?: React.ReactNode;
}

// Tipos auxiliares e saneador para evitar string | undefined em City
type MaybeCity = Partial<City> | null | undefined;

const toCity = (c: MaybeCity): City | null => {
  if (!c) return null;
  const { id, name, state } = c;
  return typeof id === 'number' && typeof name === 'string' && typeof state === 'string'
    ? { id, name, state }
    : null;
};

export default function DialogEditCostumer({ costumer, onCostumerChanged }: DialogEditCostumerProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(costumer.name);
  const [phone, setPhone] = useState(costumer.phone || "");
  const [cep, setCep] = useState<string>("");
  const [resolving, setResolving] = useState(false);

  const [street, setStreet] = useState(costumer.street || "");
  const [neighborhood, setNeighborhood] = useState(costumer.neighborhood || "");
  const [numberHouse, setNumberHouse] = useState<number>(Number(costumer.number) || 0);

  const initialCity = toCity(costumer.city as MaybeCity);
  const [selectedCityId, setSelectedCityId] = useState<string>(initialCity ? String(initialCity.id) : '');
  const [cities, setCities] = useState<City[]>(initialCity ? [initialCity] : []);

  useEffect(() => {
    if (!open) {
      setName(costumer.name);
      setPhone(costumer.phone || "");
      setCep("");
      setStreet(costumer.street || "");
      setNeighborhood(costumer.neighborhood || "");
      setNumberHouse(Number(costumer.number) || 0);

      const c = toCity(costumer.city as MaybeCity);
      setSelectedCityId(c ? String(c.id) : "");
      setCities(c ? [c] : []);
    }
  }, [open, costumer]);

  const handleResolveCep = async (raw: string) => {
    const clean = raw.replace(/\D/g, '');
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
      setStreet(resolved.street || "");
      setNeighborhood(resolved.neighborhood || "");
      toast.success(`${resolved.name} - ${resolved.state} selecionada pelo CEP.`);
    } catch (e: any) {
      toast.error(e.message || 'Erro ao resolver CEP');
      setCities([]);
      setSelectedCityId('');
    } finally {
      setResolving(false);
    }
  };

  const handleChangeCep = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCep(value);
    if (value.replace(/\D/g, '').length === 8) handleResolveCep(value);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setNumberHouse(parsed);
    } else if (value === "") {
      setNumberHouse(0);
    } else {
      toast.error("Número da casa deve ser maior que 0.");
    }
  };

  const handleEditCostumer = async () => {
    if (!name || !phone || !cep || !neighborhood || !street || !numberHouse || !selectedCityId) {
      toast.error("Por favor, preencha todos dados.");
      return;
    }

    if (cep && cep.replace(/\D/g, '').length !== 8) {
      toast.error("O CEP deve ter 8 dígitos.");
      return;
    }

    const cityId = selectedCityId ? Number(selectedCityId) : undefined;
    if (!cityId) {
      toast.error("Cidade não resolvida. Informe um CEP válido.");
      return;
    }

    try {
      await updateCostumer({
        id: Number(costumer.id),
        name,
        phone,
        city_id: cityId,
        cep: cep || undefined,        
        neighborhood,                 
        street,
        number: numberHouse || undefined,
      });

      setOpen(false);
      onCostumerChanged();
      toast.success("Cliente editado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao editar cliente: " + error.message);
      console.error("Erro ao editar cliente:", error);
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

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Editar cliente</DialogTitle>
          <DialogDescription>Atualize os dados. A cidade pode ser resolvida pelo CEP.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="name" className="w-1/4 text-right">Nome</Label>
            <Input id="name" className="w-3/4" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="phone" className="w-1/4 text-right">Telefone</Label>
            <Input id="phone" className="w-3/4" value={phone} placeholder="99999999999" onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="cep" className="w-1/4 text-right">CEP</Label>
            <Input id="cep" className="w-3/4" value={cep} placeholder="00000000" onChange={handleChangeCep} maxLength={8} minLength={8} />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="neighborhood" className="w-1/4 text-right">Bairro</Label>
            <Input id="neighborhood" className="w-3/4" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} disabled={resolving} required />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="street" className="w-1/4 text-right">Endereço</Label>
            <Input id="street" className="w-3/4" value={street} onChange={(e) => setStreet(e.target.value)} disabled={resolving} required />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="number" className="w-1/4 text-right">Número</Label>
            <Input id="number" className="w-3/4" value={numberHouse === 0 ? '' : numberHouse} onChange={handleNumberChange} />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="city" className="w-1/4 text-right">Cidade</Label>
            <Select
              value={selectedCityId}
              onValueChange={(v: string) => setSelectedCityId(v)}
              disabled={Boolean(cep && cep.replace(/\D/g, '').length === 8)} // travado quando veio por CEP
            >
              <SelectTrigger className="w-[343px]">
                <SelectValue placeholder={cities.length ? "" : "Nenhuma cidade localizada"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {cities.length > 0 ? (
                    <>
                      <SelectLabel>Cidade</SelectLabel>
                      {cities.map((city) =>
                        city.id !== undefined ? (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name} - {city.state}
                          </SelectItem>
                        ) : null
                      )}
                    </>
                  ) : (
                    <SelectLabel>Nenhuma cidade localizada</SelectLabel>
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
              type="button"
              onClick={handleEditCostumer}
            >
              Editar cliente
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
