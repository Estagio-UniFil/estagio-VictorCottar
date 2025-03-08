'use client';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo(a) de volta!</CardTitle>
          <CardDescription>
            Faça seu login para acessar o dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-10">
              <div className="grid gap-7">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="exemplo@exemplo.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
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
