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
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@radix-ui/react-dialog"
import { Product } from "@/interfaces/product"
import { BadgeAlertIcon } from "../ui/badge-alert";
import { formatCurrency } from "@/utils/formatCurrency";

interface DialogDetailsProductProps {
  product: Product;
}

export default function DialogDetailsProduct({ product }: DialogDetailsProductProps) {
  return (
    <div className="flex w-full">
      <div className="flex justify-end w-[95%] mt-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
              variant="ghost"
            >
              <BadgeAlertIcon size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] h-[420px]">
            <DialogHeader>
              <DialogTitle>Dados do produto</DialogTitle>
              <DialogDescription>
                Visualize os dados do produto {product.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-10 py-2">
              <div className="flex flex-row text-center">
                <Label htmlFor="name" className="w-[50px] text-right">
                  Nome:
                </Label>
                <p className="leading-7">
                  {product.name}
                </p>
              </div>
              <div className="flex flex-row text-center">
                <Label htmlFor="name" className="w-[60px] text-right">
                  Código:
                </Label>
                <p className="leading-7">
                  {product.code}
                </p>
              </div>
              <div className="flex flex-row text-center">
                <Label htmlFor="name" className="w-[50px] text-right">
                  Preço:
                </Label>
                <p className="leading-7">
                  {formatCurrency(product.price)}
                </p>
              </div>
              <div className="flex flex-row text-center">
                <Label htmlFor="name" className="w-[170px] text-right">
                  Produto adicionado por:
                </Label>
                <p className="leading-7">
                  {product.user?.name}
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    className="p-4 w-[290px] cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
                    variant="ghost"
                    type="submit"
                  >
                    Fechar visualização
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