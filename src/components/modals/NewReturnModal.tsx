import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.js';
import { X, RotateCcw, AlertCircle } from 'lucide-react';
import { ReturnCondition } from '../../types/index.js';

interface NewReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewReturnModal: React.FC<NewReturnModalProps> = ({ isOpen, onClose }) => {
  const { orders, products, createReturn, t, language } = useApp();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [condition, setCondition] = useState<ReturnCondition>('unopened');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentOrder = orders.find(o => o.id === selectedOrderId);
  const currentItems = currentOrder?.items || [];
  const selectedProduct = products.find(p => p.id === (selectedProductId || currentItems[0]?.productId));

  const refundAmount = (selectedProduct?.sellingPrice || 0) * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedOrderId) {
      setError('Please select an order');
      return;
    }

    const prodId = selectedProductId || currentItems[0]?.productId;
    if (!prodId) {
      setError('Order has no items');
      return;
    }

    if (!reason.trim()) {
      setError(language === 'bn' ? 'ফেরতের কারণ উল্লেখ করুন।' : 'Please describe the return reason.');
      return;
    }

    setSubmitting(true);
    const success = await createReturn({
      orderId: selectedOrderId,
      items: [
        {
          productId: prodId,
          quantity,
          refundAmount,
          condition,
        },
      ],
      reason: reason.trim(),
    });

    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-pink-100 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-800">
              {t.returns.addReturn}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
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
              {t.returns.orderRef} *
            </label>
            <select
              value={selectedOrderId}
              onChange={e => {
                setSelectedOrderId(e.target.value);
                const ord = orders.find(o => o.id === e.target.value);
                if (ord && ord.items[0]) {
                  setSelectedProductId(ord.items[0].productId);
                }
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
            >
              {orders.map(o => (
                <option key={o.id} value={o.id}>
                  {o.orderNumber} — {o.customerName} (৳{o.totalAmount})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {t.orders.item} *
            </label>
            <select
              value={selectedProductId || currentItems[0]?.productId || ''}
              onChange={e => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
            >
              {currentItems.map(it => (
                <option key={it.productId} value={it.productId}>
                  {it.productName} (Qty: {it.quantity})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t.orders.qty}
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t.returns.condition}
              </label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value as ReturnCondition)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="unopened">{t.returns.unopened}</option>
                <option value="damaged">{t.returns.damaged}</option>
                <option value="opened_used">{t.returns.openedUsed}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {language === 'bn' ? 'ফেরতের কারণ' : 'Reason for Return'} *
            </label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: ভুল শেড পাঠানো হয়েছিল, সিলযুক্ত অবস্থায় আছে...' : 'e.g. Wrong color delivered, sealed in box...'}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden text-xs"
            />
          </div>

          <div className="p-3 rounded-xl bg-pink-50/70 border border-pink-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              {language === 'bn' ? 'প্রত্যাশিত রিফান্ড টাকা:' : 'Calculated Refund:'}
            </span>
            <span className="font-bold text-pink-700 text-sm">
              ৳{refundAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              {submitting ? t.common.loading : t.returns.addReturn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
