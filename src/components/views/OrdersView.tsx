import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  ShoppingBag,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  Phone,
  MapPin,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/index.js';
import { OrderDetailsModal } from '../modals/OrderDetailsModal.js';

interface OrdersViewProps {
  onOpenNewOrder: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ onOpenNewOrder }) => {
  const { orders, t, language, updateOrderStatus } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  const statusOptions: Array<{ id: string; label: string; count?: number }> = [
    { id: 'all', label: t.common.all },
    { id: 'pending', label: t.orders.statuses.pending },
    { id: 'confirmed', label: t.orders.statuses.confirmed },
    { id: 'processing', label: t.orders.statuses.processing },
    { id: 'shipped', label: t.orders.statuses.shipped },
    { id: 'delivered', label: t.orders.statuses.delivered },
    { id: 'cancelled', label: t.orders.statuses.cancelled },
  ];

  const filteredOrders = orders.filter(ord => {
    const matchesStatus = statusFilter === 'all' || ord.orderStatus === statusFilter;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerPhone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    await updateOrderStatus(orderId, newStatus);
    setUpdatingId(null);
  };

  const statusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800"><Clock className="w-3 h-3" /> {t.orders.statuses.pending}</span>;
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800"><CheckCircle2 className="w-3 h-3" /> {t.orders.statuses.confirmed}</span>;
      case 'processing':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800"><PackageCheck className="w-3 h-3" /> {t.orders.statuses.processing}</span>;
      case 'shipped':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800"><Truck className="w-3 h-3" /> {t.orders.statuses.shipped}</span>;
      case 'delivered':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-3 h-3" /> {t.orders.statuses.delivered}</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600"><XCircle className="w-3 h-3" /> {t.orders.statuses.cancelled}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-pink-600" />
            <span>{t.orders.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.orders.subtitle}
          </p>
        </div>

        <button
          onClick={onOpenNewOrder}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.orders.createOrder}</span>
        </button>
      </div>

      {/* Stock transaction notice */}
      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">{t.orders.stockNote}</p>
          <p className="text-[11px] text-amber-700 mt-0.5">
            {language === 'bn'
              ? 'ডুপ্লিকেট স্টক কর্তন প্রতিরোধক সক্রিয়। স্টক শর্টেজ থাকলে অর্ডার কনফার্ম আটকে যাবে।'
              : 'Zero duplicate deductions guaranteed. Negative stock prevention automatically blocks over-selling.'}
          </p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={language === 'bn' ? 'অর্ডার নং, নাম বা ফোন নম্বর দিয়ে খুঁজুন...' : 'Search by Order #, Customer, or Phone...'}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-hidden transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {statusOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setStatusFilter(opt.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === opt.id
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-pink-50 border border-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-pink-100/80 shadow-xs hover:border-pink-200 transition-all space-y-3"
            >
              {/* Top Row: Order #, Date, Status, Payment */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm sm:text-base text-pink-600">
                    {order.orderNumber}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString([], {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {order.stockDeducted && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {language === 'bn' ? 'স্টক কর্তিত ✓' : 'Stock Deducted ✓'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {statusBadge(order.orderStatus)}
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    order.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.paymentStatus === 'partially_paid'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {order.paymentMethod} • {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Middle Row: Customer Info & Items */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Customer Details */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="font-bold text-slate-800 text-sm">{order.customerName}</p>
                  <p className="text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-pink-500" />
                    <span>{order.customerPhone}</span>
                  </p>
                  <p className="text-slate-500 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                    <span className="truncate">{order.customerAddress}</span>
                  </p>
                </div>

                {/* Items List (col-span-2) */}
                <div className="md:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <p className="font-semibold text-slate-700 text-xs">
                    {t.orders.items} ({order.items.length})
                  </p>
                  <div className="space-y-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-slate-800 font-medium">
                          {it.productName} <span className="text-slate-400">× {it.quantity}</span>
                        </span>
                        <span className="font-semibold text-slate-700">
                          ৳{it.subtotal.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <p className="text-[11px] text-pink-700 bg-pink-50/80 p-1.5 rounded-lg border border-pink-100 mt-1">
                      Note: {order.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Row: Financial Totals & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">{t.common.subtotal}:</span>{' '}
                    <span className="font-medium text-slate-700">৳{order.subtotal}</span>
                  </div>
                  {order.discount > 0 && (
                    <div>
                      <span className="text-slate-400">{t.common.discount}:</span>{' '}
                      <span className="font-medium text-rose-600">-৳{order.discount}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400">{t.common.deliveryCharge}:</span>{' '}
                    <span className="font-medium text-slate-700">+৳{order.deliveryCharge}</span>
                  </div>
                  <div className="pl-2 border-l border-slate-200">
                    <span className="font-bold text-sm text-pink-700">
                      {t.common.total}: ৳{order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Status Switcher Dropdown & Details Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedOrderForModal(order)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-pink-200 text-pink-700 hover:bg-pink-50 text-xs font-semibold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'চালান / ইনভয়েস' : 'View Invoice'}</span>
                  </button>

                  <select
                    disabled={updatingId === order.id}
                    value={order.orderStatus}
                    onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-pink-500 outline-hidden transition-all shadow-2xs"
                  >
                    <option value="pending">{t.orders.statuses.pending}</option>
                    <option value="confirmed">{t.orders.statuses.confirmed}</option>
                    <option value="processing">{t.orders.statuses.processing}</option>
                    <option value="shipped">{t.orders.statuses.shipped}</option>
                    <option value="delivered">{t.orders.statuses.delivered}</option>
                    <option value="cancelled">{t.orders.statuses.cancelled}</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">{t.common.noData}</p>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'bn' ? 'কোনো অর্ডার পাওয়া যায়নি।' : 'No orders matching current filter.'}
            </p>
          </div>
        )}
      </div>

      {/* Invoice / Challan Details Modal */}
      <OrderDetailsModal
        order={selectedOrderForModal}
        isOpen={!!selectedOrderForModal}
        onClose={() => setSelectedOrderForModal(null)}
      />
    </div>
  );
};
