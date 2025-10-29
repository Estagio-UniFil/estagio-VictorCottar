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
      <div className="p-20 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <MonthlySalesCard />
        <PeriodSalesCard />
        <StockCard />
        <CustomersCard />
      </div>
    </>
  );
}
