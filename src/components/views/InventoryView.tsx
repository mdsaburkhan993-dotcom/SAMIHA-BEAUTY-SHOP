import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  DollarSign,
  Plus,
  Minus,
  Truck,
  RotateCw
} from 'lucide-react';
import { Product } from '../../types/index.js';

export const InventoryView: React.FC = () => {
  const { products, t, language, updateProduct, setActiveTab } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all');

  const activeProducts = products.filter(p => !p.isArchived);

  // Financial calculations
  const totalStockUnits = activeProducts.reduce((sum, p) => sum + p.stockQuantity, 0);
  const totalCostValue = activeProducts.reduce((sum, p) => sum + p.purchasePrice * p.stockQuantity, 0);
  const totalRetailValue = activeProducts.reduce((sum, p) => sum + p.sellingPrice * p.stockQuantity, 0);
  const projectedGrossProfit = totalRetailValue - totalCostValue;

  const lowStockItems = activeProducts.filter(p => p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0);
  const outOfStockItems = activeProducts.filter(p => p.stockQuantity === 0);

  const displayedProducts = activeProducts.filter(p => {
    if (filterType === 'low') return p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0;
    if (filterType === 'out') return p.stockQuantity === 0;
    return true;
  });

  const handleAdjustStock = async (product: Product, delta: number) => {
    const newQty = product.stockQuantity + delta;
    if (newQty < 0) return;
    await updateProduct(product.id, { stockQuantity: newQty });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Boxes className="w-6 h-6 text-pink-600" />
          <span>{t.nav.inventory}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {language === 'bn'
            ? 'মজুদ পণ্যের স্বাস্থ্য, মূল্য মূল্যায়ন এবং রিস্টক সতর্কতা'
            : 'Warehouse valuation, stock health, and restock alert management'}
        </p>
      </div>

      {/* Valuation Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs">
          <span className="text-xs font-medium text-slate-400">
            {language === 'bn' ? 'মোট মজুদ ইউনিট' : 'Total Stock Units'}
          </span>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            {totalStockUnits.toLocaleString()}
          </p>
          <span className="text-[11px] text-pink-600 font-medium">
            {activeProducts.length} {language === 'bn' ? 'টি সক্রিয় প্রডাক্ট' : 'active SKUs'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs">
          <span className="text-xs font-medium text-slate-400">
            {language === 'bn' ? 'ইনভেন্টরি কেনা মূল্য (Cost)' : 'Inventory Cost Value'}
          </span>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            ৳{totalCostValue.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">
            {language === 'bn' ? 'কেনা দামের হিসাব' : 'At purchase cost'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs">
          <span className="text-xs font-medium text-slate-400">
            {language === 'bn' ? 'সম্ভাব্য রিটেল মূল্য' : 'Potential Retail Value'}
          </span>
          <p className="text-xl sm:text-2xl font-bold text-pink-700 mt-1">
            ৳{totalRetailValue.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">
            +৳{projectedGrossProfit.toLocaleString()} {language === 'bn' ? 'সম্ভাব্য লাভ' : 'est. profit'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs">
          <span className="text-xs font-medium text-slate-400">
            {language === 'bn' ? 'সতর্কতা পণ্য' : 'Low / Out of Stock'}
          </span>
          <p className="text-xl sm:text-2xl font-bold text-rose-600 mt-1">
            {lowStockItems.length + outOfStockItems.length}
          </p>
          <span className="text-[11px] text-rose-500 font-medium">
            {outOfStockItems.length} {language === 'bn' ? 'টি স্টক শূন্য' : 'out of stock'}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterType === 'all'
              ? 'bg-pink-600 text-white'
              : 'bg-white text-slate-600 hover:bg-pink-50 border border-slate-200'
          }`}
        >
          {t.common.all} ({activeProducts.length})
        </button>
        <button
          onClick={() => setFilterType('low')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            filterType === 'low'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{t.products.lowStock} ({lowStockItems.length})</span>
        </button>
        <button
          onClick={() => setFilterType('out')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterType === 'out'
              ? 'bg-rose-600 text-white'
              : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
          }`}
        >
          {t.products.outOfStock} ({outOfStockItems.length})
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">{t.products.sku}</th>
                <th className="py-3 px-4">{t.products.productName}</th>
                <th className="py-3 px-4">{t.products.category}</th>
                <th className="py-3 px-4">{t.products.purchasePrice}</th>
                <th className="py-3 px-4">{t.products.sellingPrice}</th>
                <th className="py-3 px-4">{t.products.stockQuantity}</th>
                <th className="py-3 px-4">{t.products.lowStockThreshold}</th>
                <th className="py-3 px-4 text-right">{t.common.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {displayedProducts.map(product => {
                const isLow = product.stockQuantity <= product.lowStockThreshold;
                const isOut = product.stockQuantity === 0;

                return (
                  <tr key={product.id} className="hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-pink-600">
                      {product.sku}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">
                        {language === 'bn' && product.nameBn ? product.nameBn : product.name}
                      </p>
                      {language === 'bn' && product.nameBn && (
                        <p className="text-[10px] text-slate-400">{product.name}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">
                      ৳{product.purchasePrice}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      ৳{product.sellingPrice}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isOut
                          ? 'bg-slate-200 text-slate-700'
                          : isLow
                          ? 'bg-rose-100 text-rose-700 font-extrabold'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isLow && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                        {product.stockQuantity} {language === 'bn' ? 'টি' : 'units'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {product.lowStockThreshold} {language === 'bn' ? 'টি' : 'units'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {/* Increment / Decrement Stock buttons */}
                      <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                        <button
                          disabled={product.stockQuantity <= 0}
                          onClick={() => handleAdjustStock(product, -1)}
                          className="p-1 rounded-md text-slate-600 hover:text-rose-600 hover:bg-white disabled:opacity-30 transition-colors"
                          title="Reduce 1 (Discard/Damage)"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-700">
                          {product.stockQuantity}
                        </span>
                        <button
                          onClick={() => handleAdjustStock(product, 1)}
                          className="p-1 rounded-md text-slate-600 hover:text-emerald-600 hover:bg-white transition-colors"
                          title="Add 1 (Restock)"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
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
