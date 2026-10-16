import React, { useState } from 'react';
import { usePen } from '../context/PenContext';
import { FILTER_TECHNOLOGIES } from '../data/standards';
import { ShieldAlert, AlertTriangle, CheckCircle, Flame, Filter, HelpCircle, Droplet } from 'lucide-react';

export const RemediationGuide: React.FC = () => {
  const { currentSample } = usePen();
  const [filterTypeFilter, setFilterTypeFilter] = useState<'all' | 'recommended'>('all');

  const leadHigh = currentSample.leadPpb >= 10;
  const arsenicHigh = currentSample.arsenicPpb >= 8;
  const mercuryHigh = currentSample.mercuryPpb >= 1.5;

  const getRecommendedFilterTypes = () => {
    if (arsenicHigh && (leadHigh || mercuryHigh)) {
      return ['Reverse Osmosis (RO) with Thin-Film Composite (TFC)', 'Steam Distillation with Post-Carbon Filter'];
    }
    if (arsenicHigh) {
      return ['Activated Alumina / Granular Ferric Oxide Adsorbent', 'Reverse Osmosis (RO) with Thin-Film Composite (TFC)'];
    }
    if (leadHigh || mercuryHigh) {
      return ['Sub-Micron Solid Carbon Block with Ion Exchange Media', 'Reverse Osmosis (RO) with Thin-Film Composite (TFC)'];
    }
    return ['Sub-Micron Solid Carbon Block with Ion Exchange Media'];
  };

  const recommendedList = getRecommendedFilterTypes();

  return (
    <div className="space-y-6">
      {/* Critical Public Health Alert: The Boiling Myth */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 text-amber-950 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-800 shrink-0 mt-0.5">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-amber-900 tracking-tight">
              Critical Toxicology Notice: Boiling Does NOT Remove Heavy Metals
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              While boiling water effectively eliminates microbial pathogens (bacteria, viruses, and giardia), <strong>boiling actually concentrates heavy metals like Lead, Arsenic, and Mercury</strong> as pure water evaporates off while non-volatile metals remain in the pot. Never boil water in an attempt to purify heavy metal contamination.
            </p>
          </div>
        </div>
      </div>

      {/* Immediate Tactical Steps Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
          Immediate Household Action Protocol
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Actions recommended by the EPA and CDC for heavy metal mitigation
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
              <Droplet className="w-4 h-4 text-cyan-600" />
              <span>1. Run Cold Water Flush</span>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Before drinking or cooking, flush the tap with cold water for 1 to 2 minutes until water feels distinctly colder. This flushes water that sat stagnant in indoor lead or brass pipes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>2. Never Use Hot Tap Water</span>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Never use water from the hot water tap for drinking, cooking, or preparing baby formula. Hot water dissolves lead and heavy metals significantly faster from internal plumbing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>3. Install Certified Filtration</span>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Verify NSF/ANSI Standard 53 (Health Effects) or Standard 58 (Reverse Osmosis) certification on filter packaging. Generic standard sediment or pitcher filters do not remove dissolved lead or arsenic.
            </p>
          </div>
        </div>
      </div>

      {/* Certified Filtration Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Certified Filtration Technology Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated against current sample profile: Pb {currentSample.leadPpb} ppb · As {currentSample.arsenicPpb} ppb · Hg {currentSample.mercuryPpb} ppb
            </p>
          </div>

          {/* Segmented control buttons */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setFilterTypeFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterTypeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Systems
            </button>
            <button
              onClick={() => setFilterTypeFilter('recommended')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterTypeFilter === 'recommended'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recommended for Sample
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FILTER_TECHNOLOGIES.filter((f) =>
            filterTypeFilter === 'all' ? true : recommendedList.includes(f.type)
          ).map((tech, idx) => {
            const isMatch = recommendedList.includes(tech.type);
            return (
              <div
                key={idx}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  isMatch
                    ? 'border-cyan-600 bg-cyan-50/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">
                        {tech.type}
                      </h4>
                      <span className="text-xs font-mono text-cyan-800 font-medium">
                        {tech.nsfCertification}
                      </span>
                    </div>

                    {isMatch && (
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 shrink-0">
                        Top Match
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {tech.summary}
                  </p>

                  {/* Heavy Metal Reductions table */}
                  <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">Lead (Pb)</span>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">{tech.effectiveness.lead}</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">Arsenic (As)</span>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">{tech.effectiveness.arsenic}</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">Mercury (Hg)</span>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">{tech.effectiveness.mercury}</div>
                    </div>
                  </div>

                  {/* Pros & Considerations */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">Advantages:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600 mt-0.5">
                        {tech.pros.map((p, pIdx) => (
                          <li key={pIdx}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-800">Considerations:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600 mt-0.5">
                        {tech.considerations.map((c, cIdx) => (
                          <li key={cIdx}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
