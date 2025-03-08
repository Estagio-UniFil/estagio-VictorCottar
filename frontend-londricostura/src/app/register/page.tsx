import { RegisterForm } from "@/components/register-form";
import Image from "next/image";



export default function Register() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <span className="flex items-center gap-2 self-center font-medium">
          <Image
            src="/images/logo-londricostura.png"
            alt="Logo da Londricostura"
            width={162}
            height={162}
            priority
          />
        </span>
        <RegisterForm />
      </div>
    </div>
  );
}
