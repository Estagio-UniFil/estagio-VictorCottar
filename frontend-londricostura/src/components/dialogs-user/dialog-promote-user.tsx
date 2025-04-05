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
import { promoteUser } from "@/services/userService";

interface DialogPromoteUserProps {
  user: User;
}

export default function DialogPromoteUser({ user }: DialogPromoteUserProps) {
  const handlePromoteUser = async () => {
    if (user.admin) {
      toast.error("Usuário já é administrador.");
      return;
    }

    if (user.id != undefined) {
      try {
        await promoteUser(user.id);
        toast.success("Usuário alterado para administrador com sucesso!");
      } catch (error) {
        toast.error("Erro ao alterar o usuário para administrador.");
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
      <DialogContent className="sm:max-w-[500px] h-[170px]">
        <DialogHeader>
          <DialogTitle>Alterar para administrador</DialogTitle>
          <DialogDescription>
            Você deseja alterar usuário {user.name} para administrador?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4 justify-center items-center">
          <DialogClose asChild>
            <Button
              className="p-4 w-[290px] cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
              variant="ghost"
              type="submit"
              onClick={handlePromoteUser}
            >
              Alterar usuário
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}