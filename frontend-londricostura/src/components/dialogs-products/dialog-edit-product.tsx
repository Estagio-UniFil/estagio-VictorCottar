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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { updateProduct } from "@/services/productService";
import { toast } from "sonner";
import { useState } from "react";
import { Product } from "@/interfaces/product";
import { SquarePenIcon } from "../ui/square-pen";

interface DialogEditProductsProps {
  product: Product;
  onProductsChanged: () => void;
}

export default function DialogEditProduct({ product, onProductsChanged }: DialogEditProductsProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    code: product.code,
    price: product.price,
  });

  const handleEditProduct = async () => {
    if (product.id != undefined) {
      try {
        await updateProduct({
          id: product.id,
          name: formData.name,
          code: formData.code,
          price: formData.price,
        });
        onProductsChanged();
        toast.success("Produto editado com sucesso!");
      } catch (error: any) {
        toast.error("Erro ao editar produto: " + error.message);
        console.error("Erro ao editar produto:", error);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
          variant="ghost"
        >
          <SquarePenIcon size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[390px]">
        <DialogHeader>
          <DialogTitle>Editar produto</DialogTitle>
          <DialogDescription>
            Insira os dados que deseja alterar do produto.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-7 py-2">
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
              Cód. do produto
            </Label>
            <Input
              id="code"
              className="w-3/4"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="password" className="w-1/4 text-right">
              Preço
            </Label>
            <Input
              id="price"
              className="w-3/4"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            />
          </div>
          <div className="flex justify-center items-center w-full">
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  className="p-4 w-[290px] cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
                  variant="ghost"
                  type="submit"
                  onClick={handleEditProduct}
                >
                  Editar produto
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}