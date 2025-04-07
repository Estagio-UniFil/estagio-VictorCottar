import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Londricostura - Home",
  description: "Controle Gerencial Londricostura.",
};

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <h1>página home</h1>
    </div>

  );
}
