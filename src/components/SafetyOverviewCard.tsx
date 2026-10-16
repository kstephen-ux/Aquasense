import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, RotateCw, BookmarkPlus, Check, Download } from 'lucide-react';
import { usePen } from '../context/PenContext';

interface SafetyOverviewCardProps {
  onOpenCertificate: () => void;
  onOpenLogModal: () => void;
}

export const SafetyOverviewCard: React.FC<SafetyOverviewCardProps> = ({ onOpenCertificate, onOpenLogModal }) => {
  const { currentSample, penState, startElectrochemicalScan } = usePen();
  const [justScanned, setJustScanned] = useState(false);

  const handleScanClick = () => {
    startElectrochemicalScan();
    setJustScanned(true);
    setTimeout(() => setJustScanned(false), 3000);
  };

  const getStatusBadge = () => {
    switch (currentSample.safetyLevel) {
      case 'safe':
        return {
          icon: ShieldCheck,
          label: 'Potable — Safe for Direct Consumption',
          textColor: 'text-emerald-800',
          bgColor: 'bg-emerald-50/70',
          borderColor: 'border-emerald-200'
        };
      case 'caution':
        return {
          icon: AlertTriangle,
          label: 'Caution — Elevated Analyte Levels Detected',
          textColor: 'text-amber-800',
          bgColor: 'bg-amber-50/70',
          borderColor: 'border-amber-200'
        };
      case 'hazardous':
      default:
        return {
          icon: AlertOctagon,
          label: 'Hazardous — Unsafe for Drinking or Infant Preparation',
          textColor: 'text-rose-800',
          bgColor: 'bg-rose-50/70',
          borderColor: 'border-rose-200'
        };
    }
  };

  const status = getStatusBadge();
  const StatusIcon = status.icon;

  return (
    <div className={`p-6 rounded-2xl border ${status.borderColor} ${status.bgColor} transition-all`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Overall verdict */}
        <div className="space-y-3">
          {/* Metadata unboxed line */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="font-medium text-slate-900">{currentSample.sourceName}</span>
            <span aria-hidden="true">·</span>
            <span>{currentSample.locationName}</span>
            <span aria-hidden="true">·</span>
            <span>Pen #{currentSample.penSerial}</span>
            <span aria-hidden="true">·</span>
            <span>Electrode calibrated</span>
          </div>

          <div className="flex items-center gap-3">
            <StatusIcon className={`w-7 h-7 shrink-0 ${status.textColor}`} />
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${status.textColor}`}>
                {status.label}
              </h2>
            </div>
          </div>

          <p className="text-sm text-slate-700 max-w-2xl leading-relaxed">
            {currentSample.safetyLevel === 'safe'
              ? 'Real-time electrochemical voltammetry shows all 3 target toxic heavy metals (Lead Pb, Arsenic As, Mercury Hg) remain safely beneath EPA Maximum Contaminant Levels and WHO guidance benchmarks.'
              : currentSample.safetyLevel === 'caution'
              ? 'Heavy metal traces are approaching regulatory action thresholds. Water filtration is recommended prior to drinking or infant formula reconstitution.'
              : 'One or more heavy metal concentrations exceed statutory health limits. Do NOT consume. Immediate point-of-use filtration (Reverse Osmosis / NSF 53/58) required.'}
          </p>

          {currentSample.exceedances.length > 0 && (
            <div className="pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Action Alerts:
              </span>
              <ul className="mt-1 space-y-1 text-xs font-medium text-rose-900">
                {currentSample.exceedances.map((ex, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Water Purity Metric & Quick Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-200/60">
          <div className="text-left lg:text-right">
            <div className="text-xs uppercase font-medium tracking-wider text-slate-500">
              Purity Safety Index
            </div>
            <div className="flex items-baseline gap-1 lg:justify-end">
              <span className="text-4xl font-extrabold font-mono-numbers text-slate-900">
                {currentSample.purityScore}
              </span>
              <span className="text-sm font-medium text-slate-500">/ 100</span>
            </div>
            <div className="text-xs text-slate-600">
              {currentSample.purityScore >= 90 ? 'Grade A (Excellent)' : currentSample.purityScore >= 70 ? 'Grade B (Acceptable)' : 'Grade F (Fail)'}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleScanClick}
              disabled={penState.isScanning || !penState.connected}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <RotateCw className={`w-3.5 h-3.5 ${penState.isScanning ? 'animate-spin' : ''}`} />
              <span>{penState.isScanning ? 'Scanning Water...' : 'Re-Scan Probe'}</span>
            </button>

            <button
              onClick={onOpenLogModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-slate-500" />
              <span>Save Log</span>
            </button>

            <button
              onClick={onOpenCertificate}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
