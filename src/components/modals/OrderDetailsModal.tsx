import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  X,
  Printer,
  ShoppingBag,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/index.js';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  const { updateOrderStatus, t, language } = useApp();
  const [updating, setUpdating] = useState(false);

  if (!isOpen || !order) return null;

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setUpdating(true);
    await updateOrderStatus(order.id, newStatus);
    setUpdating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-pink-100 my-8 space-y-5 print:shadow-none print:border-none print:m-0 print:p-4">
        {/* Modal Top Header (Hidden on print) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">
                {language === 'bn' ? 'অর্ডার ইনভয়েস ও বিস্তারিত' : 'Order Invoice & Details'}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                {order.orderNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pink-200 text-pink-700 hover:bg-pink-50 text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'bn' ? 'চালান প্রিন্ট' : 'Print Invoice'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Header */}
        <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-pink-600 tracking-tight">
              SAMIHA BEAUTY SHOP
            </h2>
            <p className="text-xs text-slate-600">
              {language === 'bn' ? 'সামিহা বিউটি শপ — অথেনটিক কসমেটিক্স' : 'Authentic Skincare, Makeup & Cosmetics'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Dhaka, Bangladesh • Hotline: 01712345678
            </p>
          </div>

          <div className="text-left sm:text-right text-xs">
            <p className="font-mono font-bold text-sm text-slate-800">
              INV: {order.orderNumber}
            </p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              {new Date(order.createdAt).toLocaleDateString([], {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase mt-1 ${
              order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {order.paymentMethod} • {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Customer Information Box */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
          <p className="text-[10px] font-bold uppercase text-slate-400">
            {language === 'bn' ? 'ডেলিভারি ঠিকানা ও গ্রাহক:' : 'Deliver To:'}
          </p>
          <p className="font-bold text-slate-800 text-sm">{order.customerName}</p>
          <p className="text-slate-600 flex items-center gap-1.5 font-mono">
            <Phone className="w-3.5 h-3.5 text-pink-500" />
            <span>{order.customerPhone}</span>
          </p>
          <p className="text-slate-600 flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
            <span>{order.customerAddress}</span>
          </p>
        </div>

        {/* Line Items Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                <th className="py-2.5 px-3">SL</th>
                <th className="py-2.5 px-3">{t.orders.item}</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3 text-center">{t.orders.qty}</th>
                <th className="py-2.5 px-3 text-right">{t.orders.price}</th>
                <th className="py-2.5 px-3 text-right">{t.common.total}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {order.items.map((it, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{it.productName}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{it.sku}</td>
                  <td className="py-2.5 px-3 text-center font-bold">{it.quantity}</td>
                  <td className="py-2.5 px-3 text-right">৳{it.sellingPrice}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">৳{it.subtotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex justify-end text-xs">
          <div className="w-64 space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-slate-600">
              <span>{t.common.subtotal}:</span>
              <span>৳{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>{t.common.discount}:</span>
                <span>-৳{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>{t.common.deliveryCharge}:</span>
              <span>+৳{order.deliveryCharge.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-pink-700 pt-1.5 border-t border-slate-200">
              <span>{t.common.netAmount}:</span>
              <span>৳{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Status Transition Control (Hidden on print) */}
        <div className="p-3.5 rounded-xl bg-pink-50/60 border border-pink-100 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              {language === 'bn' ? 'অর্ডারের বর্তমান অবস্থা:' : 'Current Status:'}
            </span>
            <span className="font-bold text-pink-700">
              {t.orders.statuses[order.orderStatus] || order.orderStatus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              disabled={updating}
              value={order.orderStatus}
              onChange={e => handleStatusChange(e.target.value as OrderStatus)}
              className="px-3 py-1.5 rounded-xl border border-pink-300 bg-white font-bold text-slate-800 shadow-xs outline-hidden"
            >
              <option value="pending">{t.orders.statuses.pending}</option>
              <option value="confirmed">{t.orders.statuses.confirmed}</option>
              <option value="processing">{t.orders.statuses.processing}</option>
              <option value="shipped">{t.orders.statuses.shipped}</option>
              <option value="delivered">{t.orders.statuses.delivered}</option>
              <option value="cancelled">{t.orders.statuses.cancelled}</option>
            </select>
          </div>
        </div>

        {/* Signatures on Print */}
        <div className="hidden print:flex items-end justify-between pt-12 text-xs text-slate-500">
          <div className="border-t border-slate-400 pt-1 px-4 text-center">
            Customer Signature
          </div>
          <div className="border-t border-slate-400 pt-1 px-4 text-center">
            Authorized Signature (Samiha Beauty)
          </div>
        </div>
      </div>
    </div>
  );
};
