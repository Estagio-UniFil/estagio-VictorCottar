'use client'
import { useEffect, useState } from "react";
import HeaderPage from "@/components/header-pages";
import DialogAddCity from "@/components/dialogs-city/dialog-add-city";
import DialogAddCostumer from "@/components/dialogs-costumers/dialog-add-costumer";
import CostumersDataTable from "@/components/datatable-costumer/_components/costumer-datatable";
import { Costumer } from "@/interfaces/costumer";
import { fetchCostumer } from "@/services/costumerService";

export default function Clientes() {
  const [costumers, setCostumers] = useState<Costumer[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshCostumers = () => setRefreshTrigger((t) => t + 1);

  useEffect(() => {
    fetchCostumer()
      .then((data) => setCostumers(data))
      .catch(() => {
      });
  }, [refreshTrigger]);

  return (
    <>
      <HeaderPage pageName="Clientes" />
      <div className="flex justify-end ">
        <div className="flex items-center space-x-4 mr-19">
          <DialogAddCity />
          <DialogAddCostumer onCostumerAdded={refreshCostumers} />
        </div>
      </div>
      <CostumersDataTable costumers={costumers} onCostumerChanged={refreshCostumers} />
    </>
  );
}
