import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  RotateCcw,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Boxes
} from 'lucide-react';
import { ReturnStatus } from '../../types/index.js';

interface ReturnsViewProps {
  onOpenNewReturn: () => void;
}

export const ReturnsView: React.FC<ReturnsViewProps> = ({ onOpenNewReturn }) => {
  const { returns, t, language, updateReturnStatus } = useApp();

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (returnId: string, status: ReturnStatus) => {
    setUpdatingId(returnId);
    await updateReturnStatus(returnId, status);
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-pink-600" />
            <span>{t.returns.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.returns.subtitle}
          </p>
        </div>

        <button
          onClick={onOpenNewReturn}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.returns.addReturn}</span>
        </button>
      </div>

      {/* Restock Inspection Policy Card */}
      <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200/80 text-xs text-purple-900 flex items-start gap-2.5">
        <Boxes className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">{t.returns.restockNote}</p>
          <p className="text-[11px] text-purple-700 mt-0.5">
            {language === 'bn'
              ? 'নিরাপত্তা নিয়ম: ক্ষতিগ্রস্ত বা ব্যবহৃত পণ্য ইনভেন্টরিতে ফিরবে না। সিলযুক্ত পণ্য অনুমোদিত হলে ১ বারই স্টক বাড়ানো হবে।'
              : 'Zero duplicate restocking guard. Only unopened/sealed items return to saleable inventory.'}
          </p>
        </div>
      </div>

      {/* Returns List */}
      <div className="space-y-4">
        {returns.map(ret => (
          <div
            key={ret.id}
            className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs hover:border-pink-200 transition-all space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-pink-600">
                  {ret.returnNumber}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-600">
                  {t.returns.orderRef}: <strong className="font-mono">{ret.orderNumber}</strong>
                </span>
                {ret.isRestocked && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {language === 'bn' ? 'স্টকে রিস্টক সম্পন্ন ✓' : 'Restocked to Inventory ✓'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  ret.status === 'approved' || ret.status === 'refunded'
                    ? 'bg-emerald-100 text-emerald-800'
                    : ret.status === 'rejected'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {ret.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Customer & Reason */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 text-[10px] uppercase font-semibold">
                  {t.orders.customer}
                </p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{ret.customerName}</p>
                <p className="text-slate-500 font-mono mt-0.5">{ret.customerPhone}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 text-[10px] uppercase font-semibold">
                  {language === 'bn' ? 'ফেরতের কারণ' : 'Return Reason'}
                </p>
                <p className="text-slate-700 font-medium mt-0.5">{ret.reason}</p>
              </div>
            </div>

            {/* Items and Condition */}
            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2 text-xs">
              <p className="font-semibold text-slate-700 text-xs">
                {language === 'bn' ? 'ফেরতকৃত পণ্য ও শর্ত যাচাই:' : 'Returned Items & Condition Assessment:'}
              </p>
              <div className="space-y-1.5">
                {ret.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-slate-800">{it.productName}</span>
                      <span className="text-slate-400"> × {it.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        it.condition === 'unopened'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {it.condition === 'unopened' ? t.returns.unopened : t.returns.damaged}
                      </span>
                      <span className="font-bold text-slate-800">৳{it.refundAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions: Refund status dropdown */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-medium">
                  {language === 'bn' ? 'মোট রিফান্ড প্রদেয়:' : 'Total Refund:'}
                </span>{' '}
                <span className="font-bold text-sm text-pink-700">
                  ৳{ret.totalRefundAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">
                  {language === 'bn' ? 'রিফান্ড সিদ্ধান্ত:' : 'Action:'}
                </span>
                <select
                  disabled={updatingId === ret.id}
                  value={ret.status}
                  onChange={e => handleStatusChange(ret.id, e.target.value as ReturnStatus)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-pink-500 outline-hidden transition-all shadow-2xs"
                >
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approve &amp; Restock</option>
                  <option value="refunded">Refunded</option>
                  <option value="rejected">Reject</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
