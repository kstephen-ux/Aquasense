import React, { useState } from 'react';
import { usePen } from '../context/PenContext';
import { Bluetooth, Battery, Shield, Cpu, Wifi, RotateCw, CheckCircle2, X } from 'lucide-react';

interface HardwarePenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HardwarePenModal: React.FC<HardwarePenModalProps> = ({ isOpen, onClose }) => {
  const { penState, connectBluetooth, disconnectBluetooth, dipProbe, liftProbe } = usePen();
  const [connectingMsg, setConnectingMsg] = useState('');

  if (!isOpen) return null;

  const handlePair = async (realBle: boolean) => {
    setConnectingMsg(realBle ? 'Opening Web Bluetooth browser dialog...' : 'Pairing simulated AquaSense pen...');
    await connectBluetooth(realBle);
    setConnectingMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${penState.connected ? 'bg-cyan-50 text-cyan-700' : 'bg-slate-100 text-slate-500'}`}>
              <Bluetooth className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Pen Hardware Sync Dock
              </h3>
              <p className="text-xs text-slate-500">
                Bluetooth Low Energy 5.3 interface
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Device Info */}
        <div className="p-6 space-y-5">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Device Status</span>
              <span className={`font-semibold flex items-center gap-1.5 ${penState.connected ? 'text-emerald-700' : 'text-slate-500'}`}>
                <span className={`w-2 h-2 rounded-full ${penState.connected ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                {penState.connected ? 'Connected & Ready' : 'Disconnected'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Hardware Model</span>
              <span className="font-semibold text-slate-800">{penState.deviceName}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Serial Number</span>
              <span className="font-mono text-slate-700">{penState.serialNumber}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Firmware Build</span>
              <span className="font-mono text-slate-700">{penState.firmwareVersion} (Latest)</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Internal Li-Ion Battery</span>
              <span className="font-mono font-semibold text-slate-800">{penState.batteryPct}% (approx 42 hours runtime)</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">BLE Signal Strength</span>
              <span className="font-mono text-slate-700">{penState.rssiDbm} dBm (Strong)</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Electrode Tip Condition</span>
              <span className="font-mono font-semibold text-emerald-700">{penState.electrodeHealthPct}% (Optimal)</span>
            </div>
          </div>

          {/* Submersion quick toggle */}
          {penState.connected && (
            <div className="p-3 bg-cyan-50/50 rounded-xl border border-cyan-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-900 block">Physical Probe Sensor:</span>
                <span className="text-slate-600">Currently: <strong className="uppercase font-mono">{penState.probeState}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                {penState.probeState === 'submerged' ? (
                  <button
                    onClick={liftProbe}
                    className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    Lift Out (Air)
                  </button>
                ) : (
                  <button
                    onClick={dipProbe}
                    className="px-2.5 py-1 bg-cyan-700 text-white rounded hover:bg-cyan-800 font-medium"
                  >
                    Dip in Sample
                  </button>
                )}
              </div>
            </div>
          )}

          {connectingMsg && (
            <div className="text-xs text-center text-cyan-700 font-medium animate-pulse">
              {connectingMsg}
            </div>
          )}

          {/* Connection Actions */}
          <div className="space-y-2 pt-1">
            {penState.connected ? (
              <button
                onClick={disconnectBluetooth}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Disconnect Pen
              </button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handlePair(true)}
                  disabled={penState.isConnecting}
                  className="py-2.5 px-3 text-xs font-semibold text-white bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 rounded-xl transition-colors text-center"
                >
                  Pair BLE Device
                </button>
                <button
                  onClick={() => handlePair(false)}
                  disabled={penState.isConnecting}
                  className="py-2.5 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-xl transition-colors text-center"
                >
                  Sync Simulator
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            AquaSense Pen conforms to ISO/IEC 17025 electrochemical sensor communication protocol.
          </p>
        </div>
      </div>
    </div>
  );
};
