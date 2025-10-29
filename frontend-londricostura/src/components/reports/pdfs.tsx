import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatCurrency } from "@/utils/formatCurrency";

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
      <Page size="A4" style={detailedStyles.page}>
        <Text style={detailedStyles.h1}>Vendas Mensais Londricostura — {year}</Text>
        <View style={[detailedStyles.row, { borderTop: 1 }]}>
          <Text style={[detailedStyles.head, { width: '40%', padding: 4, fontSize: 9 }]}>Mês</Text>
          <Text style={[detailedStyles.head, { width: '30%', padding: 4, fontSize: 9, textAlign: 'center' }]}>Qtde de Vendas</Text>
          <Text style={[detailedStyles.cellPrice, detailedStyles.head, { width: '30%' }]}>Valor Total</Text>
        </View>
        {data.map((r, i) => (
          <View key={i} style={detailedStyles.row}>
            <Text style={{ width: '40%', padding: 4, fontSize: 9 }}>{r.month}</Text>
            <Text style={{ width: '30%', padding: 4, fontSize: 9, textAlign: 'center' }}>{r.count}</Text>
            <Text style={[detailedStyles.cellPrice, { width: '30%' }]}>{formatCurrency(r.total)}</Text>
          </View>
        ))}
        <View style={[detailedStyles.row, { borderTop: 2, marginTop: 10, borderColor: '#000' }]}>
          <Text style={[detailedStyles.head, { width: '40%', padding: 4, fontSize: 9 }]}>Totais</Text>
          <Text style={[detailedStyles.head, { width: '30%', padding: 4, fontSize: 9, textAlign: 'center' }]}>{totalSales}</Text>
          <Text style={[detailedStyles.cellPrice, detailedStyles.head, { width: '30%' }]}>{formatCurrency(totalValue)}</Text>
        </View>
      </Page>
    </Document>
  );
}

export function PeriodSalesPDF({ data, start, end }: { data: any[]; start: string; end: string }) {
  const totalStock = data.reduce((acc, r) => acc + (r.itemTotal || 0), 0);
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
        <View style={[detailedStyles.row, { borderTop: 2, marginTop: 10 }]}>
          <Text style={[detailedStyles.cellMedium, detailedStyles.head]}>Valor total em compras</Text>
          <Text style={[detailedStyles.cellPrice, detailedStyles.head]}>{formatCurrency(totalStock)}</Text>
        </View>
      </Page>
    </Document>
  );
}

export function StockPDF({ data }: { data: any[] }) {
  const totalStock = data.reduce((acc, r) => acc + (r.total || 0), 0);
  return (
    <Document>
      <Page size="A4" style={detailedStyles.page}>
        <Text style={detailedStyles.h1}>Relatório de Estoque - Londricostura</Text>
        <View style={[detailedStyles.row, { borderTop: 1 }]}>
          <Text style={[detailedStyles.cellLarge, detailedStyles.head, { width: '40%' }]}>Produto</Text>
          <Text style={[detailedStyles.cellSmall, detailedStyles.head, { width: '15%' }]}>Código</Text>
          <Text style={[detailedStyles.cellSmall, detailedStyles.head, { width: '10%' }]}>Qtd</Text>
          <Text style={[detailedStyles.cellPrice, detailedStyles.head, { width: '17.5%' }]}>Valor Un.</Text>
          <Text style={[detailedStyles.cellPrice, detailedStyles.head, { width: '17.5%' }]}>Valor Total</Text>
        </View>
        {data.map((r, i) => (
          <View key={i} style={detailedStyles.row}>
            <Text style={[detailedStyles.cellLarge, { width: '40%' }]}>{r.name}</Text>
            <Text style={[detailedStyles.cellSmall, { width: '15%' }]}>{r.code}</Text>
            <Text style={[detailedStyles.cellSmall, { width: '10%', textAlign: 'center' }]}>{r.quantity}</Text>
            <Text style={[detailedStyles.cellPrice, { width: '17.5%' }]}>{formatCurrency(r.price)}</Text>
            <Text style={[detailedStyles.cellPrice, { width: '17.5%' }]}>{formatCurrency(r.total)}</Text>
          </View>
        ))}
        <View style={[detailedStyles.row, { borderTop: 2, marginTop: 10, borderColor: '#000' }]}>
          <Text style={[detailedStyles.head, { width: '65%', padding: 4, fontSize: 9 }]}>Valor total em Estoque</Text>
          <Text style={[detailedStyles.cellPrice, detailedStyles.head, { width: '35%' }]}>{formatCurrency(totalStock)}</Text>
        </View>
      </Page>
    </Document>
  );
}

export function CustomersPDF({ data }: { data: any[] }) {
  const totalSpent = data.reduce((acc, r) => acc + (r.spent || 0), 0);
  return (
    <Document>
      <Page size="A4" style={detailedStyles.page}>
        <Text style={detailedStyles.h1}>Relatório de Clientes - Londricostura</Text>
        <View style={[detailedStyles.row, { borderTop: 1 }]}>
          <Text style={[detailedStyles.head, { width: '35%', padding: 4, fontSize: 9 }]}>Nome</Text>
          <Text style={[detailedStyles.head, { width: '20%', padding: 4, fontSize: 9 }]}>Telefone</Text>
          <Text style={[detailedStyles.head, { width: '25%', padding: 4, fontSize: 9 }]}>Cidade</Text>
          <Text style={[detailedStyles.cellPrice, detailedStyles.head, { width: '20%' }]}>Gasto Total</Text>
        </View>
        {data.map((r, i) => (
          <View key={i} style={detailedStyles.row}>
            <Text style={{ width: '35%', padding: 4, fontSize: 9 }}>{r.name}</Text>
            <Text style={{ width: '20%', padding: 4, fontSize: 9 }}>{r.phone}</Text>
            <Text style={{ width: '25%', padding: 4, fontSize: 9 }}>{r.city}</Text>
            <Text style={[detailedStyles.cellPrice, { width: '20%' }]}>{formatCurrency(r.spent)}</Text>
          </View>
        ))}
        <View style={[detailedStyles.row, { borderTop: 2, marginTop: 10, borderColor: '#000' }]}>
          <Text style={[detailedStyles.head, { width: '80%', padding: 4, fontSize: 9 }]}>Total Gasto por Clientes</Text>
          <Text style={[detailedStyles.cellPrice, detailedStyles.head, { width: '20%' }]}>{formatCurrency(totalSpent)}</Text>
        </View>
      </Page>
    </Document>
  );
}
