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
import { NumericFormat } from 'react-number-format';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog"
import { useState } from "react"
import { Product } from "@/interfaces/product"
import { toast } from "sonner"
import { createProduct } from "@/services/productService"
import { NumericInput } from "../numeric-input";

interface DialogAddProductProps {
  onProductAdded: () => void;
}

export default function DialogAddProduct({ onProductAdded }: DialogAddProductProps) {
  const [product, setProduct] = useState<Product>({
    name: '',
    code: '',
    quantity: 1,
    price: 1,
  });

  const handleAddProduct = async () => {
    if (!product.name || !product.code || !product.price) {
      toast.error("Por favor, preencha todos os campos obrigatórios para criar o produto.");
      return;
    }
    try {
      await createProduct(product);
      onProductAdded();
      toast.success("Produto criado com sucesso!");
      setProduct({
        name: '',
        code: '',
        quantity: 1,
        price: 1,
      });
    } catch (error: any) {
      toast.error("Erro ao criar produto: " + error.message);
      console.error("Erro ao criar produto:", error);
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
              <Plus size={16} /> Adicionar produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] h-[430px]">
            <DialogHeader>
              <DialogTitle>Adicionar produto</DialogTitle>
              <DialogDescription>
                Insira os dados necessários para criação do produto.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-6 py-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="name" className="w-1/4 text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  className="w-3/4"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="email" className="w-1/4 text-right">
                  Cód. do produto
                </Label>
                <Input
                  id="code"
                  value={product.code}
                  onChange={(e) => setProduct({ ...product, code: e.target.value })}
                  className="w-3/4"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="password" className="w-1/4 text-right">
                  Quantidade
                </Label>
                <Input
                  id="quantity"
                  value={product.quantity}
                  onChange={(e) => setProduct({ ...product, quantity: Number(e.target.value) })}
                  type="number"
                  className="w-3/4"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="password" className="w-1/4 text-right">
                  Preço
                </Label>
                <NumericInput
                  value={product.price}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  placeholder="Digite o preço"
                  onValueChange={(values) => {
                    const { floatValue } = values;
                    setProduct({ ...product, price: floatValue || 0 });
                  }}
                  className="w-3/4"
                />
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    className="p-4 w-[290px] cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
                    variant="ghost"
                    type="submit"
                    onClick={handleAddProduct}
                  >
                    Criar produto
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