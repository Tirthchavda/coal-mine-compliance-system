export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'HQ_MANAGEMENT' 
  | 'MINE_MANAGER' 
  | 'SAFETY_INSPECTOR' 
  | 'COMPLIANCE_OFFICER' 
  | 'CONTRACTOR';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type MineType = 'OPENCAST' | 'UNDERGROUND' | 'MIXED';
export type OperationalStatus = 'OPERATIONAL' | 'TEMPORARILY_CLOSED' | 'ABANDONED' | 'DEVELOPMENT';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ComplianceCategory = 'SAFETY' | 'LABOUR' | 'ENVIRONMENTAL' | 'MINING' | 'STATUTORY' | 'OPERATIONAL' | 'OTHER';
export type ComplianceStatus = 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT' | 'PENDING' | 'EXPIRED';
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'ANNUAL' | 'ONCE';
export type InspectionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type InspectionType = 'ROUTINE_STATUTORY' | 'DGMS_SURPRISE' | 'SAFETY_AUDIT' | 'ENVIRONMENTAL_AUDIT' | 'VENTILATION_SPECIAL' | 'ELECTRICAL_MECHANICAL';
export type ViolationSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ViolationStatus = 'OPEN' | 'IN_PROGRESS' | 'ACTION_SUBMITTED' | 'UNDER_VERIFICATION' | 'RESOLVED' | 'CLOSED';
export type ActionStatus = 'OPEN' | 'IN_PROGRESS' | 'PENDING_VERIFICATION' | 'COMPLETED' | 'OVERDUE' | 'CLOSED';
export type DocumentCategory = 'DGMS_APPROVAL' | 'ENVIRONMENTAL_CLEARANCE' | 'CONSENT_TO_OPERATE' | 'MINING_PLAN' | 'SAFETY_COMMITTEE_MINUTES' | 'STATUTORY_FORM_IV' | 'STATUTORY_FORM_V' | 'ANNUAL_RETURN' | 'INSPECTION_REPORT' | 'TRAINING_RECORD' | 'OTHER';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  phone?: string;
  assignedMineId?: string;
  status: UserStatus;
  createdAt?: string;
}

export interface Mine {
  id: string;
  name: string;
  code: string;
  owner: string;
  type: MineType;
  state: string;
  district: string;
  location: string;
  latitude: number;
  longitude: number;
  managerName: string;
  capacityMTPA: number;
  operationalStatus: OperationalStatus;
  complianceScore: number;
  riskLevel: RiskLevel;
  createdAt?: string;
  updatedAt?: string;
}

export interface ComplianceRequirement {
  id: string;
  title: string;
  requirement: string;
  description: string;
  category: ComplianceCategory;
  regulatoryAuthority: string;
  regulationReference: string;
  frequency: Frequency;
  priority: PriorityLevel;
  penaltyClause?: string;
}

export interface ComplianceRecord {
  id: string;
  requirementId: string;
  requirement?: ComplianceRequirement;
  mineId: string;
  mine?: Mine;
  applicableDate: string;
  dueDate: string;
  responsibleOfficerId?: string;
  responsibleOfficer?: User;
  status: ComplianceStatus;
  riskLevel: RiskLevel;
  remarks?: string;
  lastVerifiedAt?: string;
  supportingDocUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionFinding {
  id: string;
  inspectionId: string;
  checklistItem: string;
  category: string;
  observation: string;
  isViolation: boolean;
  severity?: ViolationSeverity;
  evidenceUrl?: string;
  createdAt?: string;
}

export interface Inspection {
  id: string;
  mineId: string;
  mine?: Mine;
  inspectorId: string;
  inspector?: User;
  inspectionType: InspectionType;
  scheduledDate: string;
  actualDate?: string;
  status: InspectionStatus;
  overallScore?: number;
  summary?: string;
  remarks?: string;
  findings?: InspectionFinding[];
  createdAt: string;
}

export interface Violation {
  id: string;
  mineId: string;
  mine?: Mine;
  complianceRecordId?: string;
  inspectionId?: string;
  title: string;
  description: string;
  category: ComplianceCategory;
  severity: ViolationSeverity;
  status: ViolationStatus;
  deadline: string;
  responsiblePersonId?: string;
  responsiblePerson?: User;
  evidenceUrl?: string;
  aiRiskScore?: number;
  aiRecommendation?: string;
  humanOverrideRemark?: string;
  remarks?: string;
  correctiveActions?: CorrectiveAction[];
  createdAt: string;
}

export interface CorrectiveAction {
  id: string;
  violationId: string;
  violation?: Violation;
  mineId: string;
  mine?: Mine;
  title: string;
  description: string;
  assignedToId?: string;
  assignedTo?: User;
  deadline: string;
  priority: PriorityLevel;
  status: ActionStatus;
  progressPercentage: number;
  expectedResolution?: string;
  resolutionEvidenceUrl?: string;
  remarks?: string;
  verifiedById?: string;
  verifiedBy?: User;
  verifiedAt?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  title: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  category: DocumentCategory;
  documentType: string;
  mineId: string;
  mine?: Mine;
  complianceRecordId?: string;
  violationId?: string;
  issueDate?: string;
  expiryDate?: string;
  verificationStatus: VerificationStatus;
  uploadedById?: string;
  uploadedBy?: User;
  fileUrl: string;
  extractedMetaJson?: string;
  createdAt: string;
}

export interface SafetyRecord {
  id: string;
  mineId: string;
  mine?: Mine;
  incidentType: string;
  severity: string;
  date: string;
  description: string;
  locationInMine?: string;
  casualties: number;
  injuries: number;
  lostHours: number;
  ppeComplianceRate: number;
  gasLevelCH4: number;
  gasLevelCO: number;
  status: string;
}

export interface EnvironmentalRecord {
  id: string;
  mineId: string;
  mine?: Mine;
  date: string;
  pm10: number;
  pm25: number;
  so2: number;
  nox: number;
  waterPh: number;
  waterTds: number;
  waterCod: number;
  noiseDb: number;
  overburdenStabilityStatus: string;
  warningTriggered: boolean;
}

export interface Alert {
  id: string;
  mineId?: string;
  mine?: Mine;
  userId?: string;
  title: string;
  message: string;
  type: string;
  severity: PriorityLevel;
  relatedEntity?: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AIPrediction {
  id: string;
  mineId: string;
  mine?: Mine;
  riskScore: number;
  riskLevel: RiskLevel;
  confidence: number;
  factors: string[];
  recommendations: string[];
  isAccepted?: boolean | null;
  reviewedById?: string;
  reviewedAt?: string;
  reviewRemarks?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userName: string;
  userRole: string;
  action: string;
  entity: string;
  entityId: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

