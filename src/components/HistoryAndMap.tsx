import React, { useState } from 'react';
import { usePen } from '../context/PenContext';
import { WaterSample } from '../types/water';
import { Download, Search, MapPin, Eye, Trash2, FileCheck, Layers } from 'lucide-react';

interface HistoryAndMapProps {
  onSelectSample: (sample: WaterSample) => void;
  onOpenCertificate: (sample: WaterSample) => void;
}

export const HistoryAndMap: React.FC<HistoryAndMapProps> = ({ onSelectSample, onOpenCertificate }) => {
  const { history, deleteSampleFromHistory, clearHistory } = usePen();
  const [searchQuery, setSearchQuery] = useState('');
  const [safetyFilter, setSafetyFilter] = useState<'all' | 'safe' | 'caution' | 'hazardous'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [selectedMapSample, setSelectedMapSample] = useState<WaterSample | null>(null);

  const filteredHistory = history.filter((sample) => {
    const matchesSearch =
      sample.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sample.notes && sample.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSafety = safetyFilter === 'all' || sample.safetyLevel === safetyFilter;

    return matchesSearch && matchesSafety;
  });

  const exportCsv = () => {
    const headers = [
      'ID',
      'Timestamp',
      'Source Name',
      'Location',
      'Safety Level',
      'Purity Score',
      'Lead (ppb)',
      'Arsenic (ppb)',
      'Mercury (ppb)',
      'pH',
      'TDS (ppm)',
      'Temp (C)',
      'Pen Serial',
      'Notes'
    ];

    const rows = history.map((s) => [
      s.id,
      s.timestamp,
      `"${s.sourceName.replace(/"/g, '""')}"`,
      `"${s.locationName.replace(/"/g, '""')}"`,
      s.safetyLevel,
      s.purityScore,
      s.leadPpb,
      s.arsenicPpb,
      s.mercuryPpb,
      s.pH,
      s.tdsPpm,
      s.temperatureC,
      s.penSerial,
      `"${(s.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aquasense_water_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Sample Quality Registry & Geographic Map
            </h3>
            <p className="text-xs text-slate-500">
              Synchronized records collected by AquaSense smart testing pens
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Log Registry
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Geographic Map
              </button>
            </div>

            <button
              onClick={exportCsv}
              disabled={history.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by source, location, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Segmented Filter */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg overflow-x-auto">
            {(['all', 'safe', 'caution', 'hazardous'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSafetyFilter(lvl)}
                className={`px-3 py-1 text-xs font-medium capitalize rounded-md transition-colors whitespace-nowrap ${
                  safetyFilter === lvl ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'all' ? 'All Samples' : lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area: Table or Map */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          {filteredHistory.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No water test records found matching your filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3 px-4">Water Sample & Location</th>
                    <th className="py-3 px-4">Safety Status</th>
                    <th className="py-3 px-4 text-right">Lead (Pb)</th>
                    <th className="py-3 px-4 text-right">Arsenic (As)</th>
                    <th className="py-3 px-4 text-right">Mercury (Hg)</th>
                    <th className="py-3 px-4 text-right">pH / TDS</th>
                    <th className="py-3 px-4 text-center">Certificate / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map((sample) => {
                    const isHazard = sample.safetyLevel === 'hazardous';
                    const isCaution = sample.safetyLevel === 'caution';

                    return (
                      <tr key={sample.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{sample.sourceName}</div>
                          <div className="text-[11px] text-slate-500">
                            {sample.locationName} · {new Date(sample.timestamp).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-medium">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isHazard ? 'bg-rose-600' : isCaution ? 'bg-amber-500' : 'bg-emerald-600'
                              }`}
                            />
                            <span
                              className={
                                isHazard ? 'text-rose-800' : isCaution ? 'text-amber-800' : 'text-emerald-800'
                              }
                            >
                              {sample.safetyLevel === 'safe'
                                ? 'Safe'
                                : sample.safetyLevel === 'caution'
                                ? 'Caution'
                                : 'Hazardous'}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono-numbers ml-1">
                              ({sample.purityScore}/100)
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono-numbers whitespace-nowrap">
                          <span className={sample.leadPpb >= 15 ? 'text-rose-700 font-bold' : 'text-slate-800'}>
                            {sample.leadPpb.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">ppb</span>
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono-numbers whitespace-nowrap">
                          <span className={sample.arsenicPpb >= 10 ? 'text-rose-700 font-bold' : 'text-slate-800'}>
                            {sample.arsenicPpb.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">ppb</span>
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono-numbers whitespace-nowrap">
                          <span className={sample.mercuryPpb >= 2 ? 'text-rose-700 font-bold' : 'text-slate-800'}>
                            {sample.mercuryPpb.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">ppb</span>
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono-numbers whitespace-nowrap text-slate-600">
                          <span>{sample.pH.toFixed(1)} pH</span>
                          <span className="mx-1 text-slate-300">/</span>
                          <span>{sample.tdsPpm} ppm</span>
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => onSelectSample(sample)}
                              title="Load sample into dashboard"
                              className="p-1.5 text-slate-600 hover:text-cyan-700 hover:bg-slate-100 rounded transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onOpenCertificate(sample)}
                              title="View & Print Inspection Certificate"
                              className="p-1.5 text-slate-600 hover:text-cyan-700 hover:bg-slate-100 rounded transition-colors"
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteSampleFromHistory(sample.id)}
                              title="Remove record"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Interactive SVG Geographic Map */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Spatial Water Quality Map (San Francisco & Bay Area Region)
              </h4>
              <p className="text-xs text-slate-500">
                Click any sampling pin to inspect electrochemical analyte levels
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Safe</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Caution</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Hazard</span>
            </div>
          </div>

          <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-[16/9] max-h-[460px] border border-slate-800">
            {/* SVG stylised map backdrop with contour lines */}
            <svg viewBox="0 0 800 450" className="w-full h-full select-none">
              <defs>
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
              </defs>

              <rect width="800" height="450" fill="#0b1120" />
              <rect width="800" height="450" fill="url(#gridPattern)" />

              {/* Water bay & coastline geometry */}
              <path
                d="M 120 0 Q 180 80 260 140 T 380 230 Q 420 280 460 380 L 510 450 L 800 450 L 800 0 Z"
                fill="#0f172a"
                stroke="#1e293b"
                strokeWidth="1.5"
              />
              <path
                d="M 280 160 Q 340 180 390 270 T 430 350"
                fill="none"
                stroke="#0284c7"
                strokeWidth="1.5"
                opacity="0.3"
              />

              {/* Geo points mapped from lat/long */}
              {history.map((s, idx) => {
                // Approximate coordinate mapping to 800x450
                const minLat = 37.3;
                const maxLat = 38.6;
                const minLng = -122.6;
                const maxLng = -121.2;

                const cx = ((s.longitude - minLng) / (maxLng - minLng)) * 700 + 50;
                const cy = 450 - ((s.latitude - minLat) / (maxLat - minLat)) * 380 - 30;

                const isSelected = selectedMapSample?.id === s.id;
                const color = s.safetyLevel === 'hazardous' ? '#f43f5e' : s.safetyLevel === 'caution' ? '#f59e0b' : '#10b981';

                return (
                  <g
                    key={s.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedMapSample(s)}
                  >
                    {/* Pulsing ring on selection */}
                    {isSelected && (
                      <circle cx={cx} cy={cy} r="14" fill="none" stroke={color} strokeWidth="2" opacity="0.8" />
                    )}
                    <circle cx={cx} cy={cy} r={isSelected ? "7" : "5"} fill={color} stroke="#ffffff" strokeWidth="1.5" />
                    <text
                      x={cx + 10}
                      y={cy + 4}
                      fill="#e2e8f0"
                      fontSize="10"
                      fontWeight="500"
                      className="pointer-events-none drop-shadow"
                    >
                      {s.sourceName}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Selected map sample floating drawer */}
            {selectedMapSample && (
              <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white p-4 rounded-xl shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-white">{selectedMapSample.sourceName}</h5>
                    <p className="text-[11px] text-slate-400">{selectedMapSample.locationName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedMapSample(null)}
                    className="text-slate-400 hover:text-white text-xs font-mono"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-mono bg-slate-800/80 p-2 rounded-lg">
                  <div>
                    <div className="text-[10px] text-slate-400">Lead</div>
                    <div className="font-bold text-cyan-400">{selectedMapSample.leadPpb} ppb</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Arsenic</div>
                    <div className="font-bold text-amber-400">{selectedMapSample.arsenicPpb} ppb</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Mercury</div>
                    <div className="font-bold text-purple-400">{selectedMapSample.mercuryPpb} ppb</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => onSelectSample(selectedMapSample)}
                    className="flex-1 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors text-center"
                  >
                    Inspect in Pen
                  </button>
                  <button
                    onClick={() => onOpenCertificate(selectedMapSample)}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                  >
                    Certificate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
