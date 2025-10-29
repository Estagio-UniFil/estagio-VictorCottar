import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatCurrency } from "@/utils/formatCurrency";

const s = StyleSheet.create({
  page: { padding: 24 },
  h1: { fontSize: 18, marginBottom: 12, textAlign: 'center' },
  row: { flexDirection: 'row', borderBottom: 1, paddingVertical: 4 },
  cell: { flex: 1, fontSize: 10 },
  head: { fontSize: 11, fontWeight: 'bold' },
});

const detailedStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  h1: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottom: 0.5,
    borderColor: '#ddd',
    minHeight: 20,
    alignItems: 'center',
  },
  head: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
  cellDate: {
    width: '10%',
    padding: 4,
    fontSize: 8,
  },
  cellSmall: {
    width: '7%',
    padding: 4,
    fontSize: 8,
    textAlign: 'center',
  },
  cellMedium: {
    width: '20%',
    padding: 4,
    fontSize: 8,
  },
  cellLarge: {
    width: '18%',
    padding: 4,
    fontSize: 8,
  },
  cellPrice: {
    width: '12%',
    padding: 4,
    fontSize: 8,
    textAlign: 'right',
  },
});

export function formatDateBR(date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

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
      <Page size="A4" style={detailedStyles.page} orientation="landscape">
        <Text style={detailedStyles.h1}>Vendas Detalhadas — {formatDateBR(start)} a {formatDateBR(end)}</Text>
        <View style={[detailedStyles.row, { borderTop: 1 }]}>
          <Text style={[detailedStyles.cellDate, detailedStyles.head]}>Data</Text>
          <Text style={[detailedStyles.cellSmall, detailedStyles.head]}>ID da Venda</Text>
          <Text style={[detailedStyles.cellLarge, detailedStyles.head]}>Cliente</Text>
          <Text style={[detailedStyles.cellMedium, detailedStyles.head]}>Produto</Text>
          <Text style={[detailedStyles.cellSmall, detailedStyles.head]}>Código</Text>
          <Text style={[detailedStyles.cellSmall, detailedStyles.head]}>Qtd</Text>
          <Text style={[detailedStyles.cellPrice, detailedStyles.head]}>Preço Un.</Text>
          <Text style={[detailedStyles.cellPrice, detailedStyles.head]}>Total</Text>
        </View>
        {data.map((item, i) => (
          <View key={i} style={detailedStyles.row}>
            <Text style={detailedStyles.cellDate}>{formatDateBR(item.date)}</Text>
            <Text style={detailedStyles.cellSmall}>{item.saleId}</Text>
            <Text style={detailedStyles.cellLarge}>{item.customer}</Text>
            <Text style={detailedStyles.cellMedium}>{item.productName}</Text>
            <Text style={detailedStyles.cellSmall}>{item.productCode}</Text>
            <Text style={detailedStyles.cellSmall}>{item.quantity}</Text>
            <Text style={detailedStyles.cellPrice}>{formatCurrency(item.unitPrice)}</Text>
            <Text style={detailedStyles.cellPrice}>{formatCurrency(item.itemTotal)}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

export function StockPDF({ data }: { data: any[] }) {
  const totalStock = data.reduce((acc, r) => acc + (r.total || 0), 0);
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>Relatório de Estoque - Londricostura</Text>
        <View style={[s.row, { borderTop: 1 }]}>
          <Text style={[s.cell, s.head]}>Produto</Text>
          <Text style={[s.cell, s.head]}>Código</Text>
          <Text style={[s.cell, s.head]}>Qtd</Text>
          <Text style={[s.cell, s.head]}>Valor Un.</Text>
          <Text style={[s.cell, s.head]}>Valor Total</Text>
        </View>
        {data.map((r, i) => (
          <View key={i} style={s.row}>
            <Text style={s.cell}>{r.name}</Text>
            <Text style={s.cell}>{r.code}</Text>
            <Text style={s.cell}>{r.quantity}</Text>
            <Text style={s.cell}>{formatCurrency(r.price)}</Text>
            <Text style={s.cell}>{formatCurrency(r.total)}</Text>
          </View>
        ))}
        <View style={[s.row, { borderTop: 2, marginTop: 10 }]}>
          <Text style={[s.cell, s.head, { flex: 4 }]}>Valor total em Estoque</Text>
          <Text style={[s.cell, s.head]}>{formatCurrency(totalStock)}</Text>
        </View>
      </Page>
    </Document>
  );
}

export function CustomersPDF({ data }: { data: any[] }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>Relatório de Clientes - Londricostura</Text>
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
            <Text style={s.cell}>{formatCurrency(r.spent)}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
