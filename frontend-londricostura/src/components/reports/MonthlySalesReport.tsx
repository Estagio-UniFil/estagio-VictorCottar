'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { BarChart3 } from 'lucide-react';
import { MonthlySalesPDF } from '@/components/reports/pdfs';
import { fetchMonthlySales, type MonthlySalesRow } from '@/services/reportsService';
import { toast } from 'sonner';

export function MonthlySalesCard() {
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [data, setData] = useState<MonthlySalesRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const rows = await fetchMonthlySales(year);

    if (rows.length === 0) {
      toast.error('Nenhuma venda encontrada no ano selecionado.');
    }

    setData(rows);
    setLoading(false);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <CardTitle>Vendas Mensais</CardTitle>
        </div>
        <CardDescription>Resumo por mês no ano selecionado.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <label className="text-sm font-medium">Ano</label>
        <Input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2025" />
      </CardContent>
      <CardFooter className="mt-auto flex items-center gap-2">
        <Button
          onClick={load}
          className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
          variant="ghost"
          disabled={loading}>
          {loading ? 'Carregando...' : 'Gerar Relatório'}
        </Button>
        {data.length > 0 && (
          <PDFDownloadLink document={<MonthlySalesPDF data={data} year={year} />} fileName={`relatorio-vendas-mensais-${year}.pdf`}>
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
