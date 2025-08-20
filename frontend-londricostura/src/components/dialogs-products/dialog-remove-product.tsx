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
import { Product } from "@/interfaces/product";
import { removeProduct } from "@/services/productService";
import { DeleteIcon } from "../ui/delete";

interface DialogRemoveProductProps {
  product: Product;
  onProductsChanged: () => void;
}

export default function DialogRemoveProduct({ product, onProductsChanged }: DialogRemoveProductProps) {
  const handleRemoveProduct = async () => {
    if (product.id != undefined) {
      try {
        await removeProduct(product.id);
        onProductsChanged();
        toast.success("Produto removido com sucesso!");
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
          <DialogTitle>Remover produto</DialogTitle>
          <DialogDescription>
            Você deseja excluir o produto {product.name}?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col py-2 justify-center items-center">
          <DialogClose asChild>
            <Button
              className="p-4 w-[290px] hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors duration-200 cursor-pointer"
              variant="ghost"
              type="submit"
              onClick={handleRemoveProduct}
            >
              Excluir produto
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}