'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await authService.login(email, password);
      localStorage.setItem("access_token", data.access_token);
      console.log("Login successful:", data);
      router.push("/Vendas");
    } catch (error: any) {
      if (error.message === 'User account is inactive.') {
        toast.error('Sua conta está inativa. Por favor, ative-a para realizar o login.');
      } else {
        toast.error('Usuário ou senha incorretos. Por favor, tente novamente.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-[420px]">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo(a) de volta!</CardTitle>
          <CardDescription>
            Faça seu login para acessar a Home.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-10">
              <div className="grid gap-7">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@exemplo.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 cursor-pointer">
                  Entrar
                </Button>
              </div>
              <div className="text-center text-sm text-neutral-300">
                Primeiro acesso? Entre com a conta de administrador para configurar o sistema e criar novos usuários.
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}