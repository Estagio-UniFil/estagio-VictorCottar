'use client'
import { useState, useEffect } from 'react';
import { ArrowLeft, Package, TrendingUp, TrendingDown, Calendar, Hash, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';
import HeaderPage from '@/components/header-pages';
import { fetchInventoryLogs, InventoryLog } from '@/services/inventoryService';
import { toast } from 'sonner';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function LogsEstoque() {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetchInventoryLogs(
        page,
        limit,
        filterType === 'ALL' ? undefined : filterType,
      );
      setLogs(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      toast.error('Erro ao carregar logs de movimentação');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filterType]);

  const totalEntradas = logs.filter(log => log.movement_type === 'IN')
    .reduce((sum, log) => sum + log.quantity, 0);
  
  const totalSaidas = logs.filter(log => log.movement_type === 'OUT')
    .reduce((sum, log) => sum + log.quantity, 0);

  return (
    <>
      <div className="flex items-center w-150 p-2">
        <Link
          href="/Estoque"
          className="mt-5 ml-6 inline-flex items-center gap-2 rounded-lg transition-colors duration-200 p-3 hover:bg-blue-100 hover:text-blue-700"
        >
          <ArrowLeft size={25} />
        </Link>
        <HeaderPage pageName="Logs de Estoque" />
      </div>

      <div className="container mx-auto px-6 py-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Movimentações</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Entradas</p>
                <p className="text-2xl font-bold text-green-600">{totalEntradas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Saídas</p>
                <p className="text-2xl font-bold text-red-600">{totalSaidas}</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Carregando logs...</span>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        Nenhuma movimentação encontrada
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{log.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-900">{formatDate(log.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{log.product.name}</div>
                          <div className="text-xs text-gray-500">Código: {log.product.code}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {log.movement_type === 'IN' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              <TrendingUp size={14} />
                              Entrada
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              <TrendingDown size={14} />
                              Saída
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-lg font-bold ${
                            log.movement_type === 'IN' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {log.movement_type === 'IN' ? '+' : '-'}{log.quantity}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando página {page} de {totalPages} ({total} registros no total)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-white border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}