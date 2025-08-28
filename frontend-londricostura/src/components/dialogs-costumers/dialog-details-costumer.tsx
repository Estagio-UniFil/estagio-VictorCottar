'use client'
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { BadgeAlertIcon } from "../ui/badge-alert";
import { Costumer } from "@/interfaces/costumer";
import { fetchCostumerDetails } from "@/services/costumerService";

interface DialogDetailsCostumerProps {
  costumer: Costumer;
  children?: React.ReactNode;
}

export default function DialogDetailsCostumer({ costumer }: DialogDetailsCostumerProps) {
  const [fullCostumer, setFullCostumer] = useState<Costumer | null>(null);

  useEffect(() => {
    const getFullCostumerDetails = async () => {
      try {
        if (costumer.id !== undefined) {
          const details = await fetchCostumerDetails(costumer.id);
          console.log("Dados completos do cliente:", details);
          setFullCostumer(details);
        }
      } catch (error) {
        console.error("Erro ao carregar os detalhes completos do cliente", error);
      }
    };

    if (costumer?.id) {
      getFullCostumerDetails();
    }
  }, [costumer]);

  if (!fullCostumer) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
          variant="ghost"
        >
          <BadgeAlertIcon size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[550px]">
        <DialogHeader>
          <DialogTitle>Dados do cliente</DialogTitle>
          <DialogDescription>
            Visualize os dados do cliente {fullCostumer.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-10 py-2">
          <div className="flex flex-row text-center">
            <Label htmlFor="name" className="w-[50px] text-right">
              Nome:
            </Label>
            <p className="leading-5 text-sm">
              {fullCostumer.name}
            </p>
          </div>
          <div className="flex flex-row text-center">
            <Label htmlFor="phone" className="w-[60px] text-right">
              Telefone:
            </Label>
            <p className="leading-5 text-sm w-[100px] text-right">
              {fullCostumer.phone}
            </p>
          </div>
          <div className="flex flex-row text-center">
            <Label htmlFor="city" className="w-[50px] text-right">
              Cidade:
            </Label>
            <p className="leading-5 text-sm w-[100px] text-right">
              {fullCostumer.city?.name} - {fullCostumer.city?.state}
            </p>
          </div>
          <div className="flex flex-row text-center">
            <Label htmlFor="street" className="w-[80px] text-right">
              Endereço:
            </Label>
            <p className="leading-5 text-sm">
              {fullCostumer.street}
            </p>
          </div>
          <div className="flex flex-row text-center">
            <Label htmlFor="neighborhood" className="w-[50px] text-right">
              Bairro:
            </Label>
            <p className="leading-5 text-sm">
              {fullCostumer.neighborhood}
            </p>
          </div>
          <div className="flex flex-row text-center">
            <Label htmlFor="number" className="w-[70px] text-right">
              Número:
            </Label>
            <p className="leading-5 text-sm">
              {fullCostumer.number}
            </p>
          </div>
          <div className="flex flex-row text-center">
            <Label htmlFor="user" className="w-[160px] text-right">
              Cliente adicionado por:
            </Label>
            <p className="leading-5 text-md">
              {fullCostumer.user?.name}
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