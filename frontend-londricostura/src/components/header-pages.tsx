interface HeaderPageProps {
  pageName: string;
}

export default function HeaderPage({ pageName }: HeaderPageProps) {
  return (
    <div className="flex items-start justify-start gap-6 p-7 mt-4">
      <h1 className="text-3xl ml-15 underline underline-offset-4 decoration-blue-700">{pageName}</h1>
    </div>
  );
}
