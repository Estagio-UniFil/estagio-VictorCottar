"use client";
import Image from "next/image";
import Link from "next/link";
import { UsersIcon } from "./ui/users";
import { LogoutIcon } from "./ui/logout";
import { ArchiveIcon } from "./ui/archive";
import { ChartLineIcon } from "./ui/chart-line";
import { FileChartLineIcon } from "./ui/file-chart-line";
import { CartIcon } from "./ui/cart";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useRef } from "react";

// Interface genérica para acesso à animação
interface IconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const ICON_SIZE = 24;

const mainItems = [
  { title: "Vendas", url: "/Vendas", icon: CartIcon },
  { title: "Estoque", url: "/Estoque", icon: ArchiveIcon },
  { title: "Clientes", url: "/Clientes", icon: UsersIcon },
  { title: "Indicativos", url: "/Indicativos", icon: ChartLineIcon },
  { title: "Relatórios", url: "/Relatorios", icon: FileChartLineIcon },
];

const footerItems = [
  { title: "Usuários", url: "/Usuarios", icon: UsersIcon },
  { title: "Sair", url: "/", icon: LogoutIcon },
];

export function AppSidebar() {
  return (
    <Sidebar className="bg-white w-64">
      <SidebarHeader className="flex justify-center items-center p-6 border-b bg-white">
        <Image
          src="/images/logo-londricostura.png"
          alt="Logo Londricostura"
          width={170}
          height={80}
          className="h-auto"
        />
      </SidebarHeader>

      <SidebarContent className="p-4 bg-white">
        <SidebarGroup className="mt-10 space-y-6">
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-8">
              {mainItems.map((item) => {
                const iconRef = useRef<IconHandle>(null);
                const IconComponent = item.icon;

                return (
                  <SidebarMenuItem key={item.title} className="px-2">
                    <SidebarMenuButton
                      asChild
                      onMouseEnter={() => iconRef.current?.startAnimation()}
                      onMouseLeave={() => iconRef.current?.stopAnimation()}
                      className="flex items-center px-5 py-5 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <IconComponent ref={iconRef} size={ICON_SIZE} />
                        <span className="text-lg font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3 bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-4">
              {footerItems.map((item) => {
                const iconRef = useRef<IconHandle>(null);
                const IconComponent = item.icon;
                const isLogout = item.title === "Sair";

                return (
                  <SidebarMenuItem key={item.title} className="px-2">
                    <SidebarMenuButton
                      asChild
                      onMouseEnter={() => iconRef.current?.startAnimation()}
                      onMouseLeave={() => iconRef.current?.stopAnimation()}
                      className={`flex items-center px-5 py-5 rounded-lg transition-colors duration-200 ${isLogout ? "hover:bg-red-100 hover:text-red-600" : "hover:bg-blue-100 hover:text-blue-700"
                        }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <IconComponent ref={iconRef} size={ICON_SIZE} />
                        <span className="text-lg font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
