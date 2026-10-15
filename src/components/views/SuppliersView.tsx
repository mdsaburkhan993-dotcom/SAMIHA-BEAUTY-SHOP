import React from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  Truck,
  PlusCircle,
  Phone,
  Mail,
  MapPin,
  Package,
  Building2,
  DollarSign
} from 'lucide-react';

interface SuppliersViewProps {
  onOpenNewSupplier: () => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({ onOpenNewSupplier }) => {
  const { suppliers, t, language } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Truck className="w-6 h-6 text-pink-600" />
            <span>{t.suppliers.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.suppliers.subtitle}
          </p>
        </div>

        <button
          onClick={onOpenNewSupplier}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.suppliers.addSupplier}</span>
        </button>
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map(sup => (
          <div
            key={sup.id}
            className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs hover:border-pink-200 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-800 leading-snug">
                    {sup.company}
                  </h3>
                  <p className="text-xs text-pink-600 font-medium">
                    {language === 'bn' ? 'যোগাযোগ:' : 'Contact:'} {sup.name}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  sup.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {sup.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-pink-500" />
                  <a href={`tel:${sup.phone}`} className="hover:text-pink-600 font-mono">
                    {sup.phone}
                  </a>
                </p>
                {sup.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-pink-500" />
                    <span>{sup.email}</span>
                  </p>
                )}
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                  <span>{sup.address}</span>
                </p>
              </div>

              {/* Supplied Products Tags */}
              <div className="pt-2">
                <span className="text-[10px] text-slate-400 font-medium block mb-1">
                  {t.suppliers.suppliedItems}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sup.productsSupplied.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 text-[11px] font-medium border border-pink-100"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">{t.suppliers.totalPurchases}:</span>
              <span className="font-extrabold text-slate-800 text-sm">
                ৳{sup.totalPurchases.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
