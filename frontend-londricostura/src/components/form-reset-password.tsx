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

export function ResetPasswordForm({ onBackToLogin }: { onBackToLogin: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Altere sua senha</CardTitle>
          <CardDescription>
            Altere sua senha abaixo para realizar o login.
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
                    <Label htmlFor="password">Nova senha</Label>
                    
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Alterar senha
                </Button>
              </div>
              
              <div className="text-center text-sm text-[#737373]">
                Você será redirecionado para a página de login ao alterar a senha.
              </div>
              
              <div className="text-center text-sm">
                Lembrou sua senha? volte para o {" "}
                <a 
                  href="/" 
                  className="underline underline-offset-4"
                  onClick={(e) => {
                    e.preventDefault();
                    onBackToLogin();
                  }}
                >
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