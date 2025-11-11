'use client'
import { ArrowLeft, Calendar, User, Package, DollarSign, Hash, Loader2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchSaleById, deleteSale } from '@/services/saleService';
import { Sale } from '@/interfaces/sale';
import { toast } from 'sonner';
import HeaderPage from '@/components/header-pages';
import { formatCurrency } from "@/utils/formatCurrency";
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function DetalhesVenda() {
  const params = useParams();
  const router = useRouter();
  const saleId = params?.id as string;

  const [saleData, setSaleData] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchSaleDetails = async () => {
      if (!saleId) {
        setError('ID da venda não fornecido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchSaleById(Number(saleId));

        if (!data) {
          setError('Venda não encontrada');
          toast.error('Venda não encontrada');
        } else {
          setSaleData(data);
          setError(null);
        }
      } catch (err: any) {
        console.error('Erro ao carregar detalhes da venda:', err);
        const errorMessage = err?.message || 'Erro ao carregar detalhes da venda';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleDetails();
  }, [saleId]);

  const handleDeleteSale = async () => {
    if (!saleId) return;

    try {
      setIsDeleting(true);
      await deleteSale(Number(saleId));
      toast.success('Venda excluída com sucesso!');
      router.push('/Vendas');
    } catch (err: any) {
      console.error('Erro ao excluir venda:', err);
      const errorMessage = err?.message || 'Erro ao excluir venda';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex items-center w-150 p-2">
          <Link
            href="/Vendas"
            className="mt-5 ml-6 inline-flex items-center gap-2 rounded-lg transition-colors duration-200 p-3 hover:bg-blue-100 hover:text-blue-700"
          >
            <ArrowLeft size={25} />
          </Link>
          <HeaderPage pageName="Detalhes da venda" />
        </div>
        <div className="container mx-auto px-6 py-6 max-w-6xl">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Carregando detalhes da venda...</span>
          </div>
        </div>
      </>
    );
  }

  if (error || !saleData) {
    return (
      <>
        <div className="flex items-center w-150 p-2">
          <Link
            href="/Vendas"
            className="mt-5 ml-6 inline-flex items-center gap-2 rounded-lg transition-colors duration-200 p-3 hover:bg-blue-100 hover:text-blue-700"
          >
            <ArrowLeft size={25} />
          </Link>
          <HeaderPage pageName="Detalhes da venda" />
        </div>
        <div className="container mx-auto px-6 py-6 max-w-6xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">{error || 'Venda não encontrada'}</p>
            <Link
              href="/Vendas"
              className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Voltar para Vendas
            </Link>
          </div>
        </div>
      </>
    );
  }

  const totalItems = saleData.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalValue = saleData.items?.reduce((sum, item) => sum + item.total, 0) || 0;

  return (
    <>
      <div className="flex items-center justify-between w-full p-2">
        <div className="flex items-center">
          <Link
            href="/Vendas"
            className="mt-5 ml-6 inline-flex items-center gap-2 rounded-lg transition-colors duration-200 p-3 hover:bg-blue-100 hover:text-blue-700"
          >
            <ArrowLeft size={25} />
          </Link>
          <HeaderPage pageName="Detalhes da venda" />
        </div>

        <div className="mt-5 mr-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="cursor-pointer font-semibold inline-flex items-center gap-2 px-4 py-2 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors duration-200"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Excluir Venda
                  </>
                )}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza que deseja excluir esta venda?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. A venda #{saleData.id} do cliente{' '}
                  <span className="font-semibold text-gray-900">{saleData.costumer_name}</span>{' '}
                  no valor de{' '}
                  <span className="font-semibold text-gray-900">{formatCurrency(totalValue)}</span>{' '}
                  será excluída do sistema.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer font-semibold" disabled={isDeleting}>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteSale}
                  disabled={isDeleting}
                  className="hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors duration-200 cursor-pointer bg-red-600"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Excluindo...
                    </>
                  ) : (
                    'Excluir'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-semibold text-gray-900">{saleData.costumer_name}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Data da Venda</p>
                <p className="font-semibold text-gray-900">{formatDate(saleData.date)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Itens</p>
                <p className="font-semibold text-gray-900">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor Total</p>
                <p className="font-semibold text-gray-900 text-lg">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Itens da Venda</h2>
            <p className="text-sm text-gray-500 mt-1">Lista completa dos produtos vendidos</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Unitário
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {saleData.items?.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Hash size={14} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{item.product_code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                      <div className="text-xs text-gray-500">ID: {item.product_id}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {item.quantity}x
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-gray-900">{formatCurrency(Number(item.price))}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.total)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2">
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-right">
                    <span className="text-base font-bold text-gray-900">Total Geral:</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-lg font-bold text-emerald-600">{formatCurrency(totalValue)}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
            Informações da Venda
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-gray-600">ID da Venda:</span>
              <span className="text-sm font-medium text-gray-900">#{saleData.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-gray-600">ID do Cliente:</span>
              <span className="text-sm font-medium text-gray-900">{saleData.costumerId}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-gray-600">Venda lançada por:</span>
              <span className="text-sm font-medium text-gray-900">{saleData.user_name}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">ID do Usuário:</span>
              <span className="text-sm font-medium text-gray-900">{saleData.userId}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}