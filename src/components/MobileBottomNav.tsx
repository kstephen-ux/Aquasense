import React from 'react';
import { Activity, Radio, ShieldAlert, FileText, SlidersHorizontal } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'dashboard' | 'probe' | 'remediation' | 'history' | 'calibration';
  setActiveTab: (tab: 'dashboard' | 'probe' | 'remediation' | 'history' | 'calibration') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Safety', icon: Activity },
    { id: 'probe', label: 'Pen Probe', icon: Radio },
    { id: 'remediation', label: 'Filters', icon: ShieldAlert },
    { id: 'history', label: 'Log & Map', icon: FileText },
    { id: 'calibration', label: 'Calibrate', icon: SlidersHorizontal }
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
                isActive ? 'text-cyan-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
