import { Avatar, AvatarFallback} from "@/components/ui/avatar"
import { CircleUserRound } from 'lucide-react';
import { useEffect, useState } from "react";

export default function AvatarOperator() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    // pega o nome armazenado
    const storedName = localStorage.getItem('userName');
    setName(storedName);
  }, []);

  return (
    <div className="flex items-center justify-end w-full h-10 mt-2">
      <div className="flex items-center justify-center gap-2 w-42">
        <Avatar>
          <AvatarFallback>
            <CircleUserRound size={30} strokeWidth={1.3} />
          </AvatarFallback>
        </Avatar>
        <h4>{name ?? 'Visitante'}</h4>
      </div>
    </div>
  );
}
