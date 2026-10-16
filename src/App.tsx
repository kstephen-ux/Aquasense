import React, { useState } from 'react';
import { PenProvider, usePen } from './context/PenContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SafetyOverviewCard } from './components/SafetyOverviewCard';
import { AnalyteDetailCards } from './components/AnalyteDetailCards';
import { SecondaryParameters } from './components/SecondaryParameters';
import { LiveProbeView } from './components/LiveProbeView';
import { RemediationGuide } from './components/RemediationGuide';
import { HistoryAndMap } from './components/HistoryAndMap';
import { HardwarePenModal } from './components/HardwarePenModal';
import { CalibrationModal } from './components/CalibrationModal';
import { WaterCertificateModal } from './components/WaterCertificateModal';
import { SaveSampleModal } from './components/SaveSampleModal';
import { WaterSample } from './types/water';
import { Waves, Sparkles, Shield, ArrowRight, Radio } from 'lucide-react';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'probe' | 'remediation' | 'history' | 'calibration'>('dashboard');
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);
  const [isCalibrationModalOpen, setIsCalibrationModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [certificateSample, setCertificateSample] = useState<WaterSample | null>(null);

  const { currentSample, penState, loadSampleToInspect } = usePen();

  const handleOpenCertificate = (sampleToCertify?: WaterSample) => {
    setCertificateSample(sampleToCertify || currentSample);
  };

  const handleSelectSample = (sample: WaterSample) => {
    loadSampleToInspect(sample);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-12">
      {/* Top Bar Contract (3 zones, single line, no pills) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openHardwareModal={() => setIsHardwareModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Sub-header Context / View Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Smart IoT Water Safety Analysis</span>
              <span aria-hidden="true">·</span>
              <span>Electrochemical ASV Pen</span>
              <span aria-hidden="true">·</span>
              <span>EPA / WHO Drinking Benchmarks</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
              {activeTab === 'dashboard' && 'Real-Time Water Safety Console'}
              {activeTab === 'probe' && 'Physical Pen Probe & Voltammetry Scan'}
              {activeTab === 'remediation' && 'Remediation & Filtration Advisory'}
              {activeTab === 'history' && 'Water Test Registry & Map'}
              {activeTab === 'calibration' && 'Sensor Calibration & Diagnostics'}
            </h1>
          </div>

          {/* Quick tab jump buttons for desktop */}
          <div className="flex items-center gap-2">
            {activeTab !== 'probe' && (
              <button
                onClick={() => setActiveTab('probe')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-800 bg-cyan-100/70 hover:bg-cyan-200/70 rounded-lg transition-colors whitespace-nowrap"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Open Pen Probe</span>
              </button>
            )}
            {activeTab !== 'dashboard' && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
              >
                <span>Back to Safety Dashboard</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Safety Overview Banner */}
            <SafetyOverviewCard
              onOpenCertificate={() => handleOpenCertificate()}
              onOpenLogModal={() => setIsSaveModalOpen(true)}
            />

            {/* Triple Heavy Metal Analyte Cards (Lead Pb, Arsenic As, Mercury Hg) */}
            <AnalyteDetailCards />

            {/* Secondary Parameters (pH, TDS, Temperature, ORP) */}
            <SecondaryParameters />

            {/* Hero Split Card: How the Testing Pen Works & Lifestyle Showcase */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-cyan-800">
                      Smart Hardware Integration
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                      Lab-Grade Heavy Metal Detection in Under 5 Seconds
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Traditional municipal water lab tests take 7 to 14 days and cost hundreds of dollars. The AquaSense testing pen employs micro-fabricated anodic stripping voltammetry (ASV) on a disposable nano-electrode array, quantifying dissolved Lead (Pb²⁺), Arsenic (As³⁺/⁵⁺), and Mercury (Hg²⁺) down to sub-part-per-billion precision right at your faucet.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setActiveTab('probe')}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <span>Launch Live Probe Simulator</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveTab('remediation')}
                      className="text-xs font-medium text-cyan-700 hover:text-cyan-900 transition-colors"
                    >
                      View Certified Remediation Options →
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 relative min-h-[220px] bg-slate-100">
                  <img
                    src="/src/assets/images/water_sampling_action_1792121835637.jpg"
                    alt="Water Testing Pen being dipped into kitchen glass"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-medium drop-shadow">
                      Field Sampling: Direct Kitchen Tap Inspection
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Probe View */}
        {activeTab === 'probe' && <LiveProbeView />}

        {/* Tab 3: Remediation & Filters */}
        {activeTab === 'remediation' && <RemediationGuide />}

        {/* Tab 4: History & Geographic Map */}
        {activeTab === 'history' && (
          <HistoryAndMap
            onSelectSample={handleSelectSample}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {/* Tab 5: Calibration & Maintenance */}
        {activeTab === 'calibration' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Pen Sensor Probe Diagnostics & Electrode Maintenance
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calibration maintains voltammetric peak linearity and eliminates baseline drift
                  </p>
                </div>
                <button
                  onClick={() => setIsCalibrationModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-cyan-700 hover:bg-cyan-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                >
                  Start Calibration Wizard
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">Electrode Array Status</span>
                  <div className="text-2xl font-bold font-mono-numbers text-emerald-700">
                    {penState.electrodeHealthPct}%
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Bismuth-film micro-electrode surface integrity is nominal. Recommended replacement after 500 scans.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">Calibration Shelf Life</span>
                  <div className="text-2xl font-bold font-mono text-slate-900">
                    27 Days
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Calibrated on {penState.lastCalibrationDate}. Standard routine recommended every 30 days.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">Automatic Temperature Compensation</span>
                  <div className="text-2xl font-bold font-mono text-cyan-700">
                    Active
                  </div>
                  <p className="text-[11px] text-slate-500">
                    NTC thermistor actively corrects Nernstian slope across 5°C to 45°C water samples.
                  </p>
                </div>
              </div>

              {/* Maintenance recommendations */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">
                  Best Practices for Sensor Longevity
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="font-semibold text-slate-800 block">1. Storage Solution</span>
                    Store the electrode with the protective cap filled with 3M KCl electrolyte solution to prevent reference frit dehydration.
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="font-semibold text-slate-800 block">2. Post-Test Rinse</span>
                    Always rinse the probe tip with distilled or deionized water after testing high-turbidity or industrial water.
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="font-semibold text-slate-800 block">3. Never Abrade</span>
                    Do not wipe the micro-gold sensing pads with abrasive cloths or solvents. Air dry or blot with lint-free lab tissue.
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="font-semibold text-slate-800 block">4. Temperature Limits</span>
                    Do not submerge the pen in boiling water or liquids above 50°C (122°F) to protect the internal epoxy seal.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Tab Bar (thumb-zone ergonomics, touch-target >= 44px) */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals & Dialogs */}
      <HardwarePenModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
      />

      <CalibrationModal
        isOpen={isCalibrationModalOpen}
        onClose={() => setIsCalibrationModalOpen(false)}
      />

      <WaterCertificateModal
        sample={certificateSample}
        isOpen={Boolean(certificateSample)}
        onClose={() => setCertificateSample(null)}
      />

      <SaveSampleModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PenProvider>
      <DashboardContent />
    </PenProvider>
  );
}
