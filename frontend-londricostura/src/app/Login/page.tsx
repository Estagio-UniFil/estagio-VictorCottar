import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function Login() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex items-center w-full max-w-sm flex-col gap-4 ">
        <span className="flex items-center gap-2 font-medium">
          <Image
            src="/images/logo-londricostura.png"
            alt="Logo da Londricostura"
            width={192}
            height={192}
            priority
          />
        </span>
        <LoginForm />
      </div>
    </div>
  );
}
