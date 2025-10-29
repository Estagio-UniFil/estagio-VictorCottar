'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Boxes } from 'lucide-react';
import { StockPDF } from '@/components/reports/pdfs';
import { fetchStockReport, type StockRow } from '@/services/reportsService';
import { toast } from 'sonner';

export function StockCard() {
  const [data, setData] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const rows = await fetchStockReport();

    if (rows.length === 0) {
      toast.error('Nenhum item em estoque.');
    }

    setData(rows);
    setLoading(false);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Boxes className="h-5 w-5" />
          <CardTitle>Relatório de Estoque</CardTitle>
        </div>
        <CardDescription>Produtos, quantidades e valores.</CardDescription>
      </CardHeader>
      <CardContent />
      <CardFooter className="mt-auto flex items-center gap-2">
        <Button
          onClick={load}
          className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
          variant="ghost"
          disabled={loading}>
          {loading ? 'Carregando...' : 'Gerar Relatório'}
        </Button>
        {data.length > 0 && (
          <PDFDownloadLink
            document={<StockPDF data={data} />}
            fileName="relatorio-estoque.pdf"
          >
            {({ loading }) => (
              <Button
                variant="secondary"
                className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200"
              >
                {loading ? 'Gerando PDF...' : 'Baixar PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        )}
      </CardFooter>
    </Card>
  );
}
