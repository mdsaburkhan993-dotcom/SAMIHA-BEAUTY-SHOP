import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.js';
import { X, CheckSquare } from 'lucide-react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose }) => {
  const { addTask, t, language } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'business' | 'personal' | 'inventory' | 'customer'>('business');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    const success = await addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      dueDate,
    });

    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-pink-100 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-800">
              {t.tasks.addTask}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {t.tasks.taskTitle} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: কুরিয়ারে পার্সেল বুকিং দিন' : 'e.g. Confirm courier shipment'}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {t.tasks.description}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={language === 'bn' ? 'কাজের বিস্তারিত বিবরণ...' : 'Task details...'}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t.tasks.category}
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="business">{t.tasks.categories.business}</option>
                <option value="inventory">{t.tasks.categories.inventory}</option>
                <option value="customer">{t.tasks.categories.customer}</option>
                <option value="personal">{t.tasks.categories.personal}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t.tasks.priority}
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="high">{t.tasks.high}</option>
                <option value="medium">{t.tasks.medium}</option>
                <option value="low">{t.tasks.low}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {t.tasks.dueDate}
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              {submitting ? t.common.loading : t.tasks.addTask}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
