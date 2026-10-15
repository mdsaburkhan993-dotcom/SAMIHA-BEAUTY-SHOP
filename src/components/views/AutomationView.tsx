import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  Cpu,
  Sparkles,
  Zap,
  Check,
  ShieldCheck,
  BellRing,
  RotateCcw,
  Boxes
} from 'lucide-react';

export const AutomationView: React.FC = () => {
  const { t, language } = useApp();

  const [automations, setAutomations] = useState([
    {
      id: 'auto-stock-deduct',
      title: language === 'bn' ? 'স্বয়ংক্রিয় স্টক সমন্বয় (Auto Stock Deduction)' : 'Automatic Stock Deduction on Confirmed Order',
      desc: language === 'bn' ? 'অর্ডার Confirmed হলে ইনভেন্টরি থেকে সঠিক পরিমাণ পণ্য কেটে নেওয়া হয়।' : 'Instantly reduces shelf stock exactly once when order changes to confirmed.',
      enabled: true,
      locked: true, // System core
    },
    {
      id: 'auto-cancel-restore',
      title: language === 'bn' ? 'বাতিল অর্ডারের স্টক পুনঃসংযোজন (Cancel Restock)' : 'Automatic Stock Restoration on Cancellation',
      desc: language === 'bn' ? 'অর্ডার বাতিল বা ফেরত হলে পণ্য স্বয়ংক্রিয়ভাবে বিক্রয়যোগ্য স্টকে যোগ হয়।' : 'Restores reserved units back to available inventory safely upon order cancellation.',
      enabled: true,
      locked: true,
    },
    {
      id: 'auto-low-stock-alert',
      title: language === 'bn' ? 'স্বল্প স্টক নোটিফিকেশন ট্রিগার' : 'Low Stock Automated Alert Trigger',
      desc: language === 'bn' ? 'পণ্য নির্ধারিত সীমার নিচে নামলে সাথে সাথে ড্যাশবোর্ডে সতর্কতা পাঠানো।' : 'Generates high-priority warning card when any SKU crosses minimum threshold.',
      enabled: true,
    },
    {
      id: 'auto-customer-sync',
      title: language === 'bn' ? 'গ্রাহক ক্রয়ের রেকর্ড অটো-সিঙ্ক' : 'Customer Lifetime Spend Auto-Sync',
      desc: language === 'bn' ? 'নতুন অর্ডারে গ্রাহকের মোট অর্ডার সংখ্যা এবং খরচের হিসাব আপডেট।' : 'Updates customer order frequency and cumulative spend on each confirmed purchase.',
      enabled: true,
    },
  ]);

  const toggleAuto = (id: string) => {
    setAutomations(prev =>
      prev.map(a => (a.id === id && !a.locked ? { ...a, enabled: !a.enabled } : a))
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Cpu className="w-6 h-6 text-pink-600" />
          <span>{t.nav.automation}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {language === 'bn'
            ? 'দোকান পরিচালনার স্মার্ট বিজনেস রুলস ও স্বয়ংক্রিয় প্রক্রিয়া'
            : 'Operational triggers, transactional safety guards, and scheduled checks'}
        </p>
      </div>

      <div className="space-y-3">
        {automations.map(auto => (
          <div
            key={auto.id}
            className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs flex items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl text-white ${
                auto.enabled ? 'bg-pink-500' : 'bg-slate-300'
              }`}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-800">{auto.title}</h4>
                  {auto.locked && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-emerald-100 text-emerald-800">
                      Core Rule
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {auto.desc}
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleAuto(auto.id)}
              disabled={auto.locked}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                auto.enabled ? 'bg-pink-600' : 'bg-slate-200'
              } ${auto.locked ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                  auto.enabled ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
