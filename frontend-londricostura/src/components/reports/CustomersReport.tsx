'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Users } from 'lucide-react';
import { CustomersPDF } from '@/components/reports/pdfs';
import { fetchCustomersReport, type CustomerRow } from '@/services/reportsService';
import { toast } from 'sonner';

export function CustomersCard() {
  const [data, setData] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [customerId, setCustomerId] = useState('');

  const load = async () => {
    setLoading(true);

    const trimmedId = customerId.trim();
    const idNum = trimmedId && /^\d+$/.test(trimmedId)
      ? Number(trimmedId)
      : undefined;

    const rows = await fetchCustomersReport({
      customerId: idNum,
      search: search.trim() || undefined,
    });

    if (rows.length === 0) {
      toast.error('Nenhum cliente localizado no sistema.');
    }

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
        <CardDescription>Dados e valor total gastado em compras.</CardDescription>
      </CardHeader>

      <CardFooter className="mt-auto flex items-center gap-2">
        <Button
          onClick={load}
          className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
          variant="ghost"
          disabled={loading}>
          {loading ? 'Carregando...' : 'Gerar Relatório'}
        </Button>
        {data.length > 0 && (
          <PDFDownloadLink document={<CustomersPDF data={data} />} fileName="relatorio-clientes.pdf">
            <Button
              variant="secondary"
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
            >
              Baixar PDF
            </Button>
          </PDFDownloadLink>
        )}
      </CardFooter>
    </Card>
  );
}
