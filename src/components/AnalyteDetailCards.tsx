import React, { useState } from 'react';
import { ANALYTES_INFO } from '../data/standards';
import { usePen } from '../context/PenContext';
import { Info, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AnalyteDetailCards: React.FC = () => {
  const { currentSample } = usePen();
  const [expandedAnalyte, setExpandedAnalyte] = useState<string | null>(null);

  const analytes = [
    {
      id: 'lead' as const,
      data: ANALYTES_INFO.lead,
      currentPpb: currentSample.leadPpb,
      color: 'blue'
    },
    {
      id: 'arsenic' as const,
      data: ANALYTES_INFO.arsenic,
      currentPpb: currentSample.arsenicPpb,
      color: 'amber'
    },
    {
      id: 'mercury' as const,
      data: ANALYTES_INFO.mercury,
      currentPpb: currentSample.mercuryPpb,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Target Heavy Metal Analytes
          </h3>
          <p className="text-xs text-slate-500">
            Micro-electrochemical differential pulse voltammetry detection (EPA & WHO drinking limits)
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
          <span>EPA MCL = Maximum Contaminant Level</span>
          <span aria-hidden="true">·</span>
          <span>1 ppb = 1 µg/L = 0.001 ppm</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {analytes.map(({ id, data, currentPpb }) => {
          const mcl = data.epaMclPpb;
          const pctOfMcl = Math.round((currentPpb / mcl) * 100);
          const isExceeded = currentPpb >= mcl;
          const isWarning = !isExceeded && pctOfMcl >= 70;
          const isExpanded = expandedAnalyte === id;

          // Status colors
          const statusColor = isExceeded
            ? 'text-rose-700 bg-rose-50 border-rose-200'
            : isWarning
            ? 'text-amber-700 bg-amber-50 border-amber-200'
            : 'text-emerald-700 bg-emerald-50 border-emerald-200';

          const barColor = isExceeded
            ? 'bg-rose-600'
            : isWarning
            ? 'bg-amber-500'
            : 'bg-emerald-600';

          // Visual bar clamped to 150% max
          const barWidth = Math.min(100, (currentPpb / (mcl * 1.5)) * 100);
          const mclMarkerPos = (1 / 1.5) * 100; // 66.6% along bar

          return (
            <div
              key={id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-800 text-sm border border-slate-200">
                      {data.symbol}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm leading-tight">
                        {data.name}
                      </h4>
                      <div className="text-[11px] text-slate-500">
                        {data.valency} · Atomic #{data.atomicNumber}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${statusColor}`}>
                    {isExceeded ? 'Exceeds MCL' : isWarning ? 'Caution' : 'Within Limit'}
                  </span>
                </div>

                {/* Primary Metric */}
                <div className="mt-4">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Detected Concentration
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-3xl font-extrabold font-mono-numbers text-slate-900 tracking-tight">
                      {currentPpb >= 10 ? currentPpb.toFixed(1) : currentPpb >= 1 ? currentPpb.toFixed(2) : currentPpb.toFixed(3)}
                    </span>
                    <span className="text-xs uppercase font-mono text-slate-500 font-medium">
                      ppb
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono ml-auto">
                      {(currentPpb / 1000).toFixed(4)} mg/L
                    </span>
                  </div>
                </div>

                {/* Relative Benchmark Bar */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono-numbers">
                    <span>{pctOfMcl}% of EPA Limit</span>
                    <span>EPA Action: {mcl} ppb</span>
                  </div>

                  <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${barWidth}%` }}
                    />
                    {/* Legal MCL reference line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-800 z-10"
                      style={{ left: `${mclMarkerPos}%` }}
                      title={`EPA Action Level: ${mcl} ppb`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>0 ppb</span>
                    <span className="font-medium text-slate-600">Threshold: {mcl} ppb</span>
                    <span>{(mcl * 1.5).toFixed(0)} ppb+</span>
                  </div>
                </div>
              </div>

              {/* Toxicology & Expandable Details */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setExpandedAnalyte(isExpanded ? null : id)}
                  className="w-full flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 font-medium py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Toxicology & Standards</span>
                  </span>
                  <span className="text-cyan-700 font-mono">{isExpanded ? '− Close' : '+ Science'}</span>
                </button>

                {isExpanded && (
                  <div className="mt-2 text-xs text-slate-600 space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div>
                      <span className="font-semibold text-slate-900 block">Primary Health Effects:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600 mt-1">
                        {data.healthRisks.slice(0, 2).map((risk, idx) => (
                          <li key={idx}>{risk}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-[11px] pt-1">
                      <span className="font-semibold text-slate-900">Stripping Peak: </span>
                      <span className="font-mono">{data.peakPotentialV > 0 ? `+${data.peakPotentialV}V` : `${data.peakPotentialV}V`} vs Ag/AgCl</span>
                    </div>

                    <div className="text-[11px]">
                      <span className="font-semibold text-slate-900">WHO Standard: </span>
                      <span className="font-mono">{data.whoGuidelinePpb} ppb</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
