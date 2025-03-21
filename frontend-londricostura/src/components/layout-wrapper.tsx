"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sidebarRoutes = ['/Home', '/Vendas', '/Estoque', '/Clientes', '/Indicativos', '/Relatorios', '/Usuarios'];
  const showSidebar = sidebarRoutes.includes(pathname);

  return (
    <div className="flex">
      {showSidebar && <AppSidebar />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
