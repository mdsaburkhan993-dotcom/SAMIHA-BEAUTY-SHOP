import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  Users,
  PlusCircle,
  Search,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { Customer } from '../../types/index.js';

interface CustomersViewProps {
  onOpenNewCustomer: () => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ onOpenNewCustomer }) => {
  const { customers, orders, t, language } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-pink-600" />
            <span>{t.customers.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.customers.subtitle} ({customers.length} {language === 'bn' ? 'জন নিবন্ধিত গ্রাহক' : 'registered'})
          </p>
        </div>

        <button
          onClick={onOpenNewCustomer}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.customers.addCustomer}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={language === 'bn' ? 'গ্রাহকের নাম বা ফোন নম্বর দিয়ে খুঁজুন...' : 'Search by name or phone...'}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-hidden transition-all"
        />
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cust => (
          <div
            key={cust.id}
            className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs hover:border-pink-200 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-800 leading-tight">
                    {cust.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cust.city || 'Dhaka'}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs shrink-0">
                  {cust.name.slice(0, 2).toUpperCase()}
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 pt-1">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-pink-500" />
                  <a href={`tel:${cust.phone}`} className="hover:text-pink-600 font-mono">
                    {cust.phone}
                  </a>
                </p>
                {cust.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-pink-500" />
                    <span className="truncate">{cust.email}</span>
                  </p>
                )}
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                  <span className="truncate">{cust.address}</span>
                </p>
              </div>

              {cust.notes && (
                <p className="p-2 rounded-lg bg-pink-50/70 border border-pink-100/70 text-[11px] text-pink-800">
                  {cust.notes}
                </p>
              )}
            </div>

            {/* Bottom: Spend totals & Direct Call/WhatsApp action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {t.customers.totalOrders} / {t.customers.totalSpent}
                </span>
                <span className="font-bold text-slate-800">
                  {cust.totalOrders} {language === 'bn' ? 'টি' : 'orders'} • ৳{cust.totalSpent.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`https://wa.me/88${cust.phone.replace(/^0/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                  title="WhatsApp Message"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href={`tel:${cust.phone}`}
                  className="p-1.5 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors"
                  title="Call Customer"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
