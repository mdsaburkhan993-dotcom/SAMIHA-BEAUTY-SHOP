import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  MessageSquare,
  MessageCircle,
  PhoneCall,
  Send,
  CheckCircle2,
  Clock,
  User,
  ShoppingBag
} from 'lucide-react';
import { CustomerMessage } from '../../types/index.js';

export const MessagesView: React.FC = () => {
  const { messages, t, language, replyMessage } = useApp();

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = async (id: string) => {
    if (!replyText.trim()) return;
    await replyMessage(id, replyText.trim());
    setActiveReplyId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-pink-600" />
          <span>{t.nav.messages}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {language === 'bn'
            ? 'ফেসবুক ও হোয়াটসঅ্যাপ থেকে আসা কাস্টমার জিজ্ঞাসা ও উত্তর'
            : 'Customer communications intake across active storefront channels'}
        </p>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs hover:border-pink-200 transition-all space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${
                  msg.channel === 'facebook' ? 'bg-blue-600' : 'bg-emerald-600'
                }`}>
                  {msg.channel === 'facebook' ? (
                    <MessageCircle className="w-4 h-4" />
                  ) : (
                    <PhoneCall className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{msg.senderName}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">{msg.senderContact}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  msg.isReplied ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {msg.isReplied
                    ? (language === 'bn' ? 'উত্তর দেওয়া হয়েছে ✓' : 'Replied ✓')
                    : (language === 'bn' ? 'উত্তর অপেক্ষমাণ' : 'Pending Response')}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              "{msg.messageText}"
            </p>

            {/* Quick reply form */}
            {activeReplyId === msg.id ? (
              <div className="space-y-2 pt-1">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder={language === 'bn' ? 'আপনার উত্তর লিখুন...' : 'Type response...'}
                  className="w-full p-2.5 text-xs rounded-xl border border-pink-300 focus:ring-2 focus:ring-pink-100 outline-hidden"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setActiveReplyId(null)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    onClick={() => handleSendReply(msg.id)}
                    className="px-4 py-1.5 bg-pink-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <span>{language === 'bn' ? 'পাঠান' : 'Send'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-end pt-1">
                <button
                  onClick={() => {
                    setActiveReplyId(msg.id);
                    setReplyText('');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-pink-200 text-pink-700 hover:bg-pink-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-pink-600" />
                  <span>{language === 'bn' ? 'দ্রুত উত্তর দিন' : 'Quick Reply'}</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
