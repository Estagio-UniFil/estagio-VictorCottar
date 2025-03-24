import { Plus } from "lucide-react";
import { Button } from "./ui/button";

export default function ButtonAddUser() {
  return (
    <div className="flex w-full">
      <div className="flex justify-end w-[95%] mt-3">
        <Button className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200" variant="ghost">
          <Plus size={16} /> Adicionar usuário
        </Button>
      </div>
    </div>
  );
}