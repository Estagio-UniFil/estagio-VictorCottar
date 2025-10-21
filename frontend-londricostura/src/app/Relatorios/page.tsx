'use client';

import HeaderPage from '@/components/header-pages';
import { MonthlySalesCard } from '@/components/reports/MonthlySalesReport';
import { PeriodSalesCard } from '@/components/reports/PeriodSalesReport';
import { StockCard } from '@/components/reports/StockReport';
import { CustomersCard } from '@/components/reports/CustomersReport';

export default function Relatorios() {
  return (
    <>
      <HeaderPage pageName="Relatórios" />
      <div className="p-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
        <MonthlySalesCard />
        <PeriodSalesCard />
        <StockCard />
        <CustomersCard />
      </div>
    </>
  );
}
