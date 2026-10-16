export type SafetyLevel = 'safe' | 'caution' | 'hazardous';

export interface HeavyMetalAnalyte {
  id: 'lead' | 'arsenic' | 'mercury';
  symbol: 'Pb' | 'As' | 'Hg';
  name: string;
  atomicNumber: number;
  valency: string;
  epaMclPpb: number; // Maximum Contaminant Level (ppb / µg/L)
  epaMclgPpb: number; // Maximum Contaminant Level Goal
  whoGuidelinePpb: number;
  detectionLimitMinPpb: number;
  detectionLimitMaxPpb: number;
  healthRisks: string[];
  sources: string[];
  peakPotentialV: number; // Anodic stripping peak potential in Volts
}

export interface VoltammetryPoint {
  potentialV: number; // Potential (V vs Ag/AgCl)
  currentUa: number;   // Current in microamperes (µA)
}

export interface WaterSample {
  id: string;
  timestamp: string;
  sourceName: string;
  sourceType: 'tap' | 'well' | 'stream' | 'filtered' | 'rain' | 'industrial' | 'custom';
  locationName: string;
  latitude: number;
  longitude: number;
  notes?: string;
  // Primary analytes in ppb (µg/L)
  leadPpb: number;
  arsenicPpb: number;
  mercuryPpb: number;
  // Secondary water parameters
  pH: number;
  tdsPpm: number;
  temperatureC: number;
  orpMv: number;
  // Derived safety
  safetyLevel: SafetyLevel;
  purityScore: number; // 0 - 100
  exceedances: string[];
  // Device metadata
  penSerial: string;
  calibrationDate: string;
}

export interface PenDeviceState {
  connected: boolean;
  isConnecting: boolean;
  deviceName: string;
  serialNumber: string;
  batteryPct: number;
  electrodeHealthPct: number;
  probeState: 'dry' | 'submerged' | 'calibrating';
  isScanning: boolean;
  scanProgress: number; // 0 to 100
  lastCalibrationDate: string;
  firmwareVersion: string;
  rssiDbm: number;
  voltammetryStream: VoltammetryPoint[];
}

export interface FilterRecommendation {
  type: string;
  nsfCertification: string;
  effectiveness: {
    lead: string;
    arsenic: string;
    mercury: string;
  };
  summary: string;
  isRecommended: boolean;
  pros: string[];
  considerations: string[];
}
