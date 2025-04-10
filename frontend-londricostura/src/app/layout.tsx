import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { LayoutWrapper } from "@/components/layout-wrapper";
import "@/app/globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import AuthCheck from "@/components/auth-check";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthCheck>
          <SidebarProvider>
            <main className="w-full">
              <LayoutWrapper>{children}</LayoutWrapper>
              <Toaster position="top-right" richColors />
            </main>
          </SidebarProvider>
        </AuthCheck>
      </body>
    </html>
  );
}
