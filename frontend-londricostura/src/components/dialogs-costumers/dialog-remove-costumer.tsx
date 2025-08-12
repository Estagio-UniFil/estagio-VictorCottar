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
import { toast } from "sonner";
import { removeCostumer } from "@/services/costumerService";
import { DeleteIcon } from "../ui/delete";
import { Costumer } from "@/interfaces/costumer";

interface DialogRemoveCostumerProps {
  costumer: Costumer;
  onCostumerChanged: () => void;
  children?: React.ReactNode;
}

export default function DialogRemoveCostumer({ costumer, onCostumerChanged }: DialogRemoveCostumerProps) {
  const handleRemoveCostumer = async () => {
    if (costumer.id != undefined) {
      try {
        await removeCostumer(costumer.id);
        onCostumerChanged();
        toast.success("Cliente removido com sucesso!");
      } catch (error: any) {
        toast.error(error.message || "Erro ao remover produto.");
        console.error("Erro ao remover produto:", error);
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
          <DialogTitle>Remover cliente</DialogTitle>
          <DialogDescription>
            Você deseja excluir o cliente {costumer.name}?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col py-2 justify-center items-center">
          <DialogClose asChild>
            <Button
              className="p-4 w-[290px] hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors duration-200 cursor-pointer"
              variant="ghost"
              type="submit"
              onClick={handleRemoveCostumer}
            >
              Excluir cliente
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}