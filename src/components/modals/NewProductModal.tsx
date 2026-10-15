import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  X,
  Package,
  DollarSign,
  Boxes,
  AlertCircle
} from 'lucide-react';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct, t, language } = useApp();

  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Skincare');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    'Skincare',
    'Makeup',
    'Haircare',
    'Fragrance',
    'Bath & Body',
    'Beauty Tools',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !sku.trim()) {
      setError(language === 'bn' ? 'পণ্যের নাম ও SKU আবশ্যক।' : 'Product name and SKU are required.');
      return;
    }

    if (purchasePrice < 0 || sellingPrice < 0 || stockQuantity < 0) {
      setError(language === 'bn' ? 'মূল্য বা স্টক ঋণাত্মক হতে পারবে না।' : 'Prices and stock cannot be negative.');
      return;
    }

    setSubmitting(true);
    const success = await addProduct({
      name: name.trim(),
      nameBn: nameBn.trim() || undefined,
      sku: sku.trim().toUpperCase(),
      category,
      purchasePrice: Number(purchasePrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      stockQuantity: Number(stockQuantity) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 5,
      description: description.trim() || undefined,
    });

    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-pink-100 my-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-800">
              {t.products.addProduct}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {t.products.productName} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Matte Velvet Liquid Lipstick"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {t.products.productNameBn}
            </label>
            <input
              type="text"
              value={nameBn}
              onChange={e => setNameBn(e.target.value)}
              placeholder="যেমন: ম্যাট ভেলভেট লিকুইড লিপস্টিক"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden font-bengali"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t.products.sku} *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={e => setSku(e.target.value)}
                placeholder="SB-LIP-01"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t.products.category}
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t.products.purchasePrice} (৳) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={purchasePrice}
                onChange={e => setPurchasePrice(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t.products.sellingPrice} (৳) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={sellingPrice}
                onChange={e => setSellingPrice(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden font-bold text-pink-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t.products.stockQuantity} *
              </label>
              <input
                type="number"
                min="0"
                required
                value={stockQuantity}
                onChange={e => setStockQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t.products.lowStockThreshold}
              </label>
              <input
                type="number"
                min="1"
                value={lowStockThreshold}
                onChange={e => setLowStockThreshold(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {t.tasks.description}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short product benefits, ingredients, or usage notes..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {submitting ? t.common.loading : t.products.addProduct}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
