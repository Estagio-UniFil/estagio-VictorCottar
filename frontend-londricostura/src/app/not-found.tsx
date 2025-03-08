import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-2 bg-muted p-4 md:p-10">
      <div className="flex items-center justify-center w-full flex-col gap-2">
        <span className="flex items-center justify-center">
          <Image
            src="/images/logo-londricostura.png"
            alt="Logo da Londricostura"
            width={300}
            height={300}
            priority
          />
          
        </span>
        <h1 className="text-3xl">A página que você procura não existe!</h1>
      </div>
    </div>
  );
}
