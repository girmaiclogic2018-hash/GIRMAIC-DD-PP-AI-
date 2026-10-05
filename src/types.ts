export type LanguageCode = 'am' | 'en' | 'om' | 'so' | 'ti';

export type DomainType = 'DOMAIN_A' | 'DOMAIN_B' | 'DOMAIN_C' | 'DOMAIN_D' | 'DOMAIN_E';

export type SourceHierarchyLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type VerificationStatus = 'VERIFIED' | 'PARTIALLY VERIFIED' | 'NOT VERIFIED' | 'REQUIRES HUMAN REVIEW';

export type ApprovalStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'SUPERSEDED' | 'EXPIRED' | 'REJECTED';

export type UserRole = 'SUPER_ADMIN' | 'KNOWLEDGE_ADMIN' | 'REVIEWER' | 'APPROVER' | 'OFFICER' | 'AUDITOR' | 'CALL_OPERATOR' | 'READ_ONLY';

export interface KnowledgeDocument {
  id: string;
  title: string;
  source: string;
  organization: string;
  documentType: 'POLICY' | 'RULE' | 'REGULATION' | 'ANNOUNCEMENT' | 'PROCEDURE' | 'LAW' | 'EXPLANATORY';
  domain: DomainType;
  level: SourceHierarchyLevel;
  language: LanguageCode;
  version: string;
  effectiveDate: string;
  expiryDate?: string;
  uploadedBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
  checksum: string;
  content: string;
  summary: string;
}

export interface Citation {
  documentId: string;
  title: string;
  source: string;
  level: SourceHierarchyLevel;
  domain: DomainType;
  version: string;
  effectiveDate: string;
  section?: string;
  verificationStatus: VerificationStatus;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  language: LanguageCode;
  timestamp: string;
  domain?: DomainType;
  citations?: Citation[];
  verificationStatus?: VerificationStatus;
  isEscalated?: boolean;
}

export interface EscalationTicket {
  id: string;
  userId: string;
  userName: string;
  question: string;
  language: LanguageCode;
  timestamp: string;
  category: string;
  aiAnswer: string;
  sourceStatus: VerificationStatus;
  assignedOfficer: string;
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  resolution?: string;
  resolutionDate?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  userRole: UserRole;
  action: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'BLOCKED';
}

export interface TerminologyItem {
  id: string;
  term: string;
  language: LanguageCode;
  definition: string;
  domain: DomainType;
  authorizedSource: string;
}

export interface SystemSettings {
  appName: string;
  officialAuthorizationVerified: boolean;
  activeModel: string;
  strictRagMode: boolean;
  voiceProvider: string;
  telephonyGatewayUri: string;
  auditRetentionDays: number;
}
