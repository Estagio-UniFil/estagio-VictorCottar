'use client'
import SalesDataTable from "@/components/datatable-sales/_components/sale-datatable";
import HeaderPage from "@/components/header-pages";
import { Sale } from "@/interfaces/sale";
import { fetchSales } from "@/services/saleService";
import { useEffect, useState } from "react";
import Link from "next/link"

export default function Vendas() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [filterField, setFilterField] = useState<keyof Sale>("id");
  const [filterValue, setFilterValue] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshSales = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchSales(page, limit).then((result) => {
      setSales(result.data);
      setTotal(result.total);
    });
  }, [page, limit, filterField, filterValue, refreshTrigger]);

  return (
    <>
      <HeaderPage pageName="Vendas" />
      
      <SalesDataTable
        sales={sales}
        onSaleChanged={refreshSales}
        total={total}
        page={page}
        limit={limit}
        setPage={setPage}
        filterField={filterField}
        setFilterField={setFilterField}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
    </>
  );
}
