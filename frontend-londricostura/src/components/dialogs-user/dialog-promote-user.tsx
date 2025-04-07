import { ShieldUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User } from "@/interfaces/user";
import { toast } from "sonner";
import { promoteUser, demoteUser } from "@/services/userService";

interface DialogPromoteUserProps {
  user: User;
  onUserChanged: () => void;
}

export default function DialogPromoteUser({ user, onUserChanged }: DialogPromoteUserProps) {
  const handlePromoteUser = async () => {
    if (user.admin) {
      toast.error("Usuário já é administrador.");
      return;
    }

    if (user.id === 1) {
      toast.error("Não é possível alterar o usuário padrão.");
      return;
    }

    if (user.id != undefined) {
      try {
        await promoteUser(user.id);
        onUserChanged();
        toast.success("Usuário alterado para administrador com sucesso!");
      } catch (error) {
        toast.error("Erro ao alterar o usuário para administrador.");
        console.log(error);
      }
    }
  }

  const handleDemoteUser = async () => {
    if (!user.admin) {
      toast.error("Usuário já não é administrador.");
      return;
    }

    if (user.id === 1) {
      toast.error("Não é possível editar o usuário padrão.");
      return;
    }

    if (user.id != undefined) {
      try {
        await demoteUser(user.id);
        onUserChanged();
        toast.success("Usuário removido como administrador com sucesso!");
      } catch (error) {
        toast.error("Erro ao remover o usuário de administrador.");
        console.log(error);
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
        >
          <ShieldUser size={48} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Usuário administrador</DialogTitle>
          <DialogDescription>
            Clique na opção que deseja fazer para o usuário {user.name}!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4 justify-center items-center">
          <DialogClose asChild>
            <Button
              className="p-4 w-[290px] cursor-pointer hover:bg-yellow-100 hover:text-yellow-800 rounded-lg transition-colors duration-200"
              variant="ghost"
              type="submit"
              onClick={handleDemoteUser}
            >
              Remover administrador
            </Button>
          </DialogClose>
        
          <DialogClose asChild>
            <Button
              className="p-4 w-[290px] cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
              variant="ghost"
              type="submit"
              onClick={handlePromoteUser}
            >
              Alterar para administrador
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}