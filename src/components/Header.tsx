import React from 'react';
import { Bluetooth, Battery, ShieldCheck } from 'lucide-react';
import { usePen } from '../context/PenContext';

interface HeaderProps {
  activeTab: 'dashboard' | 'probe' | 'remediation' | 'history' | 'calibration';
  setActiveTab: (tab: 'dashboard' | 'probe' | 'remediation' | 'history' | 'calibration') => void;
  openHardwareModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, openHardwareModal }) => {
  const { penState } = usePen();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-cyan-700 transition-colors text-left"
        >
          AquaSense
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'dashboard'
                ? 'text-cyan-700 font-semibold border-b-2 border-cyan-600'
                : 'hover:text-slate-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('probe')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'probe'
                ? 'text-cyan-700 font-semibold border-b-2 border-cyan-600'
                : 'hover:text-slate-900'
            }`}
          >
            Live Probe
          </button>
          <button
            onClick={() => setActiveTab('remediation')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'remediation'
                ? 'text-cyan-700 font-semibold border-b-2 border-cyan-600'
                : 'hover:text-slate-900'
            }`}
          >
            Remediation
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'history'
                ? 'text-cyan-700 font-semibold border-b-2 border-cyan-600'
                : 'hover:text-slate-900'
            }`}
          >
            Sample Log
          </button>
          <button
            onClick={() => setActiveTab('calibration')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'calibration'
                ? 'text-cyan-700 font-semibold border-b-2 border-cyan-600'
                : 'hover:text-slate-900'
            }`}
          >
            Calibration
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={openHardwareModal}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              penState.connected
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            <Bluetooth className="w-3.5 h-3.5" />
            <span>{penState.connected ? 'Pen Synced' : 'Connect Pen'}</span>
            {penState.connected && (
              <span className="text-slate-300 ml-1 font-mono-numbers">
                {penState.batteryPct}%
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
