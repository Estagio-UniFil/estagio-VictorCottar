"use client";
import Image from "next/image";
import { Users, LogOut, Archive, SquareChartGantt, UserCog, ChartLine, ShoppingCart } from "lucide-react";

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

const mainItems = [
  {
    title: "Vendas",
    url: "/Vendas",
    icon: ShoppingCart,
  },
  {
    title: "Estoque",
    url: "/Estoque",
    icon: Archive,
  },
  {
    title: "Clientes",
    url: "/Clientes",
    icon: Users,
  },
  {
    title: "Indicativos",
    url: "/Indicativos",
    icon: ChartLine,
  },
  {
    title: "Relatórios",
    url: "/Relatorios",
    icon: SquareChartGantt,
  },
];

const footerItems = [
  {
    title: "Usuários",
    url: "/Usuarios",
    icon: UserCog,
  },
  {
    title: "Sair",
    url: "/",
    icon: LogOut,
  },
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
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title} className="px-2">
                  <SidebarMenuButton
                    asChild
                    className="flex items-center px-5 py-5 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="!w-6 !h-6" />
                      <span className="text-lg font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3 bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {footerItems.map((item) => (
                <SidebarMenuItem key={item.title} className="px-2">
                  <SidebarMenuButton
                    asChild
                    className={`flex items-center px-5 py-5 rounded-lg transition-colors duration-200 ${item.title === "Sair"
                      ? "hover:bg-red-100 hover:text-red-600"
                      : "hover:bg-blue-100 hover:text-blue-700"
                      }`}
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="!w-6 !h-6" />
                      <span className="text-lg font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}