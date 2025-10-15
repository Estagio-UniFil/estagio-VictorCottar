import { API_URL, getHeaders } from "./loginService";

export type MonthlySalesRow = { month: string; count: number; total: number };
export type PeriodSalesRow = { date: string; customer: string; total: number };
export type StockRow = { id: number; name: string; code: string; quantity: number; price: number };
export type CustomerRow = { id: number; name: string; phone: string; city: string; spent: number };

async function safeJson(r: Response) {
  try { return await r.json(); } catch { return {}; }
}

export async function fetchMonthlySales(year: string): Promise<MonthlySalesRow[]> {
  try {
    const r = await fetch(`${API_URL}/sale/reports/monthly?year=${encodeURIComponent(year)}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!r.ok) { console.error("Erro vendas mensais:", r.statusText); return []; }
    const j = await safeJson(r);
    return j.data || j || [];
  } catch (e) {
    console.error("Req vendas mensais:", e);
    return [];
  }
}

export async function fetchSalesByPeriod(start: string, end: string): Promise<PeriodSalesRow[]> {
  try {
    const url = new URL(`${API_URL}/sale/reports/by-period`);
    url.searchParams.set("start", start);
    url.searchParams.set("end", end);

    const r = await fetch(url, { method: "GET", headers: getHeaders() });
    if (!r.ok) { console.error("Erro vendas por período:", r.statusText); return []; }
    const j = await safeJson(r);
    return j.data || j || [];
  } catch (e) {
    console.error("Req vendas por período:", e);
    return [];
  }
}

export async function fetchStockReport(): Promise<StockRow[]> {
  try {
    const r = await fetch(`${API_URL}/products/stock-report`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!r.ok) { console.error("Erro estoque:", r.statusText); return []; }
    const j = await safeJson(r);
    return j.data || j || [];
  } catch (e) {
    console.error("Req estoque:", e);
    return [];
  }
}

export async function fetchCustomersReport(): Promise<CustomerRow[]> {
  try {
    const r = await fetch(`${API_URL}/costumer/report`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!r.ok) { console.error("Erro clientes:", r.statusText); return []; }
    const j = await safeJson(r);
    return j.data || j || [];
  } catch (e) {
    console.error("Req clientes:", e);
    return [];
  }
}
