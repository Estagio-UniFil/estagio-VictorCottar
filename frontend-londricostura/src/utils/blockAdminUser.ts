import { toast } from "sonner";

export function blockAdminUser(id: number, action: string): boolean {
  if (id === 1) {
    toast.error(`Não é possível ${action} o usuário padrão.`);
    return true;
  }
  
  return false;
}
