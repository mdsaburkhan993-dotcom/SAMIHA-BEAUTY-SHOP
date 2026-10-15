import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  FlaskConical,
  Play,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  RotateCcw,
  Boxes,
  ShoppingBag,
  DollarSign,
  Loader2
} from 'lucide-react';

export const SystemTestsView: React.FC = () => {
  const { testResults, runTests, isRunningTests, t, language } = useApp();

  useEffect(() => {
    if (testResults.length === 0) {
      runTests();
    }
  }, []);

  const allPassed = testResults.length > 0 && testResults.every(r => r.passed);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-pink-600" />
            <span>{t.tests.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.tests.subtitle}
          </p>
        </div>

        <button
          onClick={runTests}
          disabled={isRunningTests}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {isRunningTests ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>{t.tests.runAll}</span>
        </button>
      </div>

      {/* Overview Status Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between ${
        allPassed
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
          : 'bg-rose-50/80 border-rose-200 text-rose-900'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl text-white ${allPassed ? 'bg-emerald-500' : 'bg-rose-500'}`}>
            {allPassed ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base">
              {allPassed ? t.tests.allPassed : 'Some test cases require review'}
            </h3>
            <p className="text-xs opacity-80 mt-0.5">
              {testResults.filter(r => r.passed).length} of {testResults.length} test assertions passed.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/70 shadow-2xs">
          100% Deterministic
        </span>
      </div>

      {/* Tests Results Grid */}
      <div className="space-y-3">
        {testResults.map((test, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs hover:border-pink-200 transition-all flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 p-1 rounded-lg ${
                test.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {test.passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800">
                    {test.name}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600">
                    {test.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {test.message}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                test.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {test.passed ? 'PASSED' : 'FAILED'}
              </span>
              <p className="text-[10px] font-mono text-slate-400 mt-1">
                {test.durationMs}ms
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
