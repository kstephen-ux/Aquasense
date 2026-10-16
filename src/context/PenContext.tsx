import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WaterSample, PenDeviceState } from '../types/water';
import { PRESET_WATER_SAMPLES, INITIAL_TEST_HISTORY } from '../data/standards';
import { evaluateWaterSafety, generateVoltammetryCurve } from '../utils/safetyEvaluator';

interface PenContextType {
  penState: PenDeviceState;
  currentSample: WaterSample;
  history: WaterSample[];
  selectedPresetIdx: number;
  connectBluetooth: (realBle?: boolean) => Promise<boolean>;
  disconnectBluetooth: () => void;
  selectPreset: (index: number) => void;
  dipProbe: () => void;
  liftProbe: () => void;
  startElectrochemicalScan: () => void;
  updateParameter: (key: 'leadPpb' | 'arsenicPpb' | 'mercuryPpb' | 'pH' | 'tdsPpm' | 'temperatureC', val: number) => void;
  saveCurrentToHistory: (name?: string, location?: string, notes?: string) => void;
  deleteSampleFromHistory: (id: string) => void;
  clearHistory: () => void;
  loadSampleToInspect: (sample: WaterSample) => void;
  calibratePen: () => Promise<void>;
  isCalibrating: boolean;
  calibrationStep: number;
}

const PenContext = createContext<PenContextType | undefined>(undefined);

function buildSampleFromRaw(
  leadPpb: number,
  arsenicPpb: number,
  mercuryPpb: number,
  pH: number,
  tdsPpm: number,
  temperatureC: number,
  sourceName: string,
  locationName: string,
  sourceType: WaterSample['sourceType'],
  notes: string = ''
): WaterSample {
  const evalResult = evaluateWaterSafety(leadPpb, arsenicPpb, mercuryPpb, pH, tdsPpm);

  return {
    id: `sample-${Date.now()}`,
    timestamp: new Date().toISOString(),
    sourceName,
    sourceType,
    locationName,
    latitude: 37.7749 + (Math.random() - 0.5) * 0.05,
    longitude: -122.4194 + (Math.random() - 0.5) * 0.05,
    notes,
    leadPpb,
    arsenicPpb,
    mercuryPpb,
    pH,
    tdsPpm,
    temperatureC,
    orpMv: Math.round(350 + (pH < 7 ? 40 : -30) - (leadPpb * 1.5)),
    safetyLevel: evalResult.safetyLevel,
    purityScore: evalResult.purityScore,
    exceedances: evalResult.exceedances,
    penSerial: 'AS3-9481-B2',
    calibrationDate: '2026-10-01'
  };
}

export const PenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number>(0);
  const [history, setHistory] = useState<WaterSample[]>(() => {
    const saved = localStorage.getItem('aquasense_history') || localStorage.getItem('hydrosense_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
    return INITIAL_TEST_HISTORY;
  });

  const [currentSample, setCurrentSample] = useState<WaterSample>(() => {
    const preset = PRESET_WATER_SAMPLES[0];
    return buildSampleFromRaw(
      preset.leadPpb,
      preset.arsenicPpb,
      preset.mercuryPpb,
      preset.pH,
      preset.tdsPpm,
      preset.temperatureC,
      preset.sourceName,
      preset.locationName,
      preset.sourceType,
      preset.notes
    );
  });

  const [penState, setPenState] = useState<PenDeviceState>({
    connected: true,
    isConnecting: false,
    deviceName: 'AquaSense Pro Pen (AP-3000)',
    serialNumber: 'AS3-9481-B2',
    batteryPct: 88,
    electrodeHealthPct: 94,
    probeState: 'submerged',
    isScanning: false,
    scanProgress: 100,
    lastCalibrationDate: '2026-10-01',
    firmwareVersion: 'v2.4.1',
    rssiDbm: -58,
    voltammetryStream: generateVoltammetryCurve(1.8, 1.2, 0.08)
  });

  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState(0);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aquasense_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [history]);

  const selectPreset = useCallback((index: number) => {
    if (index < 0 || index >= PRESET_WATER_SAMPLES.length) return;
    setSelectedPresetIdx(index);
    const p = PRESET_WATER_SAMPLES[index];
    const newSample = buildSampleFromRaw(
      p.leadPpb,
      p.arsenicPpb,
      p.mercuryPpb,
      p.pH,
      p.tdsPpm,
      p.temperatureC,
      p.sourceName,
      p.locationName,
      p.sourceType,
      p.notes
    );
    setCurrentSample(newSample);
    setPenState(prev => ({
      ...prev,
      probeState: 'submerged',
      voltammetryStream: generateVoltammetryCurve(p.leadPpb, p.arsenicPpb, p.mercuryPpb)
    }));
  }, []);

  const connectBluetooth = useCallback(async (realBle = false): Promise<boolean> => {
    setPenState(prev => ({ ...prev, isConnecting: true }));

    if (realBle && typeof navigator !== 'undefined' && 'bluetooth' in navigator) {
      try {
        const navBle = (navigator as unknown as { bluetooth: { requestDevice: (opts: unknown) => Promise<{ name?: string }> } }).bluetooth;
        const device = await navBle.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['battery_service', 'environmental_sensing']
        });
        setPenState(prev => ({
          ...prev,
          connected: true,
          isConnecting: false,
          deviceName: device.name || 'AquaSense Pen (BLE)',
          rssiDbm: -62
        }));
        return true;
      } catch (err) {
        console.warn('Bluetooth pairing request dismissed or unavailable, activating smart pen hardware simulator:', err);
        // Fall back gracefully to simulator
      }
    }

    // High fidelity connection simulation
    await new Promise(r => setTimeout(r, 600));
    setPenState(prev => ({
      ...prev,
      connected: true,
      isConnecting: false,
      rssiDbm: -56
    }));
    return true;
  }, []);

  const disconnectBluetooth = useCallback(() => {
    setPenState(prev => ({
      ...prev,
      connected: false,
      probeState: 'dry',
      isScanning: false
    }));
  }, []);

  const dipProbe = useCallback(() => {
    setPenState(prev => ({ ...prev, probeState: 'submerged' }));
  }, []);

  const liftProbe = useCallback(() => {
    setPenState(prev => ({ ...prev, probeState: 'dry' }));
  }, []);

  const startElectrochemicalScan = useCallback(() => {
    if (penState.isScanning) return;

    setPenState(prev => ({
      ...prev,
      isScanning: true,
      scanProgress: 0,
      probeState: 'submerged'
    }));

    const duration = 2800; // 2.8 seconds scan for snappy responsive UX
    const intervalMs = 70;
    const steps = duration / intervalMs;
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount++;
      const progress = Math.min(100, Math.round((stepCount / steps) * 100));

      setPenState(prev => ({
        ...prev,
        scanProgress: progress
      }));

      if (stepCount >= steps) {
        clearInterval(interval);
        // Generate final scan curves
        const finalCurves = generateVoltammetryCurve(
          currentSample.leadPpb,
          currentSample.arsenicPpb,
          currentSample.mercuryPpb
        );

        setPenState(prev => ({
          ...prev,
          isScanning: false,
          scanProgress: 100,
          voltammetryStream: finalCurves
        }));
      }
    }, intervalMs);
  }, [penState.isScanning, currentSample]);

  const updateParameter = useCallback((
    key: 'leadPpb' | 'arsenicPpb' | 'mercuryPpb' | 'pH' | 'tdsPpm' | 'temperatureC',
    val: number
  ) => {
    setCurrentSample(prev => {
      const updated = {
        ...prev,
        [key]: val,
        sourceType: 'custom' as const,
        sourceName: prev.sourceType === 'custom' ? prev.sourceName : 'Custom Laboratory Sample'
      };
      const evaluation = evaluateWaterSafety(
        updated.leadPpb,
        updated.arsenicPpb,
        updated.mercuryPpb,
        updated.pH,
        updated.tdsPpm
      );

      return {
        ...updated,
        safetyLevel: evaluation.safetyLevel,
        purityScore: evaluation.purityScore,
        exceedances: evaluation.exceedances,
        orpMv: Math.round(350 + (updated.pH < 7 ? 40 : -30) - (updated.leadPpb * 1.5))
      };
    });

    // Update curve
    setPenState(prev => ({
      ...prev,
      voltammetryStream: generateVoltammetryCurve(
        key === 'leadPpb' ? val : currentSample.leadPpb,
        key === 'arsenicPpb' ? val : currentSample.arsenicPpb,
        key === 'mercuryPpb' ? val : currentSample.mercuryPpb
      )
    }));
  }, [currentSample]);

  const saveCurrentToHistory = useCallback((name?: string, location?: string, notes?: string) => {
    const newEntry: WaterSample = {
      ...currentSample,
      id: `sample-${Date.now()}`,
      timestamp: new Date().toISOString(),
      sourceName: name?.trim() || currentSample.sourceName,
      locationName: location?.trim() || currentSample.locationName,
      notes: notes !== undefined ? notes : currentSample.notes
    };
    setHistory(prev => [newEntry, ...prev]);
  }, [currentSample]);

  const deleteSampleFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(s => s.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const loadSampleToInspect = useCallback((sample: WaterSample) => {
    setCurrentSample(sample);
    setPenState(prev => ({
      ...prev,
      voltammetryStream: generateVoltammetryCurve(sample.leadPpb, sample.arsenicPpb, sample.mercuryPpb)
    }));
  }, []);

  const calibratePen = useCallback(async () => {
    setIsCalibrating(true);
    setCalibrationStep(1);

    // Step 1: Blank DI water
    await new Promise(r => setTimeout(r, 1400));
    setCalibrationStep(2);

    // Step 2: 10 ppb NIST reference solution
    await new Promise(r => setTimeout(r, 1600));
    setCalibrationStep(3);

    // Step 3: Verification & baseline store
    await new Promise(r => setTimeout(r, 900));

    const todayStr = new Date().toISOString().split('T')[0];
    setPenState(prev => ({
      ...prev,
      electrodeHealthPct: 99,
      lastCalibrationDate: todayStr
    }));

    setIsCalibrating(false);
    setCalibrationStep(0);
  }, []);

  return (
    <PenContext.Provider
      value={{
        penState,
        currentSample,
        history,
        selectedPresetIdx,
        connectBluetooth,
        disconnectBluetooth,
        selectPreset,
        dipProbe,
        liftProbe,
        startElectrochemicalScan,
        updateParameter,
        saveCurrentToHistory,
        deleteSampleFromHistory,
        clearHistory,
        loadSampleToInspect,
        calibratePen,
        isCalibrating,
        calibrationStep
      }}
    >
      {children}
    </PenContext.Provider>
  );
};

export const usePen = () => {
  const ctx = useContext(PenContext);
  if (!ctx) throw new Error('usePen must be used within PenProvider');
  return ctx;
};
