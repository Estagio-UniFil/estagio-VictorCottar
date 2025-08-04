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
import { Plus } from "lucide-react";
import { useState } from "react"
import { toast } from "sonner"
import { Client } from "@/interfaces/client"

interface DialogAddClientProps {
  onClientAdded: () => void;
}

export default function DialogAddClient({ onClientAdded }: DialogAddClientProps) {
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState<Client>({
    name: '',
    phone: '',
    city: '',
  });

  const handleAddClient = async () => {
    if (!client.name || !client.phone || !client.city) {
      toast.error("Por favor, preencha todos os campos obrigatórios para adicionar o cliente.");
    }
    try {
      await createClient(client);
      onProductAdded();
      toast.success("Cliente criado com sucesso!");
      setClient({ name: '', phone: '', city: '' });
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
                <Label htmlFor="email" className="w-1/4 text-right">
                  Telefone
                </Label>
                <Input
                  id="code"
                  value={client.phone}
                  onChange={(e) => setClient({ ...client, phone: e.target.value })}
                  className="w-3/4"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="password" className="w-1/4 text-right">
                  Cidade
                </Label>

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