'use client'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Minus } from "lucide-react";
import { useState } from "react"
import { toast } from "sonner"
import { movementTypeOut } from "@/services/inventoryService"
import { Product } from "@/interfaces/product"

interface DialogOutInventoryProps {
  product: Product;
  onProductAdded: () => void;
}

export default function DialogOutInventory({ product, onProductAdded }: DialogOutInventoryProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  const handleInventoryOut = async () => {
    const productId = product?.id;
    if (!productId) {
      toast.error("Produto inválido.");
      return;
    }
    if (!quantity || quantity < 1) {
      toast.error("Quantidade deve ser pelo menos 1.");
      return;
    }

    try {
      await movementTypeOut({ product_id: productId, quantity: Math.trunc(quantity) });
      toast.success("Saída lançada com sucesso!");
      setQuantity(1);
      setOpen(false);
      onProductAdded();
    } catch (error: any) {
      toast.error("Erro ao lançar saída: " + error?.message);
      console.error("Erro ao lançar saída:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
          variant="ghost"
        >
          <Minus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Saída de produto</DialogTitle>
          <DialogDescription>
            Produto: {product?.name} ({product?.code})
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 py-2">
          <Label htmlFor="quantity" className="w-1/4 text-right">
            Quantidade
          </Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value || 0))}
            className="w-3/4"
            required
          />
        </div>

        <div className="flex justify-center items-center w-full">
          <DialogFooter>
            <Button
              className="p-4 w-[290px] cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
              variant="ghost"
              type="button"
              onClick={handleInventoryOut}
            >
              Criar saída
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
