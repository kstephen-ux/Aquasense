import React from 'react';
import { usePen } from '../context/PenContext';
import { SlidersHorizontal, CheckCircle2, RotateCw, AlertCircle, Droplets } from 'lucide-react';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({ isOpen, onClose }) => {
  const { penState, calibratePen, isCalibrating, calibrationStep } = usePen();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-50 rounded-xl text-cyan-700">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Electrochemical Probe Calibration
              </h3>
              <p className="text-xs text-slate-500">
                2-Point NIST-Traceable Standard Routine (Model AP-3000)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isCalibrating}
            className="text-slate-400 hover:text-slate-700 p-1 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Probe preview with generated macro image */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <img
              src="/src/assets/images/water_sensor_probe_tip_1792121835543.jpg"
              alt="Electrode sensor probe tip"
              className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="text-xs space-y-1">
              <div className="font-semibold text-slate-900">Bismuth-Gold Nanoelectrode Array</div>
              <div className="text-slate-500">Last Calibrated: <strong className="text-slate-700 font-mono">{penState.lastCalibrationDate}</strong></div>
              <div className="text-slate-500">Electrode Condition: <strong className="text-emerald-700 font-mono">{penState.electrodeHealthPct}% Healthy</strong></div>
            </div>
          </div>

          {/* Step Sequence */}
          <div className="space-y-3">
            <div className={`p-3 rounded-xl border text-xs transition-all ${
              calibrationStep === 1
                ? 'bg-cyan-50/80 border-cyan-400 font-medium'
                : calibrationStep > 1
                ? 'bg-slate-50 border-slate-200 opacity-60'
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Step 1: Zero-Point Blank Calibration</span>
                {calibrationStep > 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : calibrationStep === 1 ? (
                  <RotateCw className="w-4 h-4 text-cyan-600 animate-spin" />
                ) : null}
              </div>
              <p className="mt-1 text-slate-600">
                Rinse probe with ultra-pure deionized (DI) water (0.0 ppb) to zero background capacitive baseline.
              </p>
            </div>

            <div className={`p-3 rounded-xl border text-xs transition-all ${
              calibrationStep === 2
                ? 'bg-cyan-50/80 border-cyan-400 font-medium'
                : calibrationStep > 2
                ? 'bg-slate-50 border-slate-200 opacity-60'
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Step 2: 10.0 ppb NIST Reference Solution</span>
                {calibrationStep > 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : calibrationStep === 2 ? (
                  <RotateCw className="w-4 h-4 text-cyan-600 animate-spin" />
                ) : null}
              </div>
              <p className="mt-1 text-slate-600">
                Dip probe into standard buffer (Pb: 10.0 ppb, As: 10.0 ppb, Hg: 2.0 ppb) to lock voltammetric peak gains.
              </p>
            </div>

            <div className={`p-3 rounded-xl border text-xs transition-all ${
              calibrationStep === 3
                ? 'bg-cyan-50/80 border-cyan-400 font-medium'
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Step 3: Verification & Flash Memory Sync</span>
                {calibrationStep === 3 ? (
                  <RotateCw className="w-4 h-4 text-cyan-600 animate-spin" />
                ) : null}
              </div>
              <p className="mt-1 text-slate-600">
                Storing slope coefficients to pen onboard NVRAM and resetting 30-day calibration expiry timer.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isCalibrating}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={calibratePen}
            disabled={isCalibrating || !penState.connected}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
          >
            {isCalibrating ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Calibrating ({calibrationStep}/3)...</span>
              </>
            ) : (
              <span>Start 2-Point Calibration</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
