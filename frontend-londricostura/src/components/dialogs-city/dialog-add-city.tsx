'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useState } from "react"
import { City } from "@/interfaces/city";
import { createCity } from "@/services/cityService"

export default function DialogAddCity() {
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState<City>({
    name: '',
    state: '',
  });

  const handleAddCity = async () => {
    if (!city.name || !city.state) {
      toast.error("Por favor, preencha todos os campos obrigatórios para adicionar a cidade.");
      return;
    }
    try {
      await createCity(city);
      toast.success("Cidade criada com sucesso!");
      setCity({
        name: '',
        state: '',
      });
      setOpen(false);
    } catch (error: any) {
      toast.error("Erro ao adicionar cidade: " + error.message);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex justify-end w-[95%] mt-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
              variant="ghost"
            >
              <Plus size={16} /> Adicionar cidade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] h-[330px]">
            <DialogHeader>
              <DialogTitle>Adicionar cidade</DialogTitle>
              <DialogDescription>
                Insira os dados necessários para criação da cidade. <br />
                Essa cidade criada será utilizada no cadastro do cliente.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-6 py-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="name" className="w-1/4 text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={city.name}
                  onChange={(e) => setCity({ ...city, name: e.target.value })}
                  className="w-3/4"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="email" className="w-1/4 text-right">
                  Estado
                </Label>
                <Input
                  id="email"
                  value={city.state}
                  onChange={(e) => setCity({ ...city, state: e.target.value })}
                  placeholder="Ex: MG, PR, SP"
                  className="w-3/4"
                  required
                />
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              <DialogFooter>
                <Button
                  className="p-4 w-[290px] cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
                  variant="ghost"
                  type="submit"
                  onClick={handleAddCity}
                >
                  Adicionar cidade
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}