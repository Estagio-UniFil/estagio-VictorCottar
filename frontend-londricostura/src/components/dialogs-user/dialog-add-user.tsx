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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useState } from "react"
import { User } from "@/interfaces/user";
import { createUser } from "@/services/userService"
import { DialogClose } from "@radix-ui/react-dialog"

interface DialogAddUserProps {
  onUserAdded: () => void;
}

export default function DialogAddUser({ onUserAdded }: DialogAddUserProps) {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    password: '',
    admin: false,
  });

  const handleAddUser = async () => {
    if (!user.email || !user.name || !user.password) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await createUser(user);
      onUserAdded();
      toast.success("Usuário criado com sucesso!");
    } catch (error: any) {
      if (error.message.includes('already registered')) {
        toast.error("Este e‑mail já está cadastrado no sistema.");
      } else {
        toast.error("Erro ao criar usuário: " + error.message);
      }
      console.error("Erro ao adicionar usuário:", error);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex justify-end w-[95%] mt-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
              variant="ghost"
            >
              <Plus size={16} /> Adicionar usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] h-[430px]">
            <DialogHeader>
              <DialogTitle>Adicionar usuário</DialogTitle>
              <DialogDescription>
                Insira os dados necessários para criação do usuário.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-6 py-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="name" className="w-1/4 text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-3/4"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="email" className="w-1/4 text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  type="email"
                  placeholder="exemplo@gmail.com"
                  className="w-3/4"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="password" className="w-1/4 text-right">
                  Senha
                </Label>
                <Input
                  id="password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  className="w-3/4"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="admin" className="w-1/4 text-right">
                  Admin
                </Label>
                <Select
                  onValueChange={(value) =>
                    setUser({ ...user, admin: value === "true" })
                  }
                  value={user.admin ? "true" : "false"}
                >
                  <SelectTrigger className="w-3/4">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Usuário administrador?</SelectLabel>
                      <SelectItem value="true">Sim</SelectItem>
                      <SelectItem value="false">Não</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    className="p-4 w-[290px] cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
                    variant="ghost"
                    type="submit"
                    onClick={handleAddUser}
                  >
                    Criar usuário
                  </Button>
                </DialogClose>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}