'use client'
import HeaderPage from "@/components/header-pages";
import { fetchSalesIndicatorsToday } from "@/services/saleService";
import { fetchStockIndicators } from "@/services/productService"; // Adicionado
import { fetchMovimentationToday } from "@/services/inventoryService"; // Adicionado
import { Package, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from "@/utils/formatCurrency";

// Dados mockados para os gráficos
const vendasDiariasData = [
  { dia: 'Seg', vendas: 4500 },
  { dia: 'Ter', vendas: 5200 },
  { dia: 'Qua', vendas: 4800 },
  { dia: 'Qui', vendas: 6100 },
  { dia: 'Sex', vendas: 7300 },
  { dia: 'Sáb', vendas: 8900 },
  { dia: 'Dom', vendas: 6700 },
];

const movimentacaoProdutosData = [
  { dia: 'Seg', entradas: 120, saidas: 85 },
  { dia: 'Ter', entradas: 95, saidas: 110 },
  { dia: 'Qua', entradas: 140, saidas: 95 },
  { dia: 'Qui', entradas: 110, saidas: 130 },
  { dia: 'Sex', entradas: 160, saidas: 145 },
  { dia: 'Sáb', entradas: 90, saidas: 170 },
  { dia: 'Dom', entradas: 75, saidas: 120 },
];

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

  useEffect(() => {
    fetchIndicadores();
  }, []);

  const fetchIndicadores = async () => {
    try {
      setLoading(true);

      // Buscar indicadores de vendas
      const vendasData = await fetchSalesIndicatorsToday();

      // Buscar indicadores de estoque
      const estoqueData = await fetchStockIndicators();

      // Buscar movimentações de produtos
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
              <LineChart data={vendasDiariasData}>
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
              <BarChart data={movimentacaoProdutosData}>
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
