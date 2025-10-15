import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatCurrency } from "@/utils/formatCurrency";

const s = StyleSheet.create({
  page: { padding: 24 },
  h1: { fontSize: 18, marginBottom: 12, textAlign: 'center' },
  row: { flexDirection: 'row', borderBottom: 1, paddingVertical: 4 },
  cell: { flex: 1, fontSize: 10 },
  head: { fontSize: 11, fontWeight: 'bold' },
});

export function MonthlySalesPDF({ data, year }: { data: any[]; year: string }) {
  const totalSales = data.reduce((sum, r) => sum + r.count, 0);
  const totalValue = data.reduce((sum, r) => sum + r.total, 0);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>Vendas Mensais Londricostura — {year}</Text>
        <View style={[s.row, { borderTop: 1 }]}>
          <Text style={[s.cell, s.head]}>Mês</Text>
          <Text style={[s.cell, s.head]}>Qtde de Vendas</Text>
          <Text style={[s.cell, s.head]}>Valor Total</Text>
        </View>
        {data.map((r, i) => (
          <View key={i} style={s.row}>
            <Text style={s.cell}>{r.month}</Text>
            <Text style={s.cell}>{r.count}</Text>
            <Text style={s.cell}>{formatCurrency(r.total)}</Text>
          </View>
        ))}
        <View style={[s.row, { borderTop: 1, borderTopWidth: 2 }]}>
          <Text style={[s.cell, s.head]}>Totais</Text>
          <Text style={[s.cell, s.head]}>{totalSales}</Text>
          <Text style={[s.cell, s.head]}>{formatCurrency(totalValue)}</Text>
        </View>
      </Page>
    </Document>
  );
}

export function PeriodSalesPDF({ data, start, end }: { data: any[]; start: string; end: string }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>Vendas — {start} a {end}</Text>
        <View style={[s.row, { borderTop: 1 }]}>
          <Text style={[s.cell, s.head]}>Data</Text>
          <Text style={[s.cell, s.head]}>Cliente</Text>
          <Text style={[s.cell, s.head]}>Total</Text>
        </View>
        {data.map((r, i) => (
          <View key={i} style={s.row}>
            <Text style={s.cell}>{r.date}</Text>
            <Text style={s.cell}>{r.customer}</Text>
            <Text style={s.cell}>{r.total}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

export function StockPDF({ data }: { data: any[] }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>Relatório de Estoque</Text>
        <View style={[s.row, { borderTop: 1 }]}>
          <Text style={[s.cell, s.head]}>Produto</Text>
          <Text style={[s.cell, s.head]}>Código</Text>
          <Text style={[s.cell, s.head]}>Qtd</Text>
          <Text style={[s.cell, s.head]}>Valor</Text>
        </View>
        {data.map((r, i) => (
          <View key={i} style={s.row}>
            <Text style={s.cell}>{r.name}</Text>
            <Text style={s.cell}>{r.code}</Text>
            <Text style={s.cell}>{r.quantity}</Text>
            <Text style={s.cell}>{r.price}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

export function CustomersPDF({ data }: { data: any[] }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>Relatório de Clientes</Text>
        <View style={[s.row, { borderTop: 1 }]}>
          <Text style={[s.cell, s.head]}>Nome</Text>
          <Text style={[s.cell, s.head]}>Telefone</Text>
          <Text style={[s.cell, s.head]}>Cidade</Text>
          <Text style={[s.cell, s.head]}>Gasto Total</Text>
        </View>
        {data.map((r, i) => (
          <View key={i} style={s.row}>
            <Text style={s.cell}>{r.name}</Text>
            <Text style={s.cell}>{r.phone}</Text>
            <Text style={s.cell}>{r.city}</Text>
            <Text style={s.cell}>{r.spent}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
