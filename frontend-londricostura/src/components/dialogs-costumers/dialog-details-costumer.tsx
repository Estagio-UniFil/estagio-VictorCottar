'use client'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@radix-ui/react-dialog"
import { BadgeAlertIcon } from "../ui/badge-alert";
import { Costumer } from "@/interfaces/costumer"

interface DialogDetailsCostumerProps {
  costumer: Costumer;
  children?: React.ReactNode;
}

export default function DialogDetailsCostumer({ costumer }: DialogDetailsCostumerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
          variant="ghost"
        > <BadgeAlertIcon size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[420px]">
        <DialogHeader>
          <DialogTitle>Dados do cliente</DialogTitle>
          <DialogDescription>
            Visualize os dados do cliente {costumer.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-10 py-2">
          <div className="flex flex-row text-center">
            <Label htmlFor="name" className="w-[50px] text-right">
              Nome:
            </Label>
            <p className="leading-5 text-sm">
              {costumer.name}
            </p>
          </div>
          <div className="flex flex-row text-center">
            <Label htmlFor="name" className="w-[60px] text-right">
              Telefone:
            </Label>
            <p className="leading-5 text-sm w-[100px] text-right">
              {costumer.phone}
            </p>
          </div>
          <div className="flex flex-row text-center">
            <Label htmlFor="name" className="w-[50px] text-right">
              Cidade:
            </Label>
            <p className="leading-5 w-[100px] text-right text-sm">
              {costumer.city?.name} - {costumer.city?.state}
            </p>
          </div>
          <div className="flex flex-row text-center">
            <Label htmlFor="name" className="w-[160px] text-right">
              Cliente adicionado por:
            </Label>
            <p className="leading-5 text-md">
              {costumer.user?.name}
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
  );
}