'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Users } from 'lucide-react';
import { CustomersPDF } from '@/components/reports/pdfs';
import { fetchCustomersReport, type CustomerRow } from '@/services/reportsService';
import { Input } from '@/components/ui/input';

export function CustomersCard() {
  const [data, setData] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    // Se quiser enviar search, ajuste o service para aceitar ?search=
    const rows = await fetchCustomersReport(/* opcional: search */);
    setData(rows);
    setLoading(false);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <CardTitle>Relatório de Clientes</CardTitle>
        </div>
        <CardDescription>Dados e histórico de compras.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Input placeholder="Buscar (opcional)" value={search} onChange={(e) => setSearch(e.target.value)} />
      </CardContent>
      <CardFooter className="mt-auto flex items-center gap-2">
        <Button
          onClick={load}
          className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
          variant="ghost"
          disabled={loading}>
          {loading ? 'Carregando...' : 'Visualizar'}
        </Button>
        {data.length > 0 && (
          <PDFDownloadLink document={<CustomersPDF data={data} />} fileName="relatorio-clientes.pdf">
            <Button variant="secondary">Baixar PDF</Button>
          </PDFDownloadLink>
        )}
      </CardFooter>
    </Card>
  );
}
