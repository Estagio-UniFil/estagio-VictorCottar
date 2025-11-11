'use client'
import HeaderPage from "@/components/header-pages";
import { fetchSalesIndicatorsToday } from "@/services/saleService";
import { fetchStockIndicators } from "@/services/productService";
import { fetchSalesByRange } from "@/services/saleService";
import { fetchMovimentationThisWeek, fetchMovimentationToday, getWeekRangeISO } from "@/services/inventoryService";
import { Package, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from "@/utils/formatCurrency";

export default function Indicativos() {
  const [indicadores, setIndicadores] = useState({
    vendasHoje: 0,
    saidasHoje: 0,
    entradasHoje: 0,
    estoqueTotal: 0,
    clientesAtendidos: 0,
    ticketMedio: 0
  });
  const [loading, setLoading] = useState(true);
  const [movSemana, setMovSemana] = useState<{ dia: string; entradas: number; saidas: number }[]>([]);
  const [vendasSemana, setVendasSemana] = useState<{ dia: string; vendas: number }[]>([]);
  const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  useEffect(() => {
    fetchIndicadores();
    fetchMovSemana();
    fetchVendasSemana();
  }, []);

  const fetchIndicadores = async () => {
    try {
      setLoading(true);

      const vendasData = await fetchSalesIndicatorsToday();

      const estoqueData = await fetchStockIndicators();

      const movimentacaoData = await fetchMovimentationToday();

      setIndicadores(prev => ({
        ...prev,
        vendasHoje: vendasData.totalSalesValue,
        clientesAtendidos: vendasData.customersServed,
        ticketMedio: vendasData.averageTicket,
        estoqueTotal: estoqueData.totalStock,
        entradasHoje: movimentacaoData.incomingToday,
        saidasHoje: movimentacaoData.outgoingToday,
      }));
    } catch (error) {
      console.error('Erro ao buscar indicadores:', error);
    } finally {
      setLoading(false);
    }
  };

  async function fetchMovSemana() {
    try {
      const raw = await fetchMovimentationThisWeek();

      const { from } = getWeekRangeISO(new Date());
      const base = new Date(from);
      const map: Record<string, { entradas: number; saidas: number }> = {};
      for (let i = 0; i < 7; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        map[key] = { entradas: 0, saidas: 0 };
      }
      for (const p of raw) {
        if (map[p.date]) {
          map[p.date].entradas = p.incoming ?? 0;
          map[p.date].saidas = p.outgoing ?? 0;
        }
      }
      const arr: { dia: string; entradas: number; saidas: number }[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        arr.push({ dia: dias[i], entradas: map[key].entradas, saidas: map[key].saidas });
      }
      setMovSemana(arr);
    } catch (e) {
      console.error('Erro ao carregar movimentação semanal', e);
      setMovSemana(dias.map(d => ({ dia: d, entradas: 0, saidas: 0 })));
    }
  }

  async function fetchVendasSemana() {
    try {
      const { from, to } = getWeekRangeISO(new Date());
      const raw = await fetchSalesByRange(from, to);

      const base = new Date(from);
      const map: Record<string, number> = {};
      for (let i = 0; i < 7; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        map[d.toISOString().slice(0, 10)] = 0;
      }
      for (const p of raw) {
        if (map[p.date] !== undefined) map[p.date] = p.totalSales ?? 0;
      }

      const arr = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        return { dia: dias[i], vendas: map[key] };
      });

      setVendasSemana(arr);
    } catch (e) {
      console.error('Erro ao carregar vendas semanais', e);
      setVendasSemana(dias.map(d => ({ dia: d, vendas: 0 })));
    }
  }

  if (loading) {
    return (
      <>
        <HeaderPage pageName="Indicativos" />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando indicadores...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderPage pageName="Indicativos" />

      <div className="container mx-auto px-6 max-w-7xl mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Vendas Hoje</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(indicadores.vendasHoje)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign size={28} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Clientes Atendidos</p>
                <p className="text-3xl font-bold text-gray-900">{indicadores.clientesAtendidos}</p>
                <p className="text-sm text-gray-600 mt-2">hoje</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Users size={28} className="text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Ticket Médio</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(indicadores.ticketMedio)}
                </p>
              </div>
              <div className="p-3 bg-teal-100 rounded-xl">
                <ShoppingCart size={28} className="text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Estoque Total</p>
                <p className="text-3xl font-bold text-gray-900">{indicadores.estoqueTotal}</p>
                <p className="text-sm text-gray-600 mt-2">itens</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Package size={28} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Saídas Hoje</p>
                <p className="text-3xl font-bold text-gray-900">{indicadores.saidasHoje}</p>
                <p className="text-sm text-gray-600 mt-2">produtos</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <TrendingDown size={28} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Entradas Hoje</p>
                <p className="text-3xl font-bold text-gray-900">{indicadores.entradasHoje}</p>
                <p className="text-sm text-gray-600 mt-2">produtos</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp size={28} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas da Semana</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={vendasSemana}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="dia" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="vendas"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Vendas (R$)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Movimentação de Produtos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={movSemana}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="dia" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="entradas" fill="#10b981" name="Entradas" radius={[8, 8, 0, 0]} />
                <Bar dataKey="saidas" fill="#ef4444" name="Saídas" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
