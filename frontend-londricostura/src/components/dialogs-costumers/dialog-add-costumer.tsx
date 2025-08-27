'use client'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react";
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Costumer } from "@/interfaces/costumer"
import { City } from "@/interfaces/city"
import { createCostumer } from "@/services/costumerService"
import { resolveCityByCep } from "@/services/cityService"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"

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
    neighborhood: '',
    street: '',
    number: 0,
  });

  useEffect(() => {
    if (!open) {
      setCep('');
      setCities([]);
      setSelectedCityId('');
      setCostumer({ name: '', phone: '', city: undefined, neighborhood: '', street: '', number: 0 });
    }
  }, [open]);

  const handleResolveCep = async (cep: string) => {
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
      setCostumer({
        ...costumer,
        street: resolved.street,
        neighborhood: resolved.neighborhood,
      });
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

    if (value.replace(/\D/g, '').length === 8) {
      handleResolveCep(value);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedNumber = parseInt(value, 10);

    if (!isNaN(parsedNumber) && parsedNumber > 0) {
      setCostumer({ ...costumer, number: parsedNumber });
    } else if (value === "") {
      setCostumer({ ...costumer, number: 0 });
    } else {
      toast.error("Número da casa deve ser maior que 0.");
    }
  };

  const handleAddCostumer = async () => {
    if (!cep || cep.length !== 8) {
      toast.error("O CEP deve ter 8 dígitos.");
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
      city_id: selectedCity.id,
      neighborhood: costumer.neighborhood,
      street: costumer.street,
      number: costumer.number,
      cep: cep
    };

    try {
      await createCostumer(costumerPayload);
      onCostumerAdded();
      toast.success("Cliente criado com sucesso!");
      setOpen(false);
    } catch (error: any) {
      toast.error("Erro ao criar cliente: " + error.message);
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
                    onChange={handleChangeCep}
                    className="w-full"
                    required
                    maxLength={8}
                    minLength={8}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="neighborhood" className="w-1/4 text-right">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={costumer.neighborhood}
                  onChange={(e) => setCostumer({ ...costumer, neighborhood: e.target.value })}
                  className="w-3/4"
                  required
                  disabled={resolving}
                />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="street" className="w-1/4 text-right">Endereço</Label>
                <Input
                  id="street"
                  value={costumer.street}
                  onChange={(e) => setCostumer({ ...costumer, street: e.target.value })}
                  className="w-3/4"
                  required
                  disabled={resolving}
                />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="number" className="w-1/4 text-right">Número</Label>
                <Input
                  id="number"
                  value={costumer.number === 0 ? '' : costumer.number}
                  onChange={handleNumberChange}
                  className="w-3/4"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="city" className="w-1/4 text-right">Cidade</Label>
                <div className="w-3/4 flex gap-2">
                  <Select
                    value={selectedCityId}
                    onValueChange={(v: string) => setSelectedCityId(v)}
                    disabled={true}
                  >
                    <SelectTrigger className="w-[343px]">
                      <SelectValue placeholder="" />
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
                          <SelectLabel>Nenhuma cidade localizada</SelectLabel>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
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
