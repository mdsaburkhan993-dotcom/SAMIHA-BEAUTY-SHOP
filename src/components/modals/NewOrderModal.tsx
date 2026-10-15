import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  X,
  Plus,
  Trash2,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  User,
  Phone,
  MapPin
} from 'lucide-react';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../../types/index.js';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({ isOpen, onClose }) => {
  const { products, customers, createOrder, t, language } = useApp();

  const activeProducts = products.filter(p => !p.isArchived && p.stockQuantity > 0);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>([
    { productId: activeProducts[0]?.id || '', quantity: 1 },
  ]);

  const [discount, setDiscount] = useState<number>(0);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(60);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('unpaid');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('pending');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectExistingCustomer = (custId: string) => {
    setSelectedCustomerId(custId);
    const found = customers.find(c => c.id === custId);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      setCustomerAddress(found.address);
    }
  };

  const handleAddItem = () => {
    if (activeProducts.length === 0) return;
    setItems(prev => [...prev, { productId: activeProducts[0].id, quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleItemProductChange = (index: number, prodId: string) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index].productId = prodId;
      return copy;
    });
  };

  const handleItemQuantityChange = (index: number, qty: number) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index].quantity = Math.max(1, qty);
      return copy;
    });
  };

  // Calculate live totals
  let subtotal = 0;
  items.forEach(it => {
    const prod = products.find(p => p.id === it.productId);
    if (prod) {
      subtotal += prod.sellingPrice * it.quantity;
    }
  });

  const totalAmount = Math.max(0, subtotal - (discount || 0) + (deliveryCharge || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !customerPhone.trim()) {
      setError(language === 'bn' ? 'গ্রাহকের নাম ও ফোন নম্বর আবশ্যক।' : 'Customer name and phone number are required.');
      return;
    }

    // Validate quantities against stock
    for (const it of items) {
      const prod = products.find(p => p.id === it.productId);
      if (!prod) {
        setError(`Product not found: ${it.productId}`);
        return;
      }
      if (it.quantity > prod.stockQuantity) {
        setError(
          language === 'bn'
            ? `"${prod.name}" এর পর্যাপ্ত স্টক নেই (স্টকে আছে: ${prod.stockQuantity}টি, চাওয়া হয়েছে: ${it.quantity}টি)`
            : `Insufficient stock for "${prod.name}" (Available: ${prod.stockQuantity}, Requested: ${it.quantity})`
        );
        return;
      }
    }

    setSubmitting(true);
    const success = await createOrder({
      customerId: selectedCustomerId || undefined,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim() || 'Dhaka',
      items,
      discount: Number(discount) || 0,
      deliveryCharge: Number(deliveryCharge) || 0,
      paymentStatus,
      paymentMethod,
      orderStatus,
      notes: notes.trim(),
    });

    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-pink-100 my-8 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">
                {t.orders.createOrder}
              </h3>
              <p className="text-[11px] text-slate-500">
                {t.shopName}
              </p>
            </div>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Selection or New */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase">
                {t.orders.customer} {t.common.required}
              </label>
              {customers.length > 0 && (
                <select
                  value={selectedCustomerId}
                  onChange={e => handleSelectExistingCustomer(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 text-slate-600"
                >
                  <option value="">{language === 'bn' ? '-- পূর্বের গ্রাহক বাছাই করুন --' : '-- Pick existing customer --'}</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder={language === 'bn' ? 'গ্রাহকের নাম' : 'Customer Name'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-pink-500 outline-hidden"
                />
              </div>
              <div>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder={language === 'bn' ? 'মোবাইল নম্বর (017...)' : 'Phone (e.g. 017...)'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-pink-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                value={customerAddress}
                onChange={e => setCustomerAddress(e.target.value)}
                placeholder={language === 'bn' ? 'ডেলিভারি ঠিকানা (বাড়ি, রোড, এলাকা, জেলা)' : 'Full Delivery Address'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-pink-500 outline-hidden"
              />
            </div>
          </div>

          {/* Product Items Selection */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase">
                {t.orders.items}
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.orders.addItem}</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((it, idx) => {
                const prod = products.find(p => p.id === it.productId);
                const maxStock = prod?.stockQuantity || 0;

                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs"
                  >
                    <select
                      value={it.productId}
                      onChange={e => handleItemProductChange(idx, e.target.value)}
                      className="flex-1 px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 outline-hidden truncate"
                    >
                      {activeProducts.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ৳{p.sellingPrice} ({p.stockQuantity} in stock)
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min="1"
                        max={maxStock}
                        value={it.quantity}
                        onChange={e => handleItemQuantityChange(idx, parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-center font-bold"
                      />
                      <span className="text-slate-400 text-[10px]">Max: {maxStock}</span>
                    </div>

                    <div className="w-20 text-right font-bold text-slate-800 shrink-0">
                      ৳{((prod?.sellingPrice || 0) * it.quantity).toLocaleString()}
                    </div>

                    <button
                      type="button"
                      disabled={items.length <= 1}
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-20 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Adjustments & Totals */}
          <div className="p-3 rounded-xl bg-pink-50/60 border border-pink-100 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">{t.common.subtotal}:</span>
              <span className="font-bold text-slate-800">৳{subtotal.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-pink-100">
              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">
                  {t.common.discount} (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={e => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">
                  {t.common.deliveryCharge} (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deliveryCharge}
                  onChange={e => setDeliveryCharge(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-pink-200 text-sm">
              <span className="font-bold text-slate-900">{t.common.total}:</span>
              <span className="font-extrabold text-base text-pink-700">
                ৳{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment & Order Status */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {t.orders.paymentMethod}
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
              >
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
                <option value="Bank">Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {t.orders.paymentStatus}
              </label>
              <select
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
              >
                <option value="unpaid">{t.common.unpaid}</option>
                <option value="paid">{t.common.paid}</option>
                <option value="partially_paid">{t.common.partiallyPaid}</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {t.orders.orderStatus}
              </label>
              <select
                value={orderStatus}
                onChange={e => setOrderStatus(e.target.value as OrderStatus)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
              >
                <option value="pending">{t.orders.statuses.pending}</option>
                <option value="confirmed">{t.orders.statuses.confirmed}</option>
                <option value="processing">{t.orders.statuses.processing}</option>
                <option value="shipped">{t.orders.statuses.shipped}</option>
              </select>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={language === 'bn' ? 'অর্ডার নোট (কুরিয়ার ট্র্যাকিং বা বিশেষ ডেলিভারি নির্দেশ)' : 'Order notes or courier instructions'}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-pink-500 outline-hidden"
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
              {submitting ? t.common.loading : t.orders.createOrder}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
