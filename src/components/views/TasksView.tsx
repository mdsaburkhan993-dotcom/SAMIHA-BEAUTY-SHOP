import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  CheckSquare,
  PlusCircle,
  Clock,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Task } from '../../types/index.js';

interface TasksViewProps {
  onOpenNewTask: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onOpenNewTask }) => {
  const { tasks, t, language, toggleTask, deleteTask } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterCompleted, setFilterCompleted] = useState<'all' | 'pending' | 'completed'>('all');

  const categories = [
    { id: 'all', label: t.common.all },
    { id: 'business', label: t.tasks.categories.business },
    { id: 'inventory', label: t.tasks.categories.inventory },
    { id: 'customer', label: t.tasks.categories.customer },
    { id: 'personal', label: t.tasks.categories.personal },
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesCat = activeCategory === 'all' || task.category === activeCategory;
    const matchesStatus =
      filterCompleted === 'all'
        ? true
        : filterCompleted === 'completed'
        ? task.isCompleted
        : !task.isCompleted;
    return matchesCat && matchesStatus;
  });

  const priorityColor = (p: string) => {
    switch (p) {
      case 'high':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-pink-600" />
            <span>{t.tasks.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.tasks.subtitle}
          </p>
        </div>

        <button
          onClick={onOpenNewTask}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.tasks.addTask}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-pink-50 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setFilterCompleted('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filterCompleted === 'all' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500'
            }`}
          >
            {t.common.all}
          </button>
          <button
            onClick={() => setFilterCompleted('pending')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filterCompleted === 'pending' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500'
            }`}
          >
            {t.tasks.pending}
          </button>
          <button
            onClick={() => setFilterCompleted('completed')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filterCompleted === 'completed' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500'
            }`}
          >
            {t.tasks.completed}
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                task.isCompleted
                  ? 'bg-slate-50/80 border-slate-200/70 opacity-75'
                  : 'bg-white border-pink-100/90 shadow-xs hover:border-pink-200'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <button
                  onClick={() => toggleTask(task.id, task.isCompleted)}
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                    task.isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 hover:border-pink-500 bg-white'
                  }`}
                  title="Toggle complete"
                >
                  {task.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div className="space-y-1">
                  <h4
                    className={`text-sm sm:text-base font-semibold leading-snug ${
                      task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {task.title}
                  </h4>

                  {task.description && (
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span className={`px-2 py-0.5 rounded-md font-semibold border ${priorityColor(task.priority)}`}>
                      {t.tasks[task.priority as 'high' | 'medium' | 'low'] || task.priority}
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium capitalize">
                      {t.tasks.categories[task.category] || task.category}
                    </span>

                    {task.dueDate && (
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-pink-500" />
                        <span>{task.dueDate}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm(language === 'bn' ? 'টাস্কটি মুছে ফেলবেন?' : 'Delete this task?')) {
                    deleteTask(task.id);
                  }
                }}
                className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title={t.common.delete}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">{t.common.noData}</p>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'bn' ? 'কোনো টাস্ক বাকি নেই।' : 'No tasks matching criteria.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
