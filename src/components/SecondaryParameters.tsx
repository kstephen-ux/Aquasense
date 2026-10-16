import React from 'react';
import { usePen } from '../context/PenContext';
import { Gauge, Droplets, Thermometer, Zap } from 'lucide-react';

export const SecondaryParameters: React.FC = () => {
  const { currentSample } = usePen();

  const tempF = (currentSample.temperatureC * 9) / 5 + 32;
  const estimatedEcUs = Math.round(currentSample.tdsPpm * 1.56); // µS/cm conductivity estimate

  const getPhStatus = (ph: number) => {
    if (ph < 6.5) return { label: 'Acidic (Leaching Risk)', color: 'text-amber-700' };
    if (ph > 8.5) return { label: 'Alkaline (Scaling)', color: 'text-amber-700' };
    return { label: 'Neutral (Optimal 6.5–8.5)', color: 'text-emerald-700' };
  };

  const getTdsStatus = (tds: number) => {
    if (tds < 50) return { label: 'Low Mineral / RO Level', color: 'text-blue-700' };
    if (tds <= 300) return { label: 'Ideal Drinking Mineral Range', color: 'text-emerald-700' };
    if (tds <= 500) return { label: 'Moderate Dissolved Solids', color: 'text-amber-700' };
    return { label: 'High Dissolved Solids (> 500 ppm)', color: 'text-rose-700' };
  };

  const phStatus = getPhStatus(currentSample.pH);
  const tdsStatus = getTdsStatus(currentSample.tdsPpm);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Electrochemical & Physical Water Metrics
          </h3>
          <p className="text-xs text-slate-500">
            Pen sensor probe continuous secondary telemetry
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* pH */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-600" />
              <span>pH Level</span>
            </span>
            <span className="text-[11px] text-slate-400">EPA 6.5–8.5</span>
          </div>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono-numbers text-slate-900">
              {currentSample.pH.toFixed(2)}
            </span>
            <span className="text-xs uppercase font-mono text-slate-400 ml-1.5">pH</span>
          </div>
          <div className={`mt-2 text-[11px] font-medium ${phStatus.color}`}>
            {phStatus.label}
          </div>
        </div>

        {/* TDS */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-cyan-600" />
              <span>Total Dissolved Solids</span>
            </span>
            <span className="text-[11px] text-slate-400">EPA &lt; 500</span>
          </div>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono-numbers text-slate-900">
              {currentSample.tdsPpm}
            </span>
            <span className="text-xs uppercase font-mono text-slate-400 ml-1.5">ppm</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className={`font-medium ${tdsStatus.color}`}>{tdsStatus.label}</span>
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-rose-500" />
              <span>Sample Temperature</span>
            </span>
            <span className="text-[11px] text-slate-400">ATC Compensated</span>
          </div>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono-numbers text-slate-900">
              {currentSample.temperatureC.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-400 ml-1.5">°C</span>
            <span className="text-xs text-slate-500 font-mono-numbers ml-2">
              ({tempF.toFixed(1)}°F)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            NTC thermistor probe calibrated
          </div>
        </div>

        {/* ORP / Conductivity */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Redox Potential (ORP)</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">~{estimatedEcUs} µS/cm</span>
          </div>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono-numbers text-slate-900">
              {currentSample.orpMv > 0 ? `+${currentSample.orpMv}` : currentSample.orpMv}
            </span>
            <span className="text-xs uppercase font-mono text-slate-400 ml-1.5">mV</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Oxidizing potential indicator
          </div>
        </div>
      </div>
    </div>
  );
};
