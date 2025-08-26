'use client'
import { useEffect, useState } from "react";
import HeaderPage from "@/components/header-pages";
import DialogAddCostumer from "@/components/dialogs-costumers/dialog-add-costumer";
import CostumersDataTable from "@/components/datatable-costumer/_components/costumer-datatable";
import { Costumer } from "@/interfaces/costumer";
import { fetchCostumer } from "@/services/costumerService";

export default function Clientes() {
  const [costumers, setCostumers] = useState<Costumer[]>([]);
  const [total, setTotal] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filterField, setFilterField] = useState<keyof Costumer>('name');
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const refreshCostumers = () => setRefreshTrigger((t) => t + 1);

  useEffect(() => {
    setPage(1);
  }, [filterField, filterValue]);

  useEffect(() => {
    fetchCostumer(page, limit, filterField, filterValue)
      .then((data) => {
        setCostumers(data.data);
        setTotal(data.total);
      })
      .catch((err) => {
        console.error("Erro ao buscar clientes:", err);
      });
  }, [page, filterField, filterValue, limit, refreshTrigger]);

  return (
    <>
      <HeaderPage pageName="Clientes" />
      <div className="flex justify-end ">
        <DialogAddCostumer onCostumerAdded={refreshCostumers} />
      </div>
      <CostumersDataTable
        costumers={costumers}
        onCostumerChanged={refreshCostumers}
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
