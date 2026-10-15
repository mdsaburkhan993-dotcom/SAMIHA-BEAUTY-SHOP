import React from 'react';
import { useApp } from '../context/AppContext.js';
import {
  LayoutDashboard,
  Bot,
  CheckSquare,
  ShoppingBag,
  Users,
  Package,
  Boxes,
  TrendingUp,
  Truck,
  RotateCcw,
  MessageSquare,
  Share2,
  Cpu,
  Bell,
  FileBarChart2,
  Settings,
  FlaskConical,
  X,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  mobileNavOpen: boolean;
  onCloseMobileNav: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileNavOpen, onCloseMobileNav }) => {
  const { activeTab, setActiveTab, t, summary } = useApp();

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    {
      id: 'aiAssistant',
      label: t.nav.aiAssistant,
      icon: Bot,
      highlight: true,
      badge: 'Gemini',
    },
    { id: 'tasks', label: t.nav.tasks, icon: CheckSquare },
    {
      id: 'orders',
      label: t.nav.orders,
      icon: ShoppingBag,
      count: summary?.pendingOrdersCount || 0,
      countColor: 'bg-amber-500 text-white',
    },
    { id: 'customers', label: t.nav.customers, icon: Users },
    { id: 'products', label: t.nav.products, icon: Package },
    {
      id: 'inventory',
      label: t.nav.inventory,
      icon: Boxes,
      count: summary?.lowStockCount || 0,
      countColor: 'bg-rose-500 text-white',
    },
    { id: 'sales', label: t.nav.sales, icon: TrendingUp },
    { id: 'suppliers', label: t.nav.suppliers, icon: Truck },
    { id: 'returns', label: t.nav.returns, icon: RotateCcw },
    { id: 'messages', label: t.nav.messages, icon: MessageSquare },
    { id: 'channels', label: t.nav.channels, icon: Share2 },
    { id: 'automation', label: t.nav.automation, icon: Cpu },
    { id: 'notifications', label: t.nav.notifications, icon: Bell },
    { id: 'reports', label: t.nav.reports, icon: FileBarChart2 },
    {
      id: 'systemTests',
      label: t.nav.systemTests,
      icon: FlaskConical,
      badge: 'Auto Test',
    },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onCloseMobileNav();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={onCloseMobileNav}
        />
      )}

      {/* Sidebar Container (Desktop Persistent + Mobile Slide-over) */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 left-0 z-50 md:z-20 h-full md:h-[calc(100vh-4rem)] w-72 bg-white border-r border-pink-100 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile-only Header with Close button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-pink-100 bg-pink-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800">SAMIHA BEAUTY</p>
              <p className="text-[11px] text-pink-600 font-medium">Business Manager</p>
            </div>
          </div>
          <button
            onClick={onCloseMobileNav}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items List with Scroll */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            {t.appName}
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20'
                    : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : item.highlight ? 'text-violet-600' : 'text-slate-500 group-hover:text-pink-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {/* Badges or counts */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-violet-100 text-violet-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs ${
                        isActive ? 'bg-white text-pink-600' : item.countColor || 'bg-pink-100 text-pink-700'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-3 border-t border-pink-100 bg-pink-50/40">
          <div className="p-3 rounded-xl bg-white border border-pink-100 shadow-xs">
            <p className="text-xs font-semibold text-slate-800">
              {t.shopName}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Powered by Gemini &amp; Firestore
            </p>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Security:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Zero-Trust
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Quick Bar for Fast Thumb Reachability on Phones */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-pink-100 shadow-lg px-2 py-1 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'dashboard' ? 'text-pink-600 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>{t.nav.dashboard}</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`relative flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'orders' ? 'text-pink-600 font-bold' : 'text-slate-500'
          }`}
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span>{t.nav.orders}</span>
          {(summary?.pendingOrdersCount || 0) > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 bg-amber-500 rounded-full ring-1 ring-white" />
          )}
        </button>

        {/* Center Floating AI Button */}
        <button
          onClick={() => setActiveTab('aiAssistant')}
          className="flex flex-col items-center -mt-5 bg-gradient-to-tr from-pink-500 to-rose-600 text-white p-2.5 rounded-full shadow-lg shadow-pink-500/30 active:scale-95 transition-transform"
          title="Ask AI"
        >
          <Bot className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`relative flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'inventory' ? 'text-pink-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Boxes className="w-5 h-5 mb-0.5" />
          <span>{t.nav.inventory}</span>
          {(summary?.lowStockCount || 0) > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 bg-rose-500 rounded-full ring-1 ring-white" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'tasks' ? 'text-pink-600 font-bold' : 'text-slate-500'
          }`}
        >
          <CheckSquare className="w-5 h-5 mb-0.5" />
          <span>{t.nav.tasks}</span>
        </button>
      </nav>
    </>
  );
};
