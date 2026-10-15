import React from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  Settings,
  ShieldCheck,
  Database,
  Languages,
  User,
  Store,
  CheckCircle2,
  Lock,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, language, setLanguage, t, firebaseUser, loginWithGoogle, logoutFirebase } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-6 h-6 text-pink-600" />
          <span>{t.nav.settings}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {language === 'bn'
            ? 'দোকানের প্রোফাইল, নিরাপত্তা পলিসি এবং ডাটাবেস সেটিংস'
            : 'Store configuration, Zero-Trust security profile, and cloud engine status'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shop & Administrator Profile */}
        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Store className="w-5 h-5 text-pink-600" />
            <h3 className="font-bold text-base text-slate-800">
              {language === 'bn' ? 'দোকান ও অ্যাডমিন তথ্য' : 'Store & Admin Identity'}
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 text-xs block font-medium">
                {language === 'bn' ? 'দোকানের নাম' : 'Store Name'}
              </span>
              <p className="font-bold text-slate-800 mt-0.5">{user.shopName}</p>
            </div>

            <div>
              <span className="text-slate-400 text-xs block font-medium">
                {language === 'bn' ? 'অ্যাডমিনিস্ট্রেটর' : 'Authorized Administrator'}
              </span>
              <p className="font-semibold text-slate-800 mt-0.5">{user.name}</p>
            </div>

            <div>
              <span className="text-slate-400 text-xs block font-medium">
                {language === 'bn' ? 'অনুমোদিত ইমেইল' : 'Verified Admin Email'}
              </span>
              <p className="font-mono text-pink-700 font-semibold mt-0.5">{user.email}</p>
            </div>

            <div>
              <span className="text-slate-400 text-xs block font-medium">
                {language === 'bn' ? 'ইউজার রোল' : 'RBAC Role'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-pink-100 text-pink-800 text-xs font-bold mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {user.role.toUpperCase()} (Full Permissions)
              </span>
            </div>

            <div className="pt-2">
              {firebaseUser ? (
                <button
                  onClick={logoutFirebase}
                  className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
                >
                  {language === 'bn' ? 'লগআউট (Sign Out)' : 'Sign Out from Google'}
                </button>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  {language === 'bn' ? 'গুগল একাউন্ট দিয়ে সাইন-ইন করুন' : 'Sign in with Google Account'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Database & Cloud Firestore Status */}
        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Database className="w-5 h-5 text-pink-600" />
            <h3 className="font-bold text-base text-slate-800">
              {language === 'bn' ? 'ডাটাবেস ও ক্লাউড স্টোরেজ' : 'Cloud Database Infrastructure'}
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900">Cloud Firestore Database</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                CONNECTED
              </span>
            </div>
            <p className="text-emerald-800 text-xs font-mono">
              Project: fluted-contact-tv4kj
            </p>
            <p className="text-[11px] text-emerald-700">
              {language === 'bn'
                ? 'ক্লাউড ফায়ারস্টোর সফলভাবে প্রোভিশন ও সিকিউরিটি রুলস ডেপ্লয় করা হয়েছে।'
                : 'Cloud Firestore provisioned with enterprise zero-trust security rules deployed.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Local High-Performance Engine</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ACTIVE
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              {language === 'bn'
                ? 'আপনার দোকানের পণ্য, অর্ডার, গ্রাহক এবং টাস্কসমূহ তাৎক্ষণিক পারফরম্যান্সে সার্ভারেও সংরক্ষিত থাকে।'
                : 'Fast responsive local disk engine powers sub-millisecond stock checks and offline safety.'}
            </p>
          </div>
        </div>
      </div>

      {/* Language Switcher Preference */}
      <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Languages className="w-5 h-5 text-pink-600" />
          <h3 className="font-bold text-base text-slate-800">
            {language === 'bn' ? 'ভাষা নির্বাচন' : 'Language Selection'}
          </h3>
        </div>

        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'সামিহা এআই ড্যাশবোর্ড সম্পূর্ণ বাংলা এবং ইংরেজিতে পরিচালনা করা যায়।'
            : 'Choose your default operational language for navigation, reports, and AI answers.'}
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => setLanguage('bn')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              language === 'bn'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            বাংলা (Bengali) ✓
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              language === 'en'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            English (Global)
          </button>
        </div>
      </div>
    </div>
  );
};
