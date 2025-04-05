import { Metadata } from "next";
import AuthCheck from '@/components/auth-check';

export const metadata: Metadata = {
  title: "Londricostura - Vendas",
  description: "Controle Gerencial Londricostura.",
};

export default function Vendas() {
  return (
    <AuthCheck>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <h1>página nome</h1>
      </div>
    </AuthCheck>
  );
}
