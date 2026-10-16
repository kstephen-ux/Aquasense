import { HeavyMetalAnalyte, WaterSample, FilterRecommendation } from '../types/water';

export const ANALYTES_INFO: Record<'lead' | 'arsenic' | 'mercury', HeavyMetalAnalyte> = {
  lead: {
    id: 'lead',
    symbol: 'Pb',
    name: 'Lead',
    atomicNumber: 82,
    valency: 'Pb²⁺',
    epaMclPpb: 15.0, // EPA Action Level: 15 ppb (0.015 mg/L)
    epaMclgPpb: 0.0,  // Zero safe threshold for children
    whoGuidelinePpb: 10.0,
    detectionLimitMinPpb: 0.1,
    detectionLimitMaxPpb: 250.0,
    healthRisks: [
      'Irreversible neurodevelopmental delays and IQ reduction in children',
      'Cardiovascular disease and chronic adult hypertension',
      'Renal tubular impairment and progressive nephropathy',
      'Adverse reproductive outcomes and gestational complications'
    ],
    sources: [
      'Legacy lead service lines (LSLs) connecting municipal water mains',
      'Interior household lead plumbing and vintage brass fixtures (pre-1986)',
      'Lead solder used in copper pipe joints'
    ],
    peakPotentialV: -0.45 // Differential pulse voltammetry peak vs Ag/AgCl
  },
  arsenic: {
    id: 'arsenic',
    symbol: 'As',
    name: 'Arsenic',
    atomicNumber: 33,
    valency: 'As³⁺ / As⁵⁺',
    epaMclPpb: 10.0, // EPA Maximum Contaminant Level: 10 ppb (0.010 mg/L)
    epaMclgPpb: 0.0,
    whoGuidelinePpb: 10.0,
    detectionLimitMinPpb: 0.2,
    detectionLimitMaxPpb: 300.0,
    healthRisks: [
      'Class 1 Human Carcinogen: Bladder, lung, and skin carcinoma',
      'Cutaneous hyperpigmentation and palmar-plantar hyperkeratosis',
      'Peripheral neuropathy and microvascular disease (Blackfoot disease)',
      'Impaired cognitive development and diabetic complications'
    ],
    sources: [
      'Natural mineral dissolution from bedrock aquifers and deep private wells',
      'Agricultural legacy pesticide runoff (calcium/lead arsenate)',
      'Industrial smelting emissions and glass production effluent'
    ],
    peakPotentialV: 0.18 // Voltammetric stripping peak vs Ag/AgCl
  },
  mercury: {
    id: 'mercury',
    symbol: 'Hg',
    name: 'Mercury',
    atomicNumber: 80,
    valency: 'Hg²⁺ / MeHg',
    epaMclPpb: 2.0, // EPA Maximum Contaminant Level: 2 ppb (0.002 mg/L)
    epaMclgPpb: 2.0,
    whoGuidelinePpb: 6.0,
    detectionLimitMinPpb: 0.05,
    detectionLimitMaxPpb: 100.0,
    healthRisks: [
      'Severe central nervous system toxicity and sensory loss (Minamata syndrome)',
      'Cerebellar ataxia, tremors, and cognitive deterioration',
      'Acute and chronic proximal renal tubular necrosis',
      'Profound fetotoxicity causing microcephaly and cerebral palsy'
    ],
    sources: [
      'Atmospheric fallout from coal-fired power station emissions',
      'Artisanal gold mining runoff and mercury amalgam tailings',
      'Improper industrial waste disposal, electronic scrap, and dental wastes'
    ],
    peakPotentialV: 0.48 // Voltammetric stripping peak vs Ag/AgCl
  }
};

export const PRESET_WATER_SAMPLES: Omit<WaterSample, 'id' | 'timestamp' | 'penSerial' | 'calibrationDate'>[] = [
  {
    sourceName: 'Municipal Kitchen Tap (Post-Flush)',
    sourceType: 'tap',
    locationName: 'Main Residence - Kitchen Sink',
    latitude: 37.7749,
    longitude: -122.4194,
    notes: 'Sample drawn after running cold tap for 2 minutes. City utility supply treated with chloramines.',
    leadPpb: 1.8,
    arsenicPpb: 1.2,
    mercuryPpb: 0.08,
    pH: 7.35,
    tdsPpm: 138,
    temperatureC: 18.2,
    orpMv: 380,
    safetyLevel: 'safe',
    purityScore: 95,
    exceedances: []
  },
  {
    sourceName: 'Pre-1950 Residence (Lead Service Line)',
    sourceType: 'tap',
    locationName: 'Oakland Heritage Home - Bathroom Faucet',
    latitude: 37.8044,
    longitude: -122.2712,
    notes: 'First-draw morning sample after 8 hours of standing water. Severe lead leaching observed.',
    leadPpb: 28.6,
    arsenicPpb: 2.4,
    mercuryPpb: 0.14,
    pH: 6.72,
    tdsPpm: 215,
    temperatureC: 19.5,
    orpMv: 310,
    safetyLevel: 'hazardous',
    purityScore: 32,
    exceedances: ['Lead exceeds EPA Action Level (28.6 / 15.0 ppb)']
  },
  {
    sourceName: 'Private Bedrock Well (Granite Belt)',
    sourceType: 'well',
    locationName: 'Valley Vista Ranch - Well Pump #2',
    latitude: 38.5816,
    longitude: -121.4944,
    notes: 'Deep 320ft groundwater well penetrating natural arsenopyrite bedrock formation.',
    leadPpb: 3.2,
    arsenicPpb: 24.5,
    mercuryPpb: 0.22,
    pH: 7.85,
    tdsPpm: 410,
    temperatureC: 15.4,
    orpMv: 245,
    safetyLevel: 'hazardous',
    purityScore: 38,
    exceedances: ['Arsenic exceeds EPA MCL (24.5 / 10.0 ppb)']
  },
  {
    sourceName: 'Downstream Industrial Watershed',
    sourceType: 'industrial',
    locationName: 'Canal Junction River Outflow',
    latitude: 37.9577,
    longitude: -121.2908,
    notes: 'Untreated surface water down-gradient from decommissioned battery processing plant.',
    leadPpb: 19.4,
    arsenicPpb: 14.8,
    mercuryPpb: 4.6,
    pH: 5.85,
    tdsPpm: 680,
    temperatureC: 21.0,
    orpMv: 180,
    safetyLevel: 'hazardous',
    purityScore: 12,
    exceedances: [
      'Lead exceeds EPA Action Level (19.4 / 15.0 ppb)',
      'Arsenic exceeds EPA MCL (14.8 / 10.0 ppb)',
      'Mercury exceeds EPA MCL (4.6 / 2.0 ppb)'
    ]
  },
  {
    sourceName: 'Multi-Stage Reverse Osmosis System',
    sourceType: 'filtered',
    locationName: 'Home Under-Sink RO Unit (TFC Membrane)',
    latitude: 37.4419,
    longitude: -122.1430,
    notes: 'Tested from dedicated chrome dispenser tap. Remineralization cartridge active.',
    leadPpb: 0.1,
    arsenicPpb: 0.2,
    mercuryPpb: 0.02,
    pH: 7.02,
    tdsPpm: 19,
    temperatureC: 19.0,
    orpMv: 410,
    safetyLevel: 'safe',
    purityScore: 99,
    exceedances: []
  },
  {
    sourceName: 'Elementary School Hallway Fountain',
    sourceType: 'tap',
    locationName: 'Lincoln School - South Corridor Fountain',
    latitude: 37.3382,
    longitude: -121.8863,
    notes: 'Pre-weekend testing. Approaching regulatory lead threshold; maintenance notified.',
    leadPpb: 13.4,
    arsenicPpb: 1.6,
    mercuryPpb: 0.11,
    pH: 7.15,
    tdsPpm: 175,
    temperatureC: 17.8,
    orpMv: 340,
    safetyLevel: 'caution',
    purityScore: 68,
    exceedances: ['Lead is approaching EPA Action Level (13.4 / 15.0 ppb - 89% threshold)']
  }
];

export const INITIAL_TEST_HISTORY: WaterSample[] = [
  {
    id: 'sample-001',
    timestamp: '2026-10-15T18:45:00Z',
    sourceName: 'Municipal Kitchen Tap',
    sourceType: 'tap',
    locationName: 'Main Residence - Kitchen Sink',
    latitude: 37.7749,
    longitude: -122.4194,
    notes: 'Regular evening test. All three heavy metals well within safe guidelines.',
    leadPpb: 1.8,
    arsenicPpb: 1.2,
    mercuryPpb: 0.08,
    pH: 7.35,
    tdsPpm: 138,
    temperatureC: 18.2,
    orpMv: 380,
    safetyLevel: 'safe',
    purityScore: 95,
    exceedances: [],
    penSerial: 'AS3-9481-B2',
    calibrationDate: '2026-10-01'
  },
  {
    id: 'sample-002',
    timestamp: '2026-10-14T09:12:00Z',
    sourceName: 'Basement Slop Sink (Stagnant)',
    sourceType: 'tap',
    locationName: 'Basement Utility Room',
    latitude: 37.7752,
    longitude: -122.4201,
    notes: 'Infrequently used brass faucet. Elevated lead from localized fixture corrosion.',
    leadPpb: 14.2,
    arsenicPpb: 1.5,
    mercuryPpb: 0.12,
    pH: 6.95,
    tdsPpm: 192,
    temperatureC: 16.5,
    orpMv: 325,
    safetyLevel: 'caution',
    purityScore: 66,
    exceedances: ['Lead approaching EPA Action Level (14.2 / 15.0 ppb)'],
    penSerial: 'AS3-9481-B2',
    calibrationDate: '2026-10-01'
  },
  {
    id: 'sample-003',
    timestamp: '2026-10-12T14:30:00Z',
    sourceName: 'Cabin Private Well',
    sourceType: 'well',
    locationName: 'Sonoma Foothills Cabin',
    latitude: 38.2919,
    longitude: -122.4580,
    notes: 'Unfiltered well test. High arsenic detected due to local volcanic geology.',
    leadPpb: 2.4,
    arsenicPpb: 18.9,
    mercuryPpb: 0.15,
    pH: 7.82,
    tdsPpm: 340,
    temperatureC: 14.8,
    orpMv: 260,
    safetyLevel: 'hazardous',
    purityScore: 42,
    exceedances: ['Arsenic exceeds EPA MCL (18.9 / 10.0 ppb)'],
    penSerial: 'AS3-9481-B2',
    calibrationDate: '2026-10-01'
  },
  {
    id: 'sample-004',
    timestamp: '2026-10-09T11:05:00Z',
    sourceName: 'Reverse Osmosis Tap',
    sourceType: 'filtered',
    locationName: 'Kitchen Dedicated Tap',
    latitude: 37.7749,
    longitude: -122.4194,
    notes: 'Post-filtration verification. Near-complete contaminant rejection.',
    leadPpb: 0.1,
    arsenicPpb: 0.3,
    mercuryPpb: 0.01,
    pH: 7.05,
    tdsPpm: 22,
    temperatureC: 19.1,
    orpMv: 405,
    safetyLevel: 'safe',
    purityScore: 99,
    exceedances: [],
    penSerial: 'AS3-9481-B2',
    calibrationDate: '2026-10-01'
  },
  {
    id: 'sample-005',
    timestamp: '2026-10-05T16:20:00Z',
    sourceName: 'Redwood Creek Stream',
    sourceType: 'stream',
    locationName: 'Trailhead Bridge Creek',
    latitude: 37.9015,
    longitude: -122.5694,
    notes: 'Freshwater stream sampling. High purity, natural minerals.',
    leadPpb: 0.6,
    arsenicPpb: 0.8,
    mercuryPpb: 0.04,
    pH: 7.40,
    tdsPpm: 68,
    temperatureC: 12.5,
    orpMv: 390,
    safetyLevel: 'safe',
    purityScore: 97,
    exceedances: [],
    penSerial: 'AS3-9481-B2',
    calibrationDate: '2026-10-01'
  }
];

export const FILTER_TECHNOLOGIES: FilterRecommendation[] = [
  {
    type: 'Reverse Osmosis (RO) with Thin-Film Composite (TFC)',
    nsfCertification: 'NSF/ANSI Standard 58',
    effectiveness: {
      lead: '98% - 99.5% reduction',
      arsenic: '90% - 95% reduction (As-V)',
      mercury: '95% - 98% reduction'
    },
    summary: 'The gold standard for multi-heavy metal drinking water remediation at point of use.',
    isRecommended: true,
    pros: [
      'Removes all three critical toxic metals (Lead, Arsenic, Mercury)',
      'Sub-nanometer pore size rejections',
      'Removes PFAS, nitrates, and fluoride concurrently'
    ],
    considerations: [
      'Generates wastewater brine (approx 2:1 ratio)',
      'Requires water line pressure (≥ 45 psi)'
    ]
  },
  {
    type: 'Sub-Micron Solid Carbon Block with Ion Exchange Media',
    nsfCertification: 'NSF/ANSI Standard 53',
    effectiveness: {
      lead: '99% reduction',
      arsenic: 'Low (< 30% reduction)',
      mercury: '85% - 95% reduction'
    },
    summary: 'Highly targeted for lead pipes and copper plumbing without wasting water.',
    isRecommended: true,
    pros: [
      'Exceptional lead binding via zeolites/ion-exchange matrix',
      'Zero wastewater produced',
      'Retains beneficial calcium/magnesium minerals'
    ],
    considerations: [
      'Does not effectively remediate dissolved Arsenic without specialized alumina stage',
      'Cartridge requires strict 6-month replacement'
    ]
  },
  {
    type: 'Activated Alumina / Granular Ferric Oxide Adsorbent',
    nsfCertification: 'NSF/ANSI Standard 53 (Specialized)',
    effectiveness: {
      lead: 'Moderate (50% - 70%)',
      arsenic: '98% reduction (As-III and As-V)',
      mercury: 'Low (< 40%)'
    },
    summary: 'Specialized media specifically engineered for high-arsenic private well water.',
    isRecommended: false,
    pros: [
      'Specifically tailored for high-arsenic bedrock aquifers',
      'Operates across broad pH spectrum'
    ],
    considerations: [
      'Must be combined with a lead/mercury stage for comprehensive safety'
    ]
  },
  {
    type: 'Steam Distillation with Post-Carbon Filter',
    nsfCertification: 'NSF/ANSI Standard 62',
    effectiveness: {
      lead: '> 99.9% reduction',
      arsenic: '> 99.5% reduction',
      mercury: '98% reduction (with post-carbon)'
    },
    summary: 'Thermal evaporation and condensation separating pure water vapor from non-volatile metals.',
    isRecommended: true,
    pros: [
      'Zero heavy metal bypass capability',
      'Independent of municipal water pressure'
    ],
    considerations: [
      'Requires electrical energy and batch cycle time (approx 4 hours per gallon)',
      'Mercury vapor requires active carbon trap to prevent carryover'
    ]
  }
];
