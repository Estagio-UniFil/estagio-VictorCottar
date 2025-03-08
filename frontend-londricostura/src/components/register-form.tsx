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

export function RegisterForm() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crie sua conta!</CardTitle>
          <CardDescription>
            Crie sua conta para acessar o dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-10"> 
              <div className="grid gap-7">
              <div className="grid gap-3">
                  <Label htmlFor="email">Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Digite seu nome"
                    required
                  />
                </div>
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
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Criar
                </Button>
              </div>
              <div className="text-center text-sm">
                Já tem uma conta? faça o {" "}
                <a href="/" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}