import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  TrendingUp,
  Download,
  Calendar,
  FileText,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const SalesView: React.FC = () => {
  const { summary, t, language, orders } = useApp();

  const [timeRange, setTimeRange] = useState<'all' | 'today' | 'weekly' | 'monthly'>('all');

  const handleExportCsv = () => {
    window.location.href = '/api/export/sales-csv';
  };

  const revenue = summary?.totalRevenue || 0;
  const cogs = summary?.totalCOGS || 0;
  const grossProfit = summary?.grossProfit || 0;
  const margin = summary?.profitMarginPercent || 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Export CSV button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-pink-600" />
            <span>{t.sales.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.sales.subtitle}
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-pink-200 hover:bg-pink-50 text-pink-700 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95"
        >
          <Download className="w-4 h-4 text-pink-600" />
          <span>{t.common.exportCsv}</span>
        </button>
      </div>

      {/* Distinction Banner: Revenue vs Gross Profit */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border border-pink-200/80 text-xs sm:text-sm text-slate-700 space-y-1">
        <p className="font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-pink-600" />
          <span>{t.sales.profitDistinction}</span>
        </p>
        <p className="text-xs text-slate-600">
          {language === 'bn'
            ? 'বিক্রয় রাজস্ব (Revenue) = সর্বমোট অর্ডার মূল্য। পণ্যের কেনা দাম (COGS) ও ডেলিভারি বাদ দিয়ে অবশিষ্ট অংশই আসল নিট লাভ (Gross Profit)।'
            : 'Total Revenue represents gross inflow from orders. Deducting Cost of Goods (COGS) yields the verified Gross Profit.'}
        </p>
      </div>

      {/* Financial Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs">
          <span className="text-xs font-medium text-slate-400">
            {t.sales.revenue}
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            ৳{revenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-pink-600 font-medium mt-1">
            {summary?.totalOrders} {language === 'bn' ? 'টি সফল অর্ডার' : 'confirmed orders'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs">
          <span className="text-xs font-medium text-slate-400">
            {t.sales.cogs}
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-700 mt-1">
            ৳{cogs.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            {language === 'bn' ? 'সাপ্লায়ার থেকে পণ্যের কেনা খরচ' : 'Direct supplier procurement cost'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-xs">
          <span className="text-xs font-medium text-emerald-600">
            {t.sales.grossProfit}
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">
            ৳{grossProfit.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{t.sales.netMargin}: {margin}%</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs">
          <span className="text-xs font-medium text-slate-400">
            {t.dashboard.todaySales}
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-pink-600 mt-1">
            ৳{(summary?.todaySales || 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            {summary?.todayOrdersCount || 0} {language === 'bn' ? 'টি অর্ডার আজ' : 'orders logged today'}
          </p>
        </div>
      </div>

      {/* Product-wise Sales Performance Table */}
      <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            {language === 'bn' ? 'পণ্যভিত্তিক বিক্রয় ও রাজস্ব হিসাব' : 'Product-wise Sales & Profitability'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'bn' ? 'কোন পণ্য কত টাকা রাজস্ব এনেছে এবং মোট কত ইউনিট বিক্রি হয়েছে' : 'Units sold, total revenue, and contribution by product'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">{t.products.productName}</th>
                <th className="py-3 px-4">{t.products.category}</th>
                <th className="py-3 px-4">{t.products.purchasePrice}</th>
                <th className="py-3 px-4">{t.products.sellingPrice}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'বিক্রিত ইউনিট' : 'Units Sold'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'মোট বিক্রয় (Tk)' : 'Total Sales'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'নিট লাভ (Tk)' : 'Gross Profit'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {summary?.top10Selling.map(item => {
                const itemProfit = (item.product.sellingPrice - item.product.purchasePrice) * item.unitsSold;
                return (
                  <tr key={item.product.id} className="hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {language === 'bn' && item.product.nameBn ? item.product.nameBn : item.product.name}
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {item.product.sku}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{item.product.category}</td>
                    <td className="py-3 px-4 font-medium text-slate-600">৳{item.product.purchasePrice}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">৳{item.product.sellingPrice}</td>
                    <td className="py-3 px-4 font-bold text-pink-700">
                      {item.unitsSold} {language === 'bn' ? 'টি' : 'units'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ৳{item.totalRevenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600">
                      ৳{itemProfit.toLocaleString()}
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
