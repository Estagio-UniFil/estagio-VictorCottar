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
import { removeUser, inactivateUser } from "@/services/userService";
import { toast } from "sonner";
import { blockAdminUser } from "@/utils/blockAdminUser";
import { DeleteIcon } from "../ui/delete";

interface DialogRemoveUserProps {
  user: User;
  onUserChanged: () => void;
}

export default function DialogRemoveUser({ user, onUserChanged }: DialogRemoveUserProps) {
  const handleRemoveUser = async () => {
    if (user.id != undefined) {
      if (blockAdminUser(user.id, "remover")) {
        return;
      }
      try {
        await removeUser(user.id);
        onUserChanged();
        toast.success("Usuário removido com sucesso!");
      } catch (error: any) {
        toast.error(error.message || "Erro ao remover usuário.");
        console.error("Erro ao remover usuário:", error);
      }
    }
  }

  const handleInactivateUser = async () => {
    if (user.id != undefined) {
      if (blockAdminUser(user.id, "inativar")) {
        return;
      }
      try {
        await inactivateUser(user.id);
        onUserChanged();
        toast.success("Usuário inativado com sucesso!");
      } catch (error: any) {
        toast.error(error.message || "Erro ao inativar usuário.");
        console.error("Erro ao inativar usuário:", error);
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          <DeleteIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Remover usuário</DialogTitle>
          <DialogDescription>
            Você deseja excluir ou inativar o usuário {user.name}?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4 justify-center items-center">
          <DialogClose asChild>
            <Button
              className="p-4 w-[290px] cursor-pointer hover:bg-yellow-100 hover:text-yellow-800 rounded-lg transition-colors duration-200"
              variant="ghost"
              type="submit"
              onClick={handleInactivateUser}
            >
              Inativar usuário
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="p-4 w-[290px] hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors duration-200 cursor-pointer"
              variant="ghost"
              type="submit"
              onClick={handleRemoveUser}
            >
              Excluir usuário
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}