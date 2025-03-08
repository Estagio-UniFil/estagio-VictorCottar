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
import { useState } from "react"
import { ResetPasswordForm } from "./form-reset-password"

export function LoginForm() {
  const [isResetPassword, setResetPassword] = useState(false);

  const handleResetPassword = () => {
    setResetPassword(true);
  }

  const handleBackToLogin = () => {
    setResetPassword(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {isResetPassword ? (
        <ResetPasswordForm onBackToLogin={handleBackToLogin}/>
      ) : (
      
      <Card>
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
                    type="email"
                    placeholder="exemplo@exemplo.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                    <p
                      className="ml-auto text-sm underline-offset-4 hover:underline cursor-pointer"
                      onClick={handleResetPassword}
                    >
                      Esqueceu sua senha?
                    </p>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </div>
              <div className="text-center text-sm">
                Não possui uma conta?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Registre-se
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      )}
      </div>
  )
}
