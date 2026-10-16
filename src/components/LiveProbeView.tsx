import React, { useState } from 'react';
import { usePen } from '../context/PenContext';
import { PRESET_WATER_SAMPLES } from '../data/standards';
import { Radio, RotateCw, Waves, Sliders, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const LiveProbeView: React.FC = () => {
  const {
    penState,
    currentSample,
    selectedPresetIdx,
    selectPreset,
    dipProbe,
    liftProbe,
    startElectrochemicalScan,
    updateParameter
  } = usePen();

  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [hoveredPoint, setHoveredPoint] = useState<{ v: number; i: number } | null>(null);

  // SVG Chart Dimensions
  const chartWidth = 600;
  const chartHeight = 220;
  const padding = { top: 20, right: 30, bottom: 40, left: 55 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  const points = penState.voltammetryStream;
  const minV = -0.7;
  const maxV = 0.65;
  const maxI = Math.max(8, ...points.map(p => p.currentUa)) * 1.15;
  const minI = 0;

  const getX = (v: number) => padding.left + ((v - minV) / (maxV - minV)) * plotWidth;
  const getY = (i: number) => padding.top + plotHeight - ((i - minI) / (maxI - minI)) * plotHeight;

  // Build SVG path
  const pathD = points.reduce((acc, pt, idx) => {
    const x = getX(pt.potentialV);
    const y = getY(pt.currentUa);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Fill path under the curve
  const fillD = pathD ? `${pathD} L ${getX(points[points.length - 1].potentialV)} ${getY(0)} L ${getX(points[0].potentialV)} ${getY(0)} Z` : '';

  // Specific peak markers
  const pbPeakX = getX(-0.45);
  const asPeakX = getX(0.18);
  const hgPeakX = getX(0.48);

  return (
    <div className="space-y-6">
      {/* Top Banner / Device Status Strip */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
              <span>MODEL: {penState.deviceName}</span>
              <span>·</span>
              <span>SN: {penState.serialNumber}</span>
              <span>·</span>
              <span>FW: {penState.firmwareVersion}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Electrochemical Nano-Probe Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Anodic stripping voltammetry (ASV) utilizing a micro-gold & bismuth electrode tip. Real-time current peaks reveal trace heavy metal ions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Submersion Status indicator */}
            <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono border border-slate-700 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${penState.probeState === 'submerged' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-slate-300">
                PROBE: <strong className="text-white uppercase">{penState.probeState}</strong>
              </span>
            </div>

            {/* Dip/Lift Action */}
            {penState.probeState === 'submerged' ? (
              <button
                onClick={liftProbe}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors"
              >
                Lift Probe (Air)
              </button>
            ) : (
              <button
                onClick={dipProbe}
                className="px-3.5 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 rounded-lg transition-colors"
              >
                Dip Probe into Water
              </button>
            )}

            {/* Run Scan */}
            <button
              onClick={startElectrochemicalScan}
              disabled={penState.isScanning || !penState.connected}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 ${penState.isScanning ? 'animate-spin' : ''}`} />
              <span>{penState.isScanning ? `Stripping... ${penState.scanProgress}%` : 'Execute Scan'}</span>
            </button>
          </div>
        </div>

        {/* Live scanning progress bar */}
        {penState.isScanning && (
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-1.5">
              <span>Acquiring differential pulse voltammogram</span>
              <span>{penState.scanProgress}% complete</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-75"
                style={{ width: `${penState.scanProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Live Voltammetry Curve & Hardware Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Voltammetry Spectrum Graph */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Differential Pulse Voltammogram (DPV)
                </h3>
                <p className="text-xs text-slate-500">
                  Stripping current peaks identify Pb (-0.45V), As (+0.18V), and Hg (+0.48V)
                </p>
              </div>
              <div className="text-right text-xs font-mono text-slate-500">
                <span>Ref: Ag/AgCl (3M KCl)</span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="mt-4 relative bg-slate-50 rounded-xl p-3 border border-slate-200">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-auto cursor-crosshair select-none"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const svgX = ((e.clientX - rect.left) / rect.width) * chartWidth;
                  if (svgX >= padding.left && svgX <= chartWidth - padding.right) {
                    const ratio = (svgX - padding.left) / plotWidth;
                    const v = minV + ratio * (maxV - minV);
                    const closest = points.reduce((prev, curr) =>
                      Math.abs(curr.potentialV - v) < Math.abs(prev.potentialV - v) ? curr : prev
                    );
                    setHoveredPoint({ v: closest.potentialV, i: closest.currentUa });
                  }
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Horizontal Grid lines */}
                {[0, maxI * 0.25, maxI * 0.5, maxI * 0.75, maxI].map((curr, idx) => {
                  const y = getY(curr);
                  return (
                    <g key={idx}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={chartWidth - padding.right}
                        y2={y}
                        stroke="#e2e8f0"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={padding.left - 8}
                        y={y + 3}
                        textAnchor="end"
                        fontSize="9"
                        fill="#64748b"
                        fontFamily="monospace"
                      >
                        {curr.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* Vertical potential lines */}
                {[-0.6, -0.4, -0.2, 0.0, 0.2, 0.4, 0.6].map((volt, idx) => {
                  const x = getX(volt);
                  return (
                    <g key={idx}>
                      <line
                        x1={x}
                        y1={padding.top}
                        x2={x}
                        y2={chartHeight - padding.bottom}
                        stroke="#e2e8f0"
                        strokeDasharray="2 2"
                      />
                      <text
                        x={x}
                        y={chartHeight - padding.bottom + 14}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#64748b"
                        fontFamily="monospace"
                      >
                        {volt > 0 ? `+${volt.toFixed(1)}` : volt.toFixed(1)}V
                      </text>
                    </g>
                  );
                })}

                {/* Peak Guidance Lines */}
                <g>
                  {/* Lead marker */}
                  <line
                    x1={pbPeakX}
                    y1={padding.top}
                    x2={pbPeakX}
                    y2={chartHeight - padding.bottom}
                    stroke="#3b82f6"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={pbPeakX}
                    y={padding.top + 10}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#1d4ed8"
                  >
                    Pb²⁺ (-0.45V)
                  </text>

                  {/* Arsenic marker */}
                  <line
                    x1={asPeakX}
                    y1={padding.top}
                    x2={asPeakX}
                    y2={chartHeight - padding.bottom}
                    stroke="#d97706"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={asPeakX}
                    y={padding.top + 10}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#b45309"
                  >
                    As³⁺ (+0.18V)
                  </text>

                  {/* Mercury marker */}
                  <line
                    x1={hgPeakX}
                    y1={padding.top}
                    x2={hgPeakX}
                    y2={chartHeight - padding.bottom}
                    stroke="#8b5cf6"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={hgPeakX}
                    y={padding.top + 10}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#6d28d9"
                  >
                    Hg²⁺ (+0.48V)
                  </text>
                </g>

                {/* Fill area */}
                <path d={fillD} fill="rgba(6, 182, 212, 0.12)" />

                {/* Stroke curve */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Crosshair on hover */}
                {hoveredPoint && (
                  <g>
                    <circle
                      cx={getX(hoveredPoint.v)}
                      cy={getY(hoveredPoint.i)}
                      r="4.5"
                      fill="#0f172a"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {/* Axis labels */}
                <text
                  x={chartWidth / 2}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#475569"
                >
                  Potential (V vs Ag/AgCl)
                </text>
                <text
                  transform={`rotate(-90)`}
                  x={-(chartHeight / 2)}
                  y={14}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#475569"
                >
                  Stripping Current (µA)
                </text>
              </svg>

              {/* Hover HUD readout */}
              {hoveredPoint && (
                <div className="absolute top-4 right-4 bg-slate-900/90 text-white text-[11px] font-mono px-2.5 py-1.5 rounded-lg shadow-sm">
                  <div>E: {hoveredPoint.v > 0 ? `+${hoveredPoint.v.toFixed(2)}` : hoveredPoint.v.toFixed(2)} V</div>
                  <div>i: {hoveredPoint.i.toFixed(2)} µA</div>
                </div>
              )}
            </div>
          </div>

          {/* Quick peak summary strip */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] uppercase font-mono text-slate-500">Lead Peak (Pb)</span>
              <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                {currentSample.leadPpb.toFixed(1)} <span className="text-[10px] text-slate-400">ppb</span>
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] uppercase font-mono text-slate-500">Arsenic Peak (As)</span>
              <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                {currentSample.arsenicPpb.toFixed(1)} <span className="text-[10px] text-slate-400">ppb</span>
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] uppercase font-mono text-slate-500">Mercury Peak (Hg)</span>
              <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                {currentSample.mercuryPpb.toFixed(2)} <span className="text-[10px] text-slate-400">ppb</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Pen Hardware Gallery & Sample Simulator Switcher */}
        <div className="lg:col-span-5 space-y-4">
          {/* Hardware Device Showcase card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="relative h-44 bg-slate-100 overflow-hidden">
              <img
                src="/src/assets/images/smart_water_pen_device_1792121834050.jpg"
                alt="Smart Water Testing Pen resting in test beaker"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-white text-xs">
                  <div className="font-semibold text-sm">AquaSense Pro Nano-Pen</div>
                  <div className="text-slate-300 text-[11px]">Bismuth/Au micro-electrode array · Bluetooth 5.3</div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Electrode Condition:</span>
                <span className="font-semibold text-emerald-700 font-mono">
                  {penState.electrodeHealthPct}% (Good)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Probe Temperature:</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {currentSample.temperatureC.toFixed(1)}°C / ATC Active
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Calibration Expiry:</span>
                <span className="text-slate-700 font-mono">Valid (27 days remaining)</span>
              </div>
            </div>
          </div>

          {/* Preset Samples & Custom Dial Drawer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900">
                Water Sample Selector
              </h4>

              {/* Segmented control tabs (functional buttons) */}
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setActiveTab('presets')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'presets'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Presets
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'custom'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Custom Dials
                </button>
              </div>
            </div>

            {activeTab === 'presets' ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {PRESET_WATER_SAMPLES.map((preset, idx) => {
                  const isSelected = selectedPresetIdx === idx && currentSample.sourceType !== 'custom';
                  return (
                    <button
                      key={idx}
                      onClick={() => selectPreset(idx)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex items-center justify-between ${
                        isSelected
                          ? 'border-cyan-600 bg-cyan-50/60 font-medium text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="font-semibold truncate">{preset.sourceName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Pb: {preset.leadPpb} · As: {preset.arsenicPpb} · Hg: {preset.mercuryPpb} ppb
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                          preset.safetyLevel === 'safe'
                            ? 'bg-emerald-100 text-emerald-800'
                            : preset.safetyLevel === 'caution'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {preset.safetyLevel}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {/* Custom sliders */}
                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span>Lead (Pb) Level:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {currentSample.leadPpb.toFixed(1)} ppb
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    step="0.5"
                    value={currentSample.leadPpb}
                    onChange={(e) => updateParameter('leadPpb', parseFloat(e.target.value))}
                    className="w-full accent-cyan-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>0 (Pure)</span>
                    <span className="text-slate-600 font-medium">15 (EPA Limit)</span>
                    <span>45 ppb</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span>Arsenic (As) Level:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {currentSample.arsenicPpb.toFixed(1)} ppb
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="35"
                    step="0.5"
                    value={currentSample.arsenicPpb}
                    onChange={(e) => updateParameter('arsenicPpb', parseFloat(e.target.value))}
                    className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>0 (Pure)</span>
                    <span className="text-slate-600 font-medium">10 (EPA Limit)</span>
                    <span>35 ppb</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span>Mercury (Hg) Level:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {currentSample.mercuryPpb.toFixed(2)} ppb
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="0.1"
                    value={currentSample.mercuryPpb}
                    onChange={(e) => updateParameter('mercuryPpb', parseFloat(e.target.value))}
                    className="w-full accent-purple-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>0</span>
                    <span className="text-slate-600 font-medium">2.0 (EPA Limit)</span>
                    <span>6.0 ppb</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">pH Level:</label>
                    <input
                      type="number"
                      step="0.1"
                      min="4"
                      max="10"
                      value={currentSample.pH}
                      onChange={(e) => updateParameter('pH', parseFloat(e.target.value) || 7)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">TDS (ppm):</label>
                    <input
                      type="number"
                      step="10"
                      min="0"
                      max="1200"
                      value={currentSample.tdsPpm}
                      onChange={(e) => updateParameter('tdsPpm', parseInt(e.target.value, 10) || 100)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
