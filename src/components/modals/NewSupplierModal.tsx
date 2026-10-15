import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.js';
import { X, Truck } from 'lucide-react';

interface NewSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewSupplierModal: React.FC<NewSupplierModalProps> = ({ isOpen, onClose }) => {
  const { addSupplier, t, language } = useApp();

  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [productsSuppliedText, setProductsSuppliedText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !name.trim() || !phone.trim()) return;

    const products = productsSuppliedText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    setSubmitting(true);
    const success = await addSupplier({
      company: company.trim(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim() || 'Dhaka',
      productsSupplied: products.length > 0 ? products : ['Beauty Cosmetics'],
      totalPurchases: 0,
      status: 'active',
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
              <Truck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-800">
              {t.suppliers.addSupplier}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {t.suppliers.company} *
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="e.g. CosmoCraft Essentials BD"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t.suppliers.contactPerson} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Manager Name"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t.customers.phone} *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {t.customers.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="orders@supplier.com"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {t.suppliers.suppliedItems} (Comma separated)
            </label>
            <input
              type="text"
              value={productsSuppliedText}
              onChange={e => setProductsSuppliedText(e.target.value)}
              placeholder="e.g. Lipsticks, Vitamin C Serum, Eyeliner"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {t.customers.address}
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Warehouse location / Office..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden"
            />
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
              {submitting ? t.common.loading : t.suppliers.addSupplier}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
