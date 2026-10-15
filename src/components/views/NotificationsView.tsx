import React from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  Bell,
  AlertTriangle,
  Clock,
  MessageSquare,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { summary, messages, t, language, setActiveTab } = useApp();

  const notifications = [
    ...(summary?.lowStockProducts.map(p => ({
      id: `notif-stock-${p.id}`,
      type: 'warning',
      title: language === 'bn' ? `স্বল্প মজুদের পণ্য: ${p.name}` : `Low Stock Alert: ${p.name}`,
      desc: language === 'bn'
        ? `বর্তমানে মাত্র ${p.stockQuantity}টি স্টকে আছে (সতর্কতা সীমা: ${p.lowStockThreshold})`
        : `Only ${p.stockQuantity} left in stock (threshold: ${p.lowStockThreshold})`,
      time: 'Just now',
      actionTab: 'inventory',
    })) || []),
    ...(summary?.pendingOrdersCount && summary.pendingOrdersCount > 0
      ? [
          {
            id: 'notif-pending-orders',
            type: 'info',
            title: language === 'bn'
              ? `${summary.pendingOrdersCount}টি অপেক্ষমাণ পেন্ডিং অর্ডার`
              : `${summary.pendingOrdersCount} Pending Orders`,
            desc: language === 'bn'
              ? 'গ্রাহকের সাথে কথা বলে কুরিয়ারে বুকিং নিশ্চিত করুন।'
              : 'Requires verification and courier dispatch confirmation.',
            time: 'Active',
            actionTab: 'orders',
          },
        ]
      : []),
    ...(messages.filter(m => !m.isReplied).map(m => ({
      id: `notif-msg-${m.id}`,
      type: 'message',
      title: language === 'bn' ? `নতুন কাস্টমার জিজ্ঞাসা: ${m.senderName}` : `Customer Inquiry: ${m.senderName}`,
      desc: `"${m.messageText}"`,
      time: 'Recent',
      actionTab: 'messages',
    })) || []),
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Bell className="w-6 h-6 text-pink-600" />
          <span>{t.nav.notifications}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {language === 'bn'
            ? 'দোকানের জরুরি অ্যালার্ট, স্টক সতর্কতা এবং কাস্টমার নোটিফিকেশন'
            : 'Operational notifications, stock thresholds, and fulfillment tasks'}
        </p>
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => setActiveTab(n.actionTab)}
              className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs hover:border-pink-300 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl mt-0.5 ${
                  n.type === 'warning'
                    ? 'bg-rose-100 text-rose-700'
                    : n.type === 'message'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {n.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : n.type === 'message' ? (
                    <MessageSquare className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800">
                    {n.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {n.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="hidden sm:inline">{n.time}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              {language === 'bn' ? 'সবকিছু স্বাভাবিক রয়েছে' : 'All clear! No urgent notifications'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
