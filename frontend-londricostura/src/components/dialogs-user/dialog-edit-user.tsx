import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User } from "@/interfaces/user";
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
import { Input } from "@/components/ui/input"
import { updateUser } from "@/services/userService";
import { toast } from "sonner";
import { useState } from "react";

interface DialogEditUserProps {
  user: User;
}

export default function DialogEditUser({ user }: DialogEditUserProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
    active: user.active,
  });

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      active: value === "true",
    });
  };

  const handleEditUser = async () => {
    try {
      const updatedData = { ...formData };
  
      // Criar um novo objeto sem o campo 'password' caso ele esteja vazio
      const filteredData = updatedData.password
        ? updatedData
        : Object.fromEntries(
            Object.entries(updatedData).filter(([key]) => key !== "password")
          );
  
      await updateUser({ ...user, ...filteredData });
  
      toast.success("Usuário editado com sucesso!");
    } catch (error) {
      toast.error("Erro ao editar usuário.");
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
          variant="ghost"
        >
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[410px]">
        <DialogHeader>
          <DialogTitle>Editar usuário</DialogTitle>
          <DialogDescription>
            Insira os dados que deseja alterar do usuário {user.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="name" className="w-1/4 text-right">
              Nome
            </Label>
            <Input
              id="name"
              className="w-3/4"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="email" className="w-1/4 text-right">
              Email
            </Label>
            <Input
              id="email"
              className="w-3/4"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              type="email"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="password" className="w-1/4 text-right">
              Senha
            </Label>
            <Input
              id="password"
              className="w-3/4"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            {!user.active && (
              <>
                <Label htmlFor="admin" className="w-1/4 text-right">
                  Ativar usuário
                </Label>
                <Select onValueChange={handleSelectChange} value={formData.active ? "true" : "false"}>
                  <SelectTrigger className="w-3/4">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Ativar usuário</SelectLabel>
                      <SelectItem value="true">Sim</SelectItem>
                      <SelectItem value="false">Não</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center w-full">
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="p-4 w-[290px] cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
                variant="ghost"
                type="submit"
                onClick={handleEditUser}
              >
                Editar usuário
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}