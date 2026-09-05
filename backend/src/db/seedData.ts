import {
  User,
  Mine,
  ComplianceRequirement,
  ComplianceRecord,
  Inspection,
  InspectionFinding,
  Violation,
  CorrectiveAction,
  Document,
  SafetyRecord,
  EnvironmentalRecord,
  Alert,
  AIPrediction,
  AuditLog
} from '../types/index.js';

export function generateSeedData() {
  // 1. USERS (Password: 'CoalGov@2026')
  const defaultHash = '$2a$10$O0Fq9oYx1r9/rD4F3iW8be8k2q1h8M.i1V9e9L3r9F3iW8be8k2q1'; // or plaintext check fallback

  const users: User[] = [
    {
      id: 'usr-admin',
      name: 'Rajesh Sharma',
      email: 'admin@coal.gov.in',
      passwordHash: 'CoalGov@2026',
      role: 'SUPER_ADMIN',
      department: 'Ministry of Coal - Digital Governance Directorate',
      phone: '+91-11-2338-4501',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'usr-hq',
      name: 'Dr. Amitav Mukherjee',
      email: 'hq@coal.gov.in',
      passwordHash: 'CoalGov@2026',
      role: 'HQ_MANAGEMENT',
      department: 'Coal India Limited (CIL) - Technical & Operations Wing',
      phone: '+91-33-2324-6555',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'usr-manager',
      name: 'Suresh Chandra Verma',
      email: 'manager@mine.gov.in',
      passwordHash: 'CoalGov@2026',
      role: 'MINE_MANAGER',
      department: 'BCCL - Jharia Coalfield Project Office',
      phone: '+91-326-220-4321',
      assignedMineId: 'mine-jharia-01',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'usr-inspector',
      name: 'P. K. Ramanathan (Director of Mines Safety)',
      email: 'inspector@dgms.gov.in',
      passwordHash: 'CoalGov@2026',
      role: 'SAFETY_INSPECTOR',
      department: 'Directorate General of Mines Safety (DGMS) Eastern Zone',
      phone: '+91-326-222-1100',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'usr-compliance',
      name: 'Priyanka Sen',
      email: 'compliance@mine.gov.in',
      passwordHash: 'CoalGov@2026',
      role: 'COMPLIANCE_OFFICER',
      department: 'ECL - Raniganj Statutory Surveillance Cell',
      phone: '+91-341-252-0112',
      assignedMineId: 'mine-raniganj-02',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'usr-contractor',
      name: 'Vikramaditya Construction & Heavy Logistics',
      email: 'contractor@partner.com',
      passwordHash: 'CoalGov@2026',
      role: 'CONTRACTOR',
      department: 'Heavy Earth Moving Machinery (HEMM) Operations',
      phone: '+91-98301-44552',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    }
  ];

  // 2. 12 INDIAN COAL MINES WITH ACCURATE COORDINATES
  const mines: Mine[] = [
    {
      id: 'mine-jharia-01',
      name: 'Jharia Block-II Underground Coal Mine',
      code: 'BCCL-JHR-01',
      owner: 'Bharat Coking Coal Limited (BCCL)',
      type: 'UNDERGROUND',
      state: 'Jharkhand',
      district: 'Dhanbad',
      location: 'Jharia Coalfield, Dhanbad',
      latitude: 23.7438,
      longitude: 86.4172,
      managerName: 'Suresh Chandra Verma',
      capacityMTPA: 2.8,
      operationalStatus: 'OPERATIONAL',
      complianceScore: 78,
      riskLevel: 'HIGH',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'mine-raniganj-02',
      name: 'Raniganj Sonepur Bazari Opencast Project',
      code: 'ECL-RNG-02',
      owner: 'Eastern Coalfields Limited (ECL)',
      type: 'OPENCAST',
      state: 'West Bengal',
      district: 'Paschim Bardhaman',
      location: 'Raniganj Coalfield, Asansol',
      latitude: 23.6845,
      longitude: 87.2189,
      managerName: 'Arunav Ganguly',
      capacityMTPA: 8.5,
      operationalStatus: 'OPERATIONAL',
      complianceScore: 92,
      riskLevel: 'LOW',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'mine-gevra-03',
      name: 'Gevra Mega Opencast Coal Mine',
      code: 'SECL-GVR-03',
      owner: 'South Eastern Coalfields Limited (SECL)',
      type: 'OPENCAST',
      state: 'Chhattisgarh',
      district: 'Korba',
      location: 'Korba Coalfield, Gevra',
      latitude: 22.3481,
      longitude: 82.5932,
      managerName: 'B. N. Prasad',
      capacityMTPA: 52.0,
      operationalStatus: 'OPERATIONAL',
      complianceScore: 89,
      riskLevel: 'LOW',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'mine-dipka-04',
      name: 'Dipka Expansion Opencast Mine',
      code: 'SECL-DPK-04',
      owner: 'South Eastern Coalfields Limited (SECL)',
      type: 'OPENCAST',
      state: 'Chhattisgarh',
      district: 'Korba',
      location: 'Dipka Area, Korba',
      latitude: 22.3189,
      longitude: 82.5714,
      managerName: 'K. S. Rao',
      capacityMTPA: 35.0,
      operationalStatus: 'OPERATIONAL',
      complianceScore: 84,
      riskLevel: 'MEDIUM',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'mine-talcher-05',
      name: 'Talcher Bhubaneswari Opencast Project',
      code: 'MCL-TCH-05',
      owner: 'Mahanadi Coalfields Limited (MCL)',
      type: 'OPENCAST',
      state: 'Odisha',
      district: 'Angul',
      location: 'Talcher Coalfield, Dhenkanal-Angul Belt',
      latitude: 20.9507,
      longitude: 85.2215,
      managerName: 'M. K. Mohapatra',
      capacityMTPA: 28.0,
      operationalStatus: 'OPERATIONAL',
      complianceScore: 94,
      riskLevel: 'LOW',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'mine-singrauli-06',
      name: 'Singrauli Jayant Opencast Colliery',
      code: 'NCL-SNG-06',
      owner: 'Northern Coalfields Limited (NCL)',
      type: 'OPENCAST',
      state: 'Madhya Pradesh',
      district: 'Singrauli',
      location: 'Singrauli Coalfield, Jayant',
      latitude: 24.1167,
      longitude: 82.6333,
      managerName: 'R. K. Tiwari',
      capacityMTPA: 20.0,
      operationalStatus: 'OPERATIONAL',
      complianceScore: 91,
      riskLevel: 'LOW',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'mine-bokaro-07',
      name: 'Bokaro Amlo Opencast Mine',
      code: 'CCL-BKR-07',
      owner: 'Central Coalfields Limited (CCL)',
      type: 'OPENCAST',
      state: 'Jharkhand',
      district: 'Bokaro',
      location: 'East Bokaro Coalfield, Bermo',
      latitude: 23.7742,
      longitude: 85.9521,
      managerName: 'Sunil Kumar Soren',
      capacityMTPA: 4.5,
      operationalStatus: 'OPERATIONAL',
      complianceScore: 68,
      riskLevel: 'CRITICAL',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'mine-karanpura-08',
      name: 'North Karanpura Magadh Mega Project',
      code: 'CCL-NKP-08',
      owner: 'Central Coalfields Limited (CCL)',
      type: 'OPENCAST',
      state: 'Jharkhand',
      district: 'Chatra',
      location: 'North Karanpura Coalfield, Tandwa',
      latitude: 23.8681,
      longitude: 84.9754,
      managerName: 'Deepak Kumar Jha',
      capacityMTPA: 51.0,
      operationalStatus: 'OPERATIONAL',
      complianceScore: 86,
      riskLevel: 'MEDIUM',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'mine-ibvalley-09',
      name: 'Ib Valley Lakhanpur Opencast Mine',
      code: 'MCL-IBV-09',
      owner: 'Mahanadi Coalfields Limited (MCL)',
      type: 'OPENCAST',
      state: 'Odisha',
      district: 'Jharsuguda',
      location: 'Ib Valley Coalfield, Belpahar',
      latitude: 21.7824,
      longitude: 83.8211,
      managerName: 'S. N. Tripathy',
      capacityMTPA: 21.0,
      operationalStatus: 'OPERATIONAL',
      complianceScore: 93,
      riskLevel: 'LOW',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'mine-godavari-10',
      name: 'Godavari Valley Adriyala Longwall Project',
      code: 'SCCL-GDV-10',
      owner: 'Singareni Collieries Company Limited (SCCL)',
      type: 'UNDERGROUND',
      state: 'Telangana',
      district: 'Peddapalli',
      location: 'Godavari Valley Coalfield, Ramagundam',
      latitude: 18.7612,
      longitude: 79.5123,
      managerName: 'V. Venkateswarlu',
      capacityMTPA: 3.5,
      operationalStatus: 'OPERATIONAL',
      complianceScore: 88,
      riskLevel: 'MEDIUM',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'mine-chinakuri-11',
      name: 'Chinakuri Underground Colliery',
      code: 'ECL-CHK-11',
      owner: 'Eastern Coalfields Limited (ECL)',
      type: 'UNDERGROUND',
      state: 'West Bengal',
      district: 'Paschim Bardhaman',
      location: 'Dishergarh Seam, Sitarampur',
      latitude: 23.6811,
      longitude: 86.8524,
      managerName: 'Debabrata Bose',
      capacityMTPA: 1.2,
      operationalStatus: 'OPERATIONAL',
      complianceScore: 71,
      riskLevel: 'HIGH',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'mine-neyveli-12',
      name: 'Neyveli Lignite Mine-II',
      code: 'NLC-NYV-12',
      owner: 'NLC India Limited',
      type: 'OPENCAST',
      state: 'Tamil Nadu',
      district: 'Cuddalore',
      location: 'Neyveli Lignite Basin, Cuddalore',
      latitude: 11.5388,
      longitude: 79.4861,
      managerName: 'K. Balasubramanian',
      capacityMTPA: 15.0,
      operationalStatus: 'OPERATIONAL',
      complianceScore: 96,
      riskLevel: 'LOW',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    }
  ];

  // 3. STATUTORY REQUIREMENTS UNDER INDIAN MINING ACTS
  const requirements: ComplianceRequirement[] = [
    {
      id: 'req-cmr-104',
      code: 'CMR-2017-R104',
      title: 'Strata Control and Support Plan (SCASP)',
      requirement: 'Formulation, scientific validation, and daily implementation of Strata Control and Support Plan for all underground development headings and junctions.',
      description: 'Systematic support rules approved by DGMS with mandatory rock bolt load cell monitoring.',
      category: 'SAFETY',
      regulatoryAuthority: 'Directorate General of Mines Safety (DGMS)',
      regulationReference: 'Coal Mines Regulations 2017, Regulation 104',
      frequency: 'DAILY',
      priority: 'CRITICAL',
      penaltyClause: 'Immediate prohibition of underground workings under Section 22(3) of Mines Act 1952.',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'req-cmr-153',
      code: 'CMR-2017-R153',
      title: 'Standard of Ventilation & Inflammable Gas Limits',
      requirement: 'Continuous supply of fresh air not less than 6 m³/min per person employed underground; CH4 not to exceed 0.5% in general body of air and 0.75% in return airway.',
      description: 'Periodic ventilation surveys and continuous methane & carbon monoxide telemetry sensor calibration.',
      category: 'SAFETY',
      regulatoryAuthority: 'Directorate General of Mines Safety (DGMS)',
      regulationReference: 'Coal Mines Regulations 2017, Regulation 153 & 160',
      frequency: 'DAILY',
      priority: 'CRITICAL',
      penaltyClause: 'Withdrawal of workforce and criminal prosecution under Mines Act 1952 Section 72C.',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'req-cmr-106',
      code: 'CMR-2017-R106',
      title: 'Opencast Bench Height, Width & Slope Stability',
      requirement: 'Bench height shall not exceed maximum digging reach of excavator; bench width shall not be less than bench height plus 3m; overall pit slope angle verified by scientific geotechnical studies.',
      description: 'Deployment of real-time Slope Stability Radar (SSR) and continuous piezometer ground water monitoring.',
      category: 'MINING',
      regulatoryAuthority: 'Directorate General of Mines Safety (DGMS)',
      regulationReference: 'Coal Mines Regulations 2017, Regulation 106',
      frequency: 'MONTHLY',
      priority: 'HIGH',
      penaltyClause: 'Suspension of heavy earth moving machinery (HEMM) excavation permissions.',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'req-epa-ec',
      code: 'EPA-1986-EC',
      title: 'Environmental Clearance (EC) & Ambient Air Standards',
      requirement: 'Maintenance of ambient PM10 < 100 µg/m³ and PM2.5 < 60 µg/m³ at colliery boundary; installation of CAAQMS stations and continuous water mist suppression.',
      description: 'Submission of Six-Monthly Compliance Reports to Regional Office of MoEFCC and CPCB.',
      category: 'ENVIRONMENTAL',
      regulatoryAuthority: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
      regulationReference: 'Environment (Protection) Act 1986 & EIA Notification 2006',
      frequency: 'HALF_YEARLY',
      priority: 'HIGH',
      penaltyClause: 'Revocation of Environmental Clearance and imposition of Environmental Compensation under NGT Act.',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'req-water-cto',
      code: 'WATER-1974-CTO',
      title: 'Consent to Operate (CTO) & Effluent Neutralization',
      requirement: 'Treatment and recycling of acid mine drainage (AMD); pH maintained between 6.5 and 8.5; Total Suspended Solids (TSS) < 100 mg/L before discharge into natural water bodies.',
      description: 'Operation of Oil & Grease traps and automated water quality telemetry connected to SPCB server.',
      category: 'ENVIRONMENTAL',
      regulatoryAuthority: 'State Pollution Control Board (SPCB)',
      regulationReference: 'Water (Prevention & Control of Pollution) Act 1974 Section 25/26',
      frequency: 'MONTHLY',
      priority: 'HIGH',
      penaltyClause: 'Closure order under Section 33A of Water Act and disconnection of industrial power supply.',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'req-mines-form4',
      code: 'MINES-1955-FORM4',
      title: 'Submission of Annual Returns (Form IV & Form V)',
      requirement: 'Mandatory annual filing of employment, production, machinery, and safety statistics to Chief Inspector of Mines and District Magistrate on or before February 20th.',
      description: 'Verification of muster rolls, wage registers, and statutory safety committee deliberations.',
      category: 'STATUTORY',
      regulatoryAuthority: 'Directorate General of Mines Safety (DGMS)',
      regulationReference: 'Mines Rules 1955, Rule 77 & 78',
      frequency: 'ANNUAL',
      priority: 'MEDIUM',
      penaltyClause: 'Statutory fine and formal notice under Section 66 of Mines Act 1952.',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'req-dgms-hemm',
      code: 'DGMS-TECH-HEMM',
      title: 'HEMM Operator Safety & Collision Warning System',
      requirement: 'Installation of audio-visual alarm (AVAS), rear-view camera, proximity warning radar, and fire suppression system (FSS) on all 100T+ dumpers and hydraulic shovels.',
      description: 'Mandatory seatbelt interlocks and quarterly operator defensive driving certification.',
      category: 'OPERATIONAL',
      regulatoryAuthority: 'Directorate General of Mines Safety (DGMS)',
      regulationReference: 'DGMS (Tech) Circular No. 06 of 2020',
      frequency: 'QUARTERLY',
      priority: 'HIGH',
      penaltyClause: 'Grounding of non-compliant heavy equipment fleet.',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'req-labour-creche',
      code: 'MINES-CRECHE-1966',
      title: 'Mines Creche & Occupational Health Surveillance',
      requirement: 'Provision of modern creche facility conforming to standard specifications where female workers are employed; mandatory Periodical Medical Examination (PME) every 5 years for all mine workers.',
      description: 'Pneumoconiosis and audiometric screening conducted by DGMS-certified medical practitioners.',
      category: 'LABOUR',
      regulatoryAuthority: 'Welfare Commissioner / DGMS Labour Wing',
      regulationReference: 'Mines Creche Rules 1966 & Mines Rules 1955 Rule 29B',
      frequency: 'ANNUAL',
      priority: 'MEDIUM',
      penaltyClause: 'Statutory prosecution and recovery under Labour Welfare fund regulations.',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z'
    }
  ];

  // 4. PRE-SEEDED COMPLIANCE RECORDS FOR ALL 12 MINES
  const complianceRecords: ComplianceRecord[] = [];
  mines.forEach((m, idx) => {
    requirements.forEach((r, rIdx) => {
      let status: any = 'COMPLIANT';
      let riskLevel: any = 'LOW';
      let remarks = 'Compliant as verified during statutory audit.';

      if (m.riskLevel === 'CRITICAL' && (r.category === 'SAFETY' || r.category === 'MINING')) {
        status = 'NON_COMPLIANT';
        riskLevel = 'CRITICAL';
        remarks = 'Statutory breach identified. Show-cause issued by Regional Inspector.';
      } else if (m.riskLevel === 'HIGH' && (r.category === 'SAFETY' || r.category === 'ENVIRONMENTAL')) {
        status = rIdx % 2 === 0 ? 'PARTIALLY_COMPLIANT' : 'PENDING';
        riskLevel = 'HIGH';
        remarks = 'Remediation underway; final proof verification awaited.';
      } else if (m.riskLevel === 'MEDIUM' && r.category === 'ENVIRONMENTAL') {
        status = 'PARTIALLY_COMPLIANT';
        riskLevel = 'MEDIUM';
        remarks = 'Minor exceedance in PM10 mist cannon coverage.';
      }

      complianceRecords.push({
        id: `comp-${m.code}-${r.code}`,
        requirementId: r.id,
        mineId: m.id,
        status,
        applicableDate: '2026-01-01T00:00:00Z',
        dueDate: '2026-10-31T00:00:00Z',
        lastVerifiedAt: status === 'COMPLIANT' ? '2026-07-15T00:00:00Z' : undefined,
        responsibleOfficerId: 'usr-compliance',
        riskLevel,
        remarks,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-08-01T00:00:00Z'
      });
    });
  });

  // 5. VIOLATIONS
  const violations: Violation[] = [
    {
      id: 'viol-jharia-001',
      mineId: 'mine-jharia-01',
      title: 'Methane Ingress Exceedance in District 4 Heading',
      description: 'Continuous CH4 sensor recorded 0.85% (permissible: 0.5%) at return airway junction 4B. Auxiliary fan ducting found compromised.',
      category: 'SAFETY',
      severity: 'CRITICAL',
      status: 'OPEN',
      deadline: '2026-09-10T00:00:00Z',
      aiRecommendation: 'Activate emergency booster fan, evacuate Section 4 heading, and inspect intake seal integrity.',
      createdAt: '2026-08-15T00:00:00Z',
      updatedAt: '2026-08-15T00:00:00Z'
    },
    {
      id: 'viol-bokaro-002',
      mineId: 'mine-bokaro-07',
      title: 'Tension Crack on North Overburden Dump Slope',
      description: 'Geotechnical survey detected 150mm tension crack along bench 3 OB dump. Dump slope angle exceeds DGMS approved 28 degrees.',
      category: 'MINING',
      severity: 'CRITICAL',
      status: 'IN_PROGRESS',
      deadline: '2026-09-05T00:00:00Z',
      aiRecommendation: 'Halt dumping operations on North Face, re-profile slope to 24 degrees, and install slope radar.',
      createdAt: '2026-08-10T00:00:00Z',
      updatedAt: '2026-08-12T00:00:00Z'
    },
    {
      id: 'viol-chinakuri-003',
      mineId: 'mine-chinakuri-11',
      title: 'Deficient Rock Bolting Anchorage Testing',
      description: 'Anchor load cell testing records not maintained for 45 days in Seam XVI. Random pull test revealed 30% bolts below 6-tonne anchor capacity.',
      category: 'SAFETY',
      severity: 'HIGH',
      status: 'ACTION_SUBMITTED',
      deadline: '2026-09-15T00:00:00Z',
      aiRecommendation: 'Replace resin capsules with quick-setting thixotropic grout and conduct 100% pull tests.',
      createdAt: '2026-08-01T00:00:00Z',
      updatedAt: '2026-08-18T00:00:00Z'
    },
    {
      id: 'viol-dipka-004',
      mineId: 'mine-dipka-04',
      title: 'Effluent Water pH Below Standard in Sump Discharge',
      description: 'Mine discharge into Lilagar River recorded pH 5.4 (Standard: 6.5 - 8.5) due to untreated pyritic coal washery runoff.',
      category: 'ENVIRONMENTAL',
      severity: 'HIGH',
      status: 'UNDER_VERIFICATION',
      deadline: '2026-09-20T00:00:00Z',
      aiRecommendation: 'Commission automated lime-dosing plant at Main Sump No. 2.',
      createdAt: '2026-07-28T00:00:00Z',
      updatedAt: '2026-08-20T00:00:00Z'
    }
  ];

  // 6. CORRECTIVE ACTIONS (CAPA)
  const correctiveActions: CorrectiveAction[] = [
    {
      id: 'capa-jharia-001',
      violationId: 'viol-jharia-001',
      mineId: 'mine-jharia-01',
      title: 'Overhaul Section 4 Auxiliary Ventilation & Seal Repair',
      description: 'Replace 250m damaged ventilation ducting and install flameproof twin-fan auxiliary ventilation unit.',
      assignedToId: 'usr-contractor',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      progressPercentage: 45,
      deadline: '2026-09-08T00:00:00Z',
      remarks: 'New ducting delivered on site; installation underway.',
      createdAt: '2026-08-16T00:00:00Z',
      updatedAt: '2026-08-20T00:00:00Z'
    },
    {
      id: 'capa-bokaro-002',
      violationId: 'viol-bokaro-002',
      mineId: 'mine-bokaro-07',
      title: 'Terracing & De-stressing of North OB Dump',
      description: 'Deploy 4 dozers to grade top bench and reduce overall slope angle to 22 degrees with biological turfing.',
      assignedToId: 'usr-manager',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      progressPercentage: 70,
      deadline: '2026-09-04T00:00:00Z',
      remarks: 'Top bench pushdown complete; slope radar reading stabilized.',
      createdAt: '2026-08-11T00:00:00Z',
      updatedAt: '2026-08-22T00:00:00Z'
    },
    {
      id: 'capa-chinakuri-003',
      violationId: 'viol-chinakuri-003',
      mineId: 'mine-chinakuri-11',
      title: 'Full Resin Capsule Re-anchoring & Digital Load Testing',
      description: 'Re-support 80m gallery heading with high-yield steel bolts and submit digital load cell test certificate to DGMS.',
      assignedToId: 'usr-manager',
      priority: 'HIGH',
      status: 'PENDING_VERIFICATION',
      progressPercentage: 100,
      deadline: '2026-09-12T00:00:00Z',
      remarks: 'All 120 bolts re-installed; 100% passed 8-tonne pull test. Awaiting inspector sign-off.',
      createdAt: '2026-08-02T00:00:00Z',
      updatedAt: '2026-08-18T00:00:00Z'
    }
  ];

  // 7. INSPECTIONS
  const inspections: Inspection[] = [
    {
      id: 'insp-jharia-q3',
      mineId: 'mine-jharia-01',
      inspectorId: 'usr-inspector',
      inspectionType: 'ROUTINE_STATUTORY',
      scheduledDate: '2026-08-15T00:00:00Z',
      status: 'COMPLETED',
      summary: 'Quarterly statutory surveillance of underground ventilation and strata load cells.',
      overallScore: 74,
      createdAt: '2026-08-01T00:00:00Z',
      updatedAt: '2026-08-15T00:00:00Z'
    },
    {
      id: 'insp-gevra-q3',
      mineId: 'mine-gevra-03',
      inspectorId: 'usr-inspector',
      inspectionType: 'SAFETY_AUDIT',
      scheduledDate: '2026-08-20T00:00:00Z',
      status: 'COMPLETED',
      summary: 'Comprehensive HEMM safety, dumper collision radar, and blast vibration audit.',
      overallScore: 92,
      createdAt: '2026-08-01T00:00:00Z',
      updatedAt: '2026-08-20T00:00:00Z'
    }
  ];

  const inspectionFindings: InspectionFinding[] = [
    {
      id: 'find-01',
      inspectionId: 'insp-jharia-q3',
      checklistItem: 'Ventilation Air Volume & Gas Telemetry',
      category: 'SAFETY',
      observation: 'Methane reading 0.85% in return airway 4B; ducting breached.',
      isViolation: true,
      severity: 'CRITICAL',
      createdAt: '2026-08-15T00:00:00Z'
    },
    {
      id: 'find-02',
      inspectionId: 'insp-jharia-q3',
      checklistItem: 'Escape Route & Refuge Chamber Readiness',
      category: 'SAFETY',
      observation: 'Refuge chamber oxygen cylinder pressure 200 bar, battery backup functional.',
      isViolation: false,
      severity: 'LOW',
      createdAt: '2026-08-15T00:00:00Z'
    }
  ];

  // 8. DOCUMENTS
  const documents: Document[] = [
    {
      id: 'doc-ec-gevra',
      title: 'Environmental Clearance (EC) for 52 MTPA Expansion - Gevra Mine',
      filename: 'EC_Gevra_52MTPA_MoEFCC.pdf',
      originalName: 'EC_Gevra_52MTPA_MoEFCC.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 4194304,
      category: 'ENVIRONMENTAL_CLEARANCE',
      documentType: 'Environmental Clearance',
      mineId: 'mine-gevra-03',
      uploadedById: 'usr-compliance',
      expiryDate: '2029-12-31T00:00:00Z',
      verificationStatus: 'VERIFIED',
      filePath: './uploads/sample_ec.pdf',
      fileUrl: '/uploads/sample_ec.pdf',
      createdAt: '2025-01-10T00:00:00Z',
      updatedAt: '2025-01-10T00:00:00Z'
    },
    {
      id: 'doc-cto-jharia',
      title: 'Consent to Operate (CTO) Renewal Order - Jharia Block-II',
      filename: 'CTO_JSPCB_Jharia_2026.pdf',
      originalName: 'CTO_JSPCB_Jharia_2026.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 2097152,
      category: 'CONSENT_TO_OPERATE',
      documentType: 'Consent to Operate',
      mineId: 'mine-jharia-01',
      uploadedById: 'usr-compliance',
      expiryDate: '2026-09-30T00:00:00Z', // Expiring soon!
      verificationStatus: 'VERIFIED',
      filePath: './uploads/sample_cto.pdf',
      fileUrl: '/uploads/sample_cto.pdf',
      createdAt: '2025-06-01T00:00:00Z',
      updatedAt: '2025-06-01T00:00:00Z'
    }
  ];

  // 9. SAFETY RECORDS
  const safetyRecords: SafetyRecord[] = [
    {
      id: 'safe-01',
      mineId: 'mine-jharia-01',
      date: '2026-08-25T00:00:00Z',
      incidentType: 'Elevated Methane Sensor Trigger',
      severity: 'HIGH',
      description: 'Sensor CH4-04 triggered 0.65% in South Dip face during coal cutting.',
      locationInMine: 'Seam V South Heading',
      casualties: 0,
      injuries: 0,
      lostHours: 2,
      ppeComplianceRate: 98.0,
      gasLevelCH4: 0.65,
      gasLevelCO: 6.0,
      status: 'RESOLVED',
      createdAt: '2026-08-25T00:00:00Z'
    },
    {
      id: 'safe-02',
      mineId: 'mine-gevra-03',
      date: '2026-08-28T00:00:00Z',
      incidentType: 'Routine Shift Safety Briefing & Audit',
      severity: 'LOW',
      description: 'Shift B safety circle conducted; 100% dumper operators verified for AVAS.',
      locationInMine: 'Central Inpit Haul Road',
      casualties: 0,
      injuries: 0,
      lostHours: 0,
      ppeComplianceRate: 99.2,
      gasLevelCH4: 0.0,
      gasLevelCO: 1.0,
      status: 'LOGGED',
      createdAt: '2026-08-28T00:00:00Z'
    }
  ];

  // 10. ENVIRONMENTAL RECORDS
  const environmentalData: EnvironmentalRecord[] = [
    {
      id: 'env-01',
      mineId: 'mine-gevra-03',
      date: '2026-08-28T00:00:00Z',
      pm10: 76.5,
      pm25: 38.0,
      so2: 16.5,
      nox: 22.0,
      waterPh: 7.3,
      waterTds: 320,
      waterCod: 35,
      noiseDb: 68.0,
      overburdenStabilityStatus: 'STABLE',
      warningTriggered: false,
      createdAt: '2026-08-28T00:00:00Z'
    },
    {
      id: 'env-02',
      mineId: 'mine-bokaro-07',
      date: '2026-08-28T00:00:00Z',
      pm10: 118.0, // CPCB Breach
      pm25: 64.0,
      so2: 26.0,
      nox: 38.0,
      waterPh: 6.1,
      waterTds: 490,
      waterCod: 78,
      noiseDb: 74.5,
      overburdenStabilityStatus: 'TENSION_DETECTED',
      warningTriggered: true,
      createdAt: '2026-08-28T00:00:00Z'
    }
  ];

  // 11. ALERTS
  const alerts: Alert[] = [
    {
      id: 'alt-01',
      mineId: 'mine-jharia-01',
      title: 'CRITICAL: Methane Sensor Alarm in Jharia Block-II',
      message: 'CH4 exceeded 0.8% in return airway 4B. Emergency statutory protocol initiated.',
      type: 'SAFETY',
      severity: 'CRITICAL',
      isRead: false,
      createdAt: '2026-08-15T08:30:00Z'
    },
    {
      id: 'alt-02',
      mineId: 'mine-jharia-01',
      title: 'WARNING: Consent to Operate (CTO) Expiring in 30 Days',
      message: 'JSPCB CTO clearance for Jharia Colliery expires on 30 Sep 2026.',
      type: 'COMPLIANCE',
      severity: 'HIGH',
      isRead: false,
      createdAt: '2026-08-20T09:00:00Z'
    }
  ];

  // 12. AI PREDICTIONS
  const aiPredictions: AIPrediction[] = [
    {
      id: 'ai-jharia',
      mineId: 'mine-jharia-01',
      riskScore: 78.5,
      riskLevel: 'HIGH',
      confidence: 94.0,
      factors: [
        '1 Active CRITICAL violation regarding underground methane ingress.',
        'CTO statutory renewal pending within 30 days.'
      ],
      recommendations: [
        'Deploy DGMS Senior Inspector for ventilation overhaul sign-off.',
        'Expedite JSPCB renewal application.'
      ],
      isAccepted: true,
      reviewedById: 'usr-inspector',
      reviewedAt: '2026-08-16T10:00:00Z',
      reviewRemarks: 'Inspector reviewed and authorized technical overhaul directive.',
      createdAt: '2026-08-15T00:00:00Z',
      updatedAt: '2026-08-16T00:00:00Z'
    },
    {
      id: 'ai-bokaro',
      mineId: 'mine-bokaro-07',
      riskScore: 88.0,
      riskLevel: 'CRITICAL',
      confidence: 96.5,
      factors: [
        'OB dump tension crack exceeding 150mm with slope stability radar alert.',
        'CPCB ambient air PM10 continuous exceedance (118 µg/m³).'
      ],
      recommendations: [
        'Halt OB dumping on North Face immediately.',
        'Deploy high-pressure mist cannons and re-grade bench slope to 22 degrees.'
      ],
      isAccepted: null,
      createdAt: '2026-08-20T00:00:00Z',
      updatedAt: '2026-08-20T00:00:00Z'
    }
  ];

  // 13. AUDIT LOGS
  const auditLogs: AuditLog[] = [
    {
      id: 'aud-01',
      userId: 'usr-inspector',
      userName: 'P. K. Ramanathan (Director of Mines Safety)',
      userRole: 'SAFETY_INSPECTOR',
      action: 'VIOLATION_ISSUED',
      entity: 'VIOLATION',
      entityId: 'viol-jharia-001',
      newValues: '{"title": "Methane Ingress Exceedance", "severity": "CRITICAL"}',
      ipAddress: '10.24.110.12',
      createdAt: '2026-08-15T09:15:00Z'
    },
    {
      id: 'aud-02',
      userId: 'usr-manager',
      userName: 'Suresh Chandra Verma',
      userRole: 'MINE_MANAGER',
      action: 'CAPA_ASSIGNED',
      entity: 'CORRECTIVE_ACTION',
      entityId: 'capa-jharia-001',
      newValues: '{"title": "Overhaul Section 4 Auxiliary Ventilation", "progress": 45}',
      ipAddress: '10.24.110.45',
      createdAt: '2026-08-16T11:20:00Z'
    },
    {
      id: 'aud-03',
      userId: 'usr-admin',
      userName: 'Rajesh Sharma',
      userRole: 'SUPER_ADMIN',
      action: 'USER_CREATED',
      entity: 'USER',
      entityId: 'usr-contractor',
      newValues: '{"name": "Vikramaditya Construction", "role": "CONTRACTOR"}',
      ipAddress: '10.24.100.1',
      createdAt: '2026-08-01T14:00:00Z'
    }
  ];

  return {
    users,
    mines,
    requirements,
    complianceRecords,
    inspections,
    inspectionFindings,
    violations,
    correctiveActions,
    documents,
    safetyRecords,
    environmentalData,
    alerts,
    aiPredictions,
    auditLogs
  };
}

export default generateSeedData;

