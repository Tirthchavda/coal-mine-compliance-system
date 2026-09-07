import { Mine, ComplianceRecord, Inspection, Violation, CorrectiveAction, Document, SafetyRecord, EnvironmentalData, AIPrediction } from '../types';

export const MOCK_MINES: Mine[] = [
  {
    id: 'mine-jharia-01',
    name: 'Jharia Block II Colliery',
    code: 'BCCL-JH-01',
    owner: 'Bharat Coking Coal Limited (BCCL)',
    type: 'UNDERGROUND',
    state: 'Jharkhand',
    district: 'Dhanbad',
    location: 'Jharia Coalfield, Dhanbad',
    latitude: 23.7483,
    longitude: 86.4194,
    managerName: 'Suresh Chandra Verma',
    capacityMTPA: 4.5,
    operationalStatus: 'OPERATIONAL',
    complianceScore: 74,
    riskLevel: 'HIGH',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z'
  },
  {
    id: 'mine-raniganj-02',
    name: 'Raniganj Deep Shaft Colliery',
    code: 'ECL-RN-02',
    owner: 'Eastern Coalfields Limited (ECL)',
    type: 'UNDERGROUND',
    state: 'West Bengal',
    district: 'Paschim Bardhaman',
    location: 'Raniganj Coalfield, Asansol',
    latitude: 23.6215,
    longitude: 87.1265,
    managerName: 'Priyanka Sen',
    capacityMTPA: 3.2,
    operationalStatus: 'OPERATIONAL',
    complianceScore: 89,
    riskLevel: 'MEDIUM',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z'
  },
  {
    id: 'mine-korba-03',
    name: 'Gevra Mega Opencast Project',
    code: 'SECL-KR-03',
    owner: 'South Eastern Coalfields Limited (SECL)',
    type: 'OPENCAST',
    state: 'Chhattisgarh',
    district: 'Korba',
    location: 'Korba Coalfield, Gevra',
    latitude: 22.3595,
    longitude: 82.6845,
    managerName: 'Alok Ranjan Das',
    capacityMTPA: 50.0,
    operationalStatus: 'OPERATIONAL',
    complianceScore: 94,
    riskLevel: 'LOW',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z'
  },
  {
    id: 'mine-singrauli-04',
    name: 'Jayant Opencast Colliery',
    code: 'NCL-SG-04',
    owner: 'Northern Coalfields Limited (NCL)',
    type: 'OPENCAST',
    state: 'Madhya Pradesh',
    district: 'Singrauli',
    location: 'Singrauli Coalfield',
    latitude: 24.1165,
    longitude: 82.6321,
    managerName: 'Vipin Bihari Singh',
    capacityMTPA: 20.0,
    operationalStatus: 'OPERATIONAL',
    complianceScore: 91,
    riskLevel: 'LOW',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z'
  },
  {
    id: 'mine-talcher-05',
    name: 'Bhubaneswari Opencast Colliery',
    code: 'MCL-TL-05',
    owner: 'Mahanadi Coalfields Limited (MCL)',
    type: 'OPENCAST',
    state: 'Odisha',
    district: 'Angul',
    location: 'Talcher Coalfield',
    latitude: 20.9501,
    longitude: 85.2167,
    managerName: 'Debendra Nath Sahoo',
    capacityMTPA: 28.0,
    operationalStatus: 'OPERATIONAL',
    complianceScore: 82,
    riskLevel: 'MEDIUM',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z'
  }
];

export const MOCK_COMPLIANCE: ComplianceRecord[] = [
  {
    id: 'comp-1',
    requirementId: 'req-1',
    mineId: 'mine-jharia-01',
    status: 'NON_COMPLIANT',
    dueDate: '2026-09-15T00:00:00Z',
    submittedAt: '2026-08-25T00:00:00Z',
    verifiedAt: '2026-08-28T00:00:00Z',
    verifiedById: 'usr-inspector',
    riskScore: 78,
    proofDocuments: ['/uploads/sample-strata-control.pdf'],
    notes: 'Strata control monitoring sensors in Incline 3 require recalibration',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-28T00:00:00Z',
    mine: MOCK_MINES[0],
    requirement: {
      id: 'req-1',
      code: 'CMR-104',
      title: 'Strata Control & Systematic Support Rules (SSPR)',
      act: 'COAL_MINES_REGULATIONS',
      regulationReference: 'CMR 2017 Regulation 104',
      category: 'SAFETY_STATUTORY',
      description: 'Systematic strata monitoring with electronic tell-tales and load cells',
      frequency: 'MONTHLY',
      regulatoryAuthority: 'DGMS',
      penaltyDetails: 'Section 22A Prohibition Order',
      riskWeight: 9
    }
  },
  {
    id: 'comp-2',
    requirementId: 'req-2',
    mineId: 'mine-jharia-01',
    status: 'UNDER_REVIEW',
    dueDate: '2026-09-30T00:00:00Z',
    riskScore: 65,
    proofDocuments: ['/uploads/methane-telemetry.pdf'],
    notes: 'CH4 return airway readings average 0.62% volume (limit 0.75%)',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-20T00:00:00Z',
    mine: MOCK_MINES[0],
    requirement: {
      id: 'req-2',
      code: 'CMR-133',
      title: 'Inflammable Gas (Methane) Surveillance Standards',
      act: 'COAL_MINES_REGULATIONS',
      regulationReference: 'CMR 2017 Regulation 133',
      category: 'SAFETY_STATUTORY',
      description: 'Continuous telemetry of underground methane gas below threshold limit of 0.75%',
      frequency: 'CONTINUOUS_TELEMETRY',
      regulatoryAuthority: 'DGMS',
      penaltyDetails: 'Immediate Power Cut & Evacuation',
      riskWeight: 10
    }
  },
  {
    id: 'comp-3',
    requirementId: 'req-3',
    mineId: 'mine-raniganj-02',
    status: 'COMPLIANT',
    dueDate: '2026-10-15T00:00:00Z',
    submittedAt: '2026-08-20T00:00:00Z',
    verifiedAt: '2026-08-22T00:00:00Z',
    verifiedById: 'usr-inspector',
    riskScore: 20,
    proofDocuments: ['/uploads/effluent-cpcb.pdf'],
    notes: 'Mine drainage water pH is 7.2 (standard 6.5-8.5)',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-22T00:00:00Z',
    mine: MOCK_MINES[1],
    requirement: {
      id: 'req-3',
      code: 'CPCB-ENV-01',
      title: 'Effluent Water Discharge Standards & Acid Mine Drainage Treatment',
      act: 'WATER_ACT',
      regulationReference: 'CPCB Schedule VI General Effluent Standards',
      category: 'ENVIRONMENTAL_WATER',
      description: 'pH 6.5-8.5, TDS < 2100 mg/L before discharge into natural water bodies',
      frequency: 'FORTNIGHTLY',
      regulatoryAuthority: 'CPCB',
      penaltyDetails: 'Closure under Section 33A Water Act',
      riskWeight: 7
    }
  }
];

export const MOCK_INSPECTIONS: Inspection[] = [
  {
    id: 'insp-101',
    mineId: 'mine-jharia-01',
    inspectorId: 'usr-inspector',
    scheduledDate: '2026-09-02T10:00:00Z',
    completedDate: '2026-09-02T16:30:00Z',
    inspectionType: 'ROUTINE_SAFETY',
    status: 'COMPLETED',
    overallScore: 72,
    findingsSummary: '3 statutory non-compliances logged; remedial CAPA notices served with 14-day deadline.',
    actionRequired: true,
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-09-02T16:30:00Z',
    mine: MOCK_MINES[0],
    inspector: {
      id: 'usr-inspector',
      name: 'P. K. Ramanathan (Director of Mines Safety)',
      email: 'inspector@dgms.gov.in',
      role: 'SAFETY_INSPECTOR',
      department: 'DGMS Eastern Zone',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    findings: [
      {
        id: 'find-1',
        inspectionId: 'insp-101',
        category: 'VENTILATION',
        ruleReference: 'CMR 2017 Reg 129',
        severity: 'HIGH',
        description: 'Auxiliary fan in 4th East District found tripped for 45 minutes without auto-switchover.',
        status: 'NON_COMPLIANT',
        createdAt: '2026-09-02T11:30:00Z'
      },
      {
        id: 'find-2',
        inspectionId: 'insp-101',
        category: 'STRATA_CONTROL',
        ruleReference: 'CMR 2017 Reg 104',
        severity: 'CRITICAL',
        description: 'Roof tell-tale in Gallery 12 indicates 8mm convergence exceeding safety threshold.',
        status: 'NON_COMPLIANT',
        createdAt: '2026-09-02T13:15:00Z'
      }
    ]
  }
];

export const MOCK_VIOLATIONS: Violation[] = [
  {
    id: 'viol-201',
    mineId: 'mine-jharia-01',
    inspectionId: 'insp-101',
    title: 'Excessive Roof Strata Convergence in Gallery 12',
    description: 'Tell-tale displacement reached 8.2mm without additional resin bolting installation.',
    category: 'SAFETY',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    act: 'COAL_MINES_REGULATIONS',
    regulationReference: 'CMR 2017 Regulation 104(3)',
    issuedDate: '2026-09-02T17:00:00Z',
    deadline: '2026-09-16T17:00:00Z',
    fineAmountINR: 500000,
    penaltyNoticeUrl: '/uploads/violation-notice-201.pdf',
    createdAt: '2026-09-02T17:00:00Z',
    updatedAt: '2026-09-03T10:00:00Z',
    mine: MOCK_MINES[0],
    actions: [
      {
        id: 'capa-301',
        violationId: 'viol-201',
        title: 'Install 40 High-Tension Resin Roof Bolts and W-Strap Mesh',
        description: 'Reinforce Gallery 12 junction with 24mm steel resin anchors',
        assignedTo: 'Vikramaditya Construction Ltd (HEMM Operators)',
        targetDate: '2026-09-12T00:00:00Z',
        status: 'IN_PROGRESS',
        progressPercentage: 65,
        resolutionNotes: '30 of 40 resin bolts drilled and anchored.',
        createdAt: '2026-09-03T09:00:00Z',
        updatedAt: '2026-09-05T14:00:00Z'
      }
    ]
  }
];

