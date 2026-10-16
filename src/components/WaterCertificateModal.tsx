import React from 'react';
import { WaterSample } from '../types/water';
import { Printer, X, ShieldCheck, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { ANALYTES_INFO } from '../data/standards';

interface WaterCertificateModalProps {
  sample: WaterSample | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WaterCertificateModal: React.FC<WaterCertificateModalProps> = ({ sample, isOpen, onClose }) => {
  if (!isOpen || !sample) return null;

  const handlePrint = () => {
    window.print();
  };

  const isSafe = sample.safetyLevel === 'safe';
  const isCaution = sample.safetyLevel === 'caution';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl my-8 overflow-hidden">
        {/* Modal Action Bar (Hidden in Print) */}
        <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-cyan-400">
            OFFICIAL DIGITAL WATER QUALITY REPORT
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Content */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-900">
          {/* Certificate Header Lockup */}
          <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-slate-500 font-bold">
                ELECTROCHEMICAL WATER MONITORING SYSTEM
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 mt-1">
                WATER SAFETY & HEAVY METAL CERTIFICATE
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Voltammetric Anodic Stripping Quantification for Lead, Arsenic & Mercury
              </p>
            </div>

            <div className="sm:text-right text-xs font-mono text-slate-600 shrink-0 space-y-0.5">
              <div>REPORT #: <strong className="text-slate-900">{sample.id.toUpperCase()}</strong></div>
              <div>DATE: {new Date(sample.timestamp).toLocaleDateString()}</div>
              <div>TIME: {new Date(sample.timestamp).toLocaleTimeString()}</div>
            </div>
          </div>

          {/* Sample & Instrument Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block">Sample Identifier:</span>
              <span className="font-bold text-slate-900">{sample.sourceName}</span>
              <span className="text-slate-500 block mt-1.5">Testing Location:</span>
              <span className="font-medium text-slate-800">{sample.locationName}</span>
            </div>

            <div>
              <span className="text-slate-500 block">Testing Instrument:</span>
              <span className="font-medium text-slate-900">AquaSense Pro (SN: {sample.penSerial})</span>
              <span className="text-slate-500 block mt-1.5">Calibration Status:</span>
              <span className="font-medium text-emerald-800">Verified ({sample.calibrationDate})</span>
            </div>
          </div>

          {/* Primary Heavy Metal Findings Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Quantitative Heavy Metal Findings
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Units: Parts Per Billion (µg/L)</span>
            </div>

            <table className="w-full text-left text-xs border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Analyte</th>
                  <th className="py-2.5 px-3 text-right">Detected</th>
                  <th className="py-2.5 px-3 text-right">EPA Action Level</th>
                  <th className="py-2.5 px-3 text-right">WHO Guideline</th>
                  <th className="py-2.5 px-3 text-center">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono-numbers">
                <tr>
                  <td className="py-2.5 px-3 font-semibold font-sans">
                    Lead (Pb²⁺)
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {sample.leadPpb.toFixed(1)} ppb
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600">
                    {ANALYTES_INFO.lead.epaMclPpb} ppb
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600">
                    {ANALYTES_INFO.lead.whoGuidelinePpb} ppb
                  </td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <span className={`text-[11px] font-bold ${sample.leadPpb >= 15 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {sample.leadPpb >= 15 ? 'EXCEEDED' : 'PASS'}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold font-sans">
                    Arsenic (As³⁺/⁵⁺)
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {sample.arsenicPpb.toFixed(1)} ppb
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600">
                    {ANALYTES_INFO.arsenic.epaMclPpb} ppb
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600">
                    {ANALYTES_INFO.arsenic.whoGuidelinePpb} ppb
                  </td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <span className={`text-[11px] font-bold ${sample.arsenicPpb >= 10 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {sample.arsenicPpb >= 10 ? 'EXCEEDED' : 'PASS'}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold font-sans">
                    Mercury (Hg²⁺)
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {sample.mercuryPpb.toFixed(2)} ppb
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600">
                    {ANALYTES_INFO.mercury.epaMclPpb} ppb
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600">
                    {ANALYTES_INFO.mercury.whoGuidelinePpb} ppb
                  </td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <span className={`text-[11px] font-bold ${sample.mercuryPpb >= 2 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {sample.mercuryPpb >= 2 ? 'EXCEEDED' : 'PASS'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Secondary Physical Matrix */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase">pH</span>
              <div className="font-bold font-mono text-slate-900">{sample.pH.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Total Dissolved Solids</span>
              <div className="font-bold font-mono text-slate-900">{sample.tdsPpm} ppm</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Temperature</span>
              <div className="font-bold font-mono text-slate-900">{sample.temperatureC.toFixed(1)}°C</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Purity Score</span>
              <div className="font-bold font-mono text-slate-900">{sample.purityScore}/100</div>
            </div>
          </div>

          {/* Official Determination Banner */}
          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
            isSafe
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : isCaution
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            <div className="font-bold text-sm mb-1">
              OFFICIAL VERDICT: {isSafe ? 'COMPLIANT WITH DRINKING WATER STANDARDS' : isCaution ? 'CAUTION: ELEVATED RISK THRESHOLD' : 'NON-COMPLIANT: CONTAMINATED WATER SOURCE'}
            </div>
            <p>
              {isSafe
                ? 'All evaluated heavy metal concentrations conform to the Safe Drinking Water Act (SDWA) standards and WHO drinking water quality guidance.'
                : 'Sample fails regulatory safety thresholds. Water should NOT be ingested directly without NSF 53/58 certified heavy metal filtration.'}
            </p>
          </div>

          {/* Signoff / Verification footer */}
          <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-xs text-slate-500">
            <div>
              <div>Digital Certificate Verified by AquaSense IoT Sensor Cloud</div>
              <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                SHA-256 HASH: 8f2a93c71e04b8d9633e147091af
              </div>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-base text-slate-800 border-b border-slate-400 pb-1 px-4">
                AquaSense Automated QA
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Electrochemical Assurance Officer</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
