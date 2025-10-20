'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CalendarRange } from 'lucide-react';
import { PeriodSalesPDF } from '@/components/reports/pdfs';
import { fetchSalesByPeriod, type PeriodSalesRow } from '@/services/reportsService';

export function PeriodSalesCard() {
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const [data, setData] = useState<PeriodSalesRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!start || !end) return;
    setLoading(true);
    const rows = await fetchSalesByPeriod(start, end);
    setData(rows);
    setLoading(false);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <CalendarRange className="h-5 w-5" />
          <CardTitle>Vendas por Período</CardTitle>
        </div>
        <CardDescription>Filtre por data inicial e final.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Início</label>
          <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Fim</label>
          <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex items-center gap-2">
        <Button
          onClick={load}
          className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
          variant="ghost"
          disabled={!start || !end || loading}>
          {loading ? 'Carregando...' : 'Gerar Relatório'}
        </Button>
        {data.length > 0 && (
          <PDFDownloadLink document={<PeriodSalesPDF data={data} start={start} end={end} />} fileName={`relatorio-vendas-${start}_a_${end}.pdf`}>
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
