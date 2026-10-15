import React from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Sparkles,
  Languages,
  PlusCircle,
  Bot,
  Bell,
  Database,
  Menu,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileNav: () => void;
  onOpenNewOrder: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav, onOpenNewOrder }) => {
  const { language, setLanguage, t, summary, setActiveTab, user, firebaseUser, loginWithGoogle } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Menu + Shop Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileNav}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-pink-600 to-rose-700 bg-clip-text text-transparent leading-none">
                  SAMIHA AI
                </h1>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5 hidden xs:block">
                  {language === 'bn' ? 'সামিহা বিউটি শপ ম্যানেজার' : 'Beauty Business Manager'}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Engine & Security Badge (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-xs text-emerald-800">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium">{language === 'bn' ? 'ফায়ারবেস ক্লাউড স্টোর সংযুক্ত' : 'Cloud Firestore Active'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-xs shadow-emerald-500/50" />
          </div>

          {/* Right: Actions, Language Toggle, User Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Ask AI button */}
            <button
              onClick={() => setActiveTab('aiAssistant')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white rounded-lg text-xs sm:text-sm font-medium shadow-xs shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">{t.dashboard.askAi}</span>
            </button>

            {/* Quick New Order */}
            <button
              onClick={onOpenNewOrder}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-xs sm:text-sm font-medium shadow-xs shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t.dashboard.newOrder}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-pink-50 hover:border-pink-300 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
              title="Change Language / ভাষা পরিবর্তন"
            >
              <Languages className="w-4 h-4 text-pink-600" />
              <span>{language === 'bn' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Notification Bell with Low Stock / Pending badge */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-lg text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {((summary?.pendingOrdersCount || 0) > 0 || (summary?.lowStockCount || 0) > 0) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* User Profile Pill & Google Auth */}
            {firebaseUser ? (
              <div
                onClick={() => setActiveTab('settings')}
                className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group"
                title="Settings & Profile"
              >
                {firebaseUser.photoURL ? (
                  <img
                    src={firebaseUser.photoURL}
                    alt={firebaseUser.displayName || 'User'}
                    className="w-8 h-8 rounded-full border border-pink-300 group-hover:ring-2 group-hover:ring-pink-400 transition-all object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-700 font-bold text-xs group-hover:ring-2 group-hover:ring-pink-400 transition-all">
                    {firebaseUser.displayName ? firebaseUser.displayName.slice(0, 2).toUpperCase() : 'SK'}
                  </div>
                )}
                <div className="text-left hidden md:block">
                  <p className="text-xs font-semibold text-slate-800 leading-tight flex items-center gap-1">
                    {firebaseUser.displayName || 'Sabur Khan'}
                    <ShieldCheck className="w-3.5 h-3.5 text-pink-600 inline" />
                  </p>
                  <p className="text-[10px] text-pink-600 font-medium leading-none">
                    {user.role.toUpperCase()}
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-pink-200 bg-pink-50 hover:bg-pink-100 text-pink-800 text-xs font-semibold transition-colors"
                title="Sign in with Google"
              >
                <span>Google {language === 'bn' ? 'লগইন' : 'Login'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
