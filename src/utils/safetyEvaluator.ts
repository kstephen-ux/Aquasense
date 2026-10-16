import { SafetyLevel, VoltammetryPoint } from '../types/water';
import { ANALYTES_INFO } from '../data/standards';

export interface EvaluationResult {
  safetyLevel: SafetyLevel;
  purityScore: number;
  exceedances: string[];
  summaryMessage: string;
  isPotable: boolean;
  leadRatio: number; // Ratio of current ppb to EPA MCL (1.0 = 100%)
  arsenicRatio: number;
  mercuryRatio: number;
}

export function evaluateWaterSafety(
  leadPpb: number,
  arsenicPpb: number,
  mercuryPpb: number,
  pH: number,
  tdsPpm: number
): EvaluationResult {
  const exceedances: string[] = [];

  const leadRatio = leadPpb / ANALYTES_INFO.lead.epaMclPpb;
  const arsenicRatio = arsenicPpb / ANALYTES_INFO.arsenic.epaMclPpb;
  const mercuryRatio = mercuryPpb / ANALYTES_INFO.mercury.epaMclPpb;

  if (leadPpb >= ANALYTES_INFO.lead.epaMclPpb) {
    exceedances.push(`Lead (${leadPpb.toFixed(1)} ppb) exceeds EPA Action Level (${ANALYTES_INFO.lead.epaMclPpb} ppb)`);
  } else if (leadPpb >= ANALYTES_INFO.lead.whoGuidelinePpb) {
    exceedances.push(`Lead (${leadPpb.toFixed(1)} ppb) exceeds WHO Guideline (${ANALYTES_INFO.lead.whoGuidelinePpb} ppb)`);
  } else if (leadRatio >= 0.75) {
    exceedances.push(`Lead (${leadPpb.toFixed(1)} ppb) is nearing regulatory threshold (75%+)`);
  }

  if (arsenicPpb >= ANALYTES_INFO.arsenic.epaMclPpb) {
    exceedances.push(`Arsenic (${arsenicPpb.toFixed(1)} ppb) exceeds EPA MCL (${ANALYTES_INFO.arsenic.epaMclPpb} ppb)`);
  } else if (arsenicRatio >= 0.75) {
    exceedances.push(`Arsenic (${arsenicPpb.toFixed(1)} ppb) is nearing regulatory threshold`);
  }

  if (mercuryPpb >= ANALYTES_INFO.mercury.epaMclPpb) {
    exceedances.push(`Mercury (${mercuryPpb.toFixed(2)} ppb) exceeds EPA MCL (${ANALYTES_INFO.mercury.epaMclPpb} ppb)`);
  } else if (mercuryRatio >= 0.75) {
    exceedances.push(`Mercury (${mercuryPpb.toFixed(2)} ppb) is nearing regulatory threshold`);
  }

  if (pH < 6.5) {
    exceedances.push(`Acidic water (pH ${pH.toFixed(1)}), accelerating pipe metal leaching`);
  } else if (pH > 8.5) {
    exceedances.push(`Alkaline water (pH ${pH.toFixed(1)}), potential mineral scaling`);
  }

  if (tdsPpm > 500) {
    exceedances.push(`Elevated Total Dissolved Solids (${tdsPpm} ppm exceeds EPA secondary 500 ppm standard)`);
  }

  // Safety Classification
  let safetyLevel: SafetyLevel = 'safe';
  let isPotable = true;

  if (leadRatio >= 1.0 || arsenicRatio >= 1.0 || mercuryRatio >= 1.0) {
    safetyLevel = 'hazardous';
    isPotable = false;
  } else if (leadRatio >= 0.7 || arsenicRatio >= 0.7 || mercuryRatio >= 0.7 || pH < 6.5 || pH > 8.5 || tdsPpm > 450) {
    safetyLevel = 'caution';
    isPotable = true; // Potable with caution / filtration advised
  }

  // Weighted Purity Score Calculation (0 - 100)
  // 100 is pristine; deductions scale non-linearly with toxic heavy metal concentrations
  let score = 100;
  score -= Math.min(45, leadRatio * 35);
  score -= Math.min(45, arsenicRatio * 35);
  score -= Math.min(40, mercuryRatio * 30);

  // pH penalty
  if (pH < 6.5) score -= (6.5 - pH) * 8;
  if (pH > 8.5) score -= (pH - 8.5) * 6;

  // TDS penalty
  if (tdsPpm > 300) score -= Math.min(10, ((tdsPpm - 300) / 200) * 8);

  const purityScore = Math.max(0, Math.min(100, Math.round(score)));

  let summaryMessage = 'All three monitored heavy metals (Lead, Arsenic, Mercury) are below regulatory concern thresholds.';
  if (safetyLevel === 'hazardous') {
    summaryMessage = 'Water exceeds legal health safety limits. Do NOT consume or use for infant formula without certified filtration.';
  } else if (safetyLevel === 'caution') {
    summaryMessage = 'Metal concentrations or physical parameters are elevated. Pre-filtration and cold flush recommended.';
  }

  return {
    safetyLevel,
    purityScore,
    exceedances,
    summaryMessage,
    isPotable,
    leadRatio,
    arsenicRatio,
    mercuryRatio
  };
}

/**
 * Generates an anodic stripping voltammogram (current vs potential)
 * reflecting the sample's concentrations.
 */
export function generateVoltammetryCurve(
  leadPpb: number,
  arsenicPpb: number,
  mercuryPpb: number
): VoltammetryPoint[] {
  const points: VoltammetryPoint[] = [];
  const startV = -0.70;
  const endV = 0.65;
  const stepV = 0.02;

  // Baseline capacitive background current decay
  for (let v = startV; v <= endV; v += stepV) {
    const roundedV = Math.round(v * 100) / 100;
    let baseCurrent = 0.4 + 0.15 * Math.exp(-2 * (v + 0.7)); // background decay

    // Lead anodic oxidation peak at -0.45V (width ~ 0.06V)
    const pbPeakHeight = (leadPpb / 5.0) * 2.8;
    const pbComponent = pbPeakHeight * Math.exp(-Math.pow((v - (-0.45)) / 0.05, 2));

    // Arsenic anodic stripping peak at +0.18V
    const asPeakHeight = (arsenicPpb / 4.0) * 2.4;
    const asComponent = asPeakHeight * Math.exp(-Math.pow((v - 0.18) / 0.06, 2));

    // Mercury anodic stripping peak at +0.48V
    const hgPeakHeight = (mercuryPpb / 1.0) * 2.0;
    const hgComponent = hgPeakHeight * Math.exp(-Math.pow((v - 0.48) / 0.05, 2));

    // Slight baseline noise (deterministic)
    const noise = 0.03 * Math.sin(v * 45);

    const totalCurrent = Math.max(0.1, baseCurrent + pbComponent + asComponent + hgComponent + noise);

    points.push({
      potentialV: roundedV,
      currentUa: Math.round(totalCurrent * 100) / 100
    });
  }

  return points;
}
