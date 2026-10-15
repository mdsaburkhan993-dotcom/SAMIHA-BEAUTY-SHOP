import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Users,
  DollarSign,
  PlusCircle,
  Package,
  Bot,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  onOpenNewOrder: () => void;
  onOpenNewProduct: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenNewOrder, onOpenNewProduct }) => {
  const { summary, t, language, setActiveTab, orders } = useApp();

  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'all'>('all');

  // Filter non-cancelled orders by selected date range
  const now = new Date();
  const filteredOrders = orders.filter(o => {
    if (o.orderStatus === 'cancelled') return false;
    if (dateRange === 'all') return true;

    const orderDate = new Date(o.createdAt);
    const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);

    if (dateRange === 'today') {
      return orderDate.toDateString() === now.toDateString();
    }
    if (dateRange === '7days') {
      return diffDays <= 7;
    }
    if (dateRange === '30days') {
      return diffDays <= 30;
    }
    return true;
  });

  const rangeRevenue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  let rangeCOGS = 0;
  let rangeDelivery = 0;
  filteredOrders.forEach(o => {
    rangeDelivery += o.deliveryCharge || 0;
    o.items.forEach(it => {
      rangeCOGS += (it.purchasePrice || 0) * it.quantity;
    });
  });
  const rangeProfit = Math.max(0, (rangeRevenue - rangeDelivery) - rangeCOGS);
  const rangeMargin = rangeRevenue > 0 ? Number(((rangeProfit / rangeRevenue) * 100).toFixed(1)) : 0;

  const kpis = [
    {
      title: dateRange === 'today' ? t.dashboard.todaySales : (language === 'bn' ? 'নির্বাচিত বিক্রয়' : 'Range Sales'),
      value: `৳${rangeRevenue.toLocaleString()}`,
      sub: `${filteredOrders.length} ${language === 'bn' ? 'টি সফল অর্ডার' : 'orders in period'}`,
      icon: DollarSign,
      gradient: 'from-pink-500 to-rose-500',
      textColor: 'text-pink-600',
    },
    {
      title: t.dashboard.grossProfit,
      value: `৳${rangeProfit.toLocaleString()}`,
      sub: `${t.sales.netMargin}: ${rangeMargin}%`,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600',
    },
    {
      title: t.dashboard.pendingOrders,
      value: (summary?.pendingOrdersCount || 0).toString(),
      sub: language === 'bn' ? 'কনফার্মেশন প্রয়োজন' : 'Requires confirmation',
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600',
      actionTab: 'orders',
    },
    {
      title: t.dashboard.lowStockAlert,
      value: (summary?.lowStockCount || 0).toString(),
      sub: language === 'bn' ? 'স্টক শেষ হওয়ার পথে' : 'Items near threshold',
      icon: AlertTriangle,
      gradient: 'from-rose-500 to-red-600',
      textColor: 'text-rose-600',
      actionTab: 'inventory',
    },
    {
      title: t.dashboard.totalRevenue,
      value: `৳${(summary?.totalRevenue || 0).toLocaleString()}`,
      sub: `${summary?.totalOrders || 0} ${language === 'bn' ? 'মোট বিক্রয়' : 'total sales'}`,
      icon: ShoppingBag,
      gradient: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-600',
    },
    {
      title: t.dashboard.totalCustomers,
      value: (summary?.customerCount || 0).toString(),
      sub: language === 'bn' ? 'নিবন্ধিত ক্লায়েন্ট' : 'Registered clients',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-600',
      textColor: 'text-blue-600',
      actionTab: 'customers',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 p-5 sm:p-7 text-white shadow-lg shadow-pink-500/15">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.shopName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {t.dashboard.title}
          </h2>
          <p className="mt-1 text-sm text-pink-100">
            {t.dashboard.subtitle}
          </p>

          {/* Quick Action buttons */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={onOpenNewOrder}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-pink-700 hover:bg-pink-50 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.dashboard.newOrder}</span>
            </button>
            <button
              onClick={onOpenNewProduct}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-pink-700/60 hover:bg-pink-700 text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition-all hover:scale-[1.02]"
            >
              <Package className="w-4 h-4" />
              <span>{t.dashboard.addProduct}</span>
            </button>
            <button
              onClick={() => setActiveTab('aiAssistant')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600/80 hover:bg-violet-600 text-white rounded-xl text-xs sm:text-sm font-semibold border border-violet-400/30 transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>{t.dashboard.askAi}</span>
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Critical Stock Alert Banner if any */}
      {(summary?.lowStockCount || 0) > 0 && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                {language === 'bn'
                  ? `${summary?.lowStockCount}টি পণ্যের স্টক সতর্কতার নিচে নেমে এসেছে!`
                  : `${summary?.lowStockCount} products are running low on stock!`}
              </p>
              <p className="text-xs text-rose-600 mt-0.5">
                {language === 'bn'
                  ? 'দ্রুত সাপ্লায়ারকে রিস্টক অর্ডার দেওয়ার পরামর্শ দেওয়া হচ্ছে।'
                  : 'Supplier purchase orders recommended to prevent stockouts.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('inventory')}
            className="flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900 px-3 py-1.5 rounded-lg bg-rose-100/80 hover:bg-rose-200 transition-colors"
          >
            <span>{t.common.viewDetails}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Date Filter Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
          {language === 'bn' ? 'তারিখ ভিত্তিক ফিল্টার:' : 'Date Filter:'}
        </span>
        <div className="flex items-center gap-1.5 shrink-0 bg-white p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setDateRange('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              dateRange === 'all'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.common.all}
          </button>
          <button
            onClick={() => setDateRange('today')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              dateRange === 'today'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'bn' ? 'আজ (Today)' : 'Today'}
          </button>
          <button
            onClick={() => setDateRange('7days')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              dateRange === '7days'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'bn' ? 'গত ৭ দিন' : 'Last 7 Days'}
          </button>
          <button
            onClick={() => setDateRange('30days')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              dateRange === '30days'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'bn' ? 'এই মাস (30d)' : 'This Month'}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => kpi.actionTab && setActiveTab(kpi.actionTab)}
              className={`p-4 sm:p-5 rounded-2xl bg-white border border-pink-100/80 shadow-xs hover:shadow-md transition-all ${
                kpi.actionTab ? 'cursor-pointer hover:border-pink-300' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 truncate">
                  {kpi.title}
                </span>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${kpi.gradient} text-white flex items-center justify-center shadow-xs`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-lg sm:text-2xl font-bold text-slate-800 tracking-tight">
                  {kpi.value}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 flex items-center justify-between">
                <span>{kpi.sub}</span>
                {kpi.actionTab && <ArrowRight className="w-3.5 h-3.5 text-slate-400" />}
              </p>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Top 5 Best-Selling Products & Inventory Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Best-Selling Products (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-pink-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>🏆</span>
                <span>{t.dashboard.topSelling}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'আসল বিক্রয়ের ভিত্তিতে শীর্ষ তালিকা' : 'Calculated from actual confirmed sales'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('sales')}
              className="text-xs font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1"
            >
              <span>{t.sales.title}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {summary?.top5Selling && summary.top5Selling.length > 0 ? (
              summary.top5Selling.map((item, idx) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-pink-50/50 transition-colors border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0
                        ? 'bg-amber-400 text-amber-900 shadow-xs'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-800'
                        : idx === 2
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                        {language === 'bn' && item.product.nameBn ? item.product.nameBn : item.product.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        SKU: {item.product.sku} • {item.product.category}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      {item.unitsSold} {language === 'bn' ? 'টি বিক্রিত' : 'units sold'}
                    </p>
                    <p className="text-[11px] font-medium text-pink-600">
                      ৳{item.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-6 text-center">
                {t.common.noData}
              </p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts & Quick Task summary (1 col) */}
        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>{t.dashboard.stockAlerts}</span>
              </h3>
              <button
                onClick={() => setActiveTab('inventory')}
                className="text-xs font-semibold text-pink-600 hover:text-pink-700"
              >
                {t.common.all}
              </button>
            </div>

            <div className="space-y-2.5">
              {summary?.lowStockProducts && summary.lowStockProducts.length > 0 ? (
                summary.lowStockProducts.slice(0, 4).map(prod => (
                  <div
                    key={prod.id}
                    className="p-2.5 rounded-xl border border-rose-100 bg-rose-50/50 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800 truncate max-w-[150px]">
                        {language === 'bn' && prod.nameBn ? prod.nameBn : prod.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {prod.category} • SKU: {prod.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                        {prod.stockQuantity} {language === 'bn' ? 'মজুদ' : 'left'}
                      </span>
                      <p className="text-[9px] text-slate-400 mt-0.5">
                        Min: {prod.lowStockThreshold}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-emerald-600">
                  <p className="text-sm font-semibold">
                    {language === 'bn' ? 'সব পণ্যের পর্যাপ্ত স্টক আছে' : 'All items sufficiently stocked'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('aiAssistant')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              <Bot className="w-4 h-4" />
              <span>{language === 'bn' ? 'স্টক ও বিক্রয়ের এআই অডিট' : 'Run AI Business Audit'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {t.dashboard.recentOrders}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'সর্বশেষ গ্রাহক অর্ডারসমূহ ও পেমেন্ট স্ট্যাটাস' : 'Latest customer orders and fulfillment statuses'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1"
          >
            <span>{t.dashboard.viewAllOrders}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">{t.orders.orderNumber}</th>
                <th className="py-2.5 px-3">{t.orders.customer}</th>
                <th className="py-2.5 px-3">{t.orders.items}</th>
                <th className="py-2.5 px-3">{t.common.total}</th>
                <th className="py-2.5 px-3">{t.orders.paymentStatus}</th>
                <th className="py-2.5 px-3">{t.orders.orderStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {orders.slice(0, 5).map(ord => {
                const statusColors: Record<string, string> = {
                  pending: 'bg-amber-100 text-amber-800',
                  confirmed: 'bg-blue-100 text-blue-800',
                  processing: 'bg-indigo-100 text-indigo-800',
                  shipped: 'bg-purple-100 text-purple-800',
                  delivered: 'bg-emerald-100 text-emerald-800',
                  cancelled: 'bg-slate-100 text-slate-600',
                };

                return (
                  <tr key={ord.id} className="hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-pink-700">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{ord.customerName}</p>
                      <p className="text-[11px] text-slate-400">{ord.customerPhone}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="truncate max-w-[150px] inline-block">
                        {ord.items.map(it => `${it.productName} (${it.quantity})`).join(', ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      ৳{ord.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        ord.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.paymentStatus === 'partially_paid'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        statusColors[ord.orderStatus] || 'bg-slate-100 text-slate-700'
                      }`}>
                        {t.orders.statuses[ord.orderStatus] || ord.orderStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
