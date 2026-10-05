import { KnowledgeDocument, EscalationTicket, AuditLogItem, TerminologyItem, SystemSettings } from '../types';

export const INITIAL_SETTINGS: SystemSettings = {
  appName: 'GIRMAIC DD-PP AI',
  officialAuthorizationVerified: false,
  activeModel: 'gemini-3.8-flash',
  strictRagMode: true,
  voiceProvider: 'WebSpeech / Gemini TTS Adapter',
  telephonyGatewayUri: 'sip://gateway.diredawapp.org:5060',
  auditRetentionDays: 365,
};

export const INITIAL_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'DOC-PP-001',
    title: 'Prosperity Party Core Principles & Organizational Bylaws (2025 Edition)',
    source: 'Prosperity Party Central Secretariat',
    organization: 'Prosperity Party',
    documentType: 'POLICY',
    domain: 'DOMAIN_A',
    level: 1,
    language: 'en',
    version: 'v3.2',
    effectiveDate: '2025-01-15',
    uploadedBy: 'admin_central',
    reviewedBy: 'review_lead',
    approvedBy: 'approver_exec',
    approvalStatus: 'PUBLISHED',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-15T09:30:00Z',
    checksum: 'a8f9c2e14b3d7f8a9e01c2d3e4f5a6b7',
    summary: 'Defines the foundational democratic developmental state principles, unity in diversity, transparency, and member code of conduct for Prosperity Party.',
    content: `Prosperity Party (PP) is founded on the principles of multinational federalism, democratic unity, and citizen prosperity. 
Section 1: Core Values. The party champions inclusivity, equitable development, anti-corruption, and adherence to the Federal Democratic Republic of Ethiopia (FDRE) Constitution.
Section 2: Organizational Structure. Consists of Congress, Central Committee, Executive Committee, and Regional Branch Offices including Dire Dawa, Addis Ababa, Oromia, Amhara, Somali, Afar, Tigray, Benishangul-Gumuz, Gambela, Sidama, and South Ethiopia regional branches.
Section 3: Membership Ethics. All members must uphold organizational discipline, public service ethics, and respect for rule of law.`
  },
  {
    id: 'DOC-PP-002',
    title: 'የብልጽግና ፓርቲ መሰረታዊ መርሆዎች እና የአሰራር ደንቦች',
    source: 'Prosperity Party Central Secretariat',
    organization: 'Prosperity Party',
    documentType: 'POLICY',
    domain: 'DOMAIN_A',
    level: 1,
    language: 'am',
    version: 'v3.2',
    effectiveDate: '2025-01-15',
    uploadedBy: 'admin_central',
    approvedBy: 'approver_exec',
    approvalStatus: 'PUBLISHED',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-15T09:30:00Z',
    checksum: 'b9e8d3f25c4e8a9b1c2d3e4f5a6b7c8d',
    summary: 'የብልጽግና ፓርቲ ዴሞክራሲያዊፌዴራሊዝም፣ ሁሉን አቀፍ ልማት እና የአባልነት ስነ-ምግባር ደንቦች።',
    content: `ብልጽግና ፓርቲ በብሔራዊ ፌዴራሊዝም፣ በዴሞክራሲያዊ አንድነት እና በዜጎች ሁለንተናዊ ብልጽግና ላይ የተመሰረተ ነው።
ክፍል 1፡ ዋና ዋና እሴቶች። ፓርቲው አካታችነትን፣ ፍትሃዊ ልማትን፣ ሙስናን መዋጋትን እና የኢፌዴሪ ህገ-መንግስት ማክበርን ይመራል።
ክፍል 2፡ የአስተዳደር መዋቅር። ጉባኤ፣ ማዕከላዊ ኮሚቴ፣ ስራ አስፈፃሚ እና የድሬዳዋን ጨምሮ የክልል ቅርንጫፍ ጽህፈት ቤቶችን ያካትታል።`
  },
  {
    id: 'DOC-DD-101',
    title: 'Dire Dawa Prosperity Party Branch Strategic Development & Public Service Directive',
    source: 'Dire Dawa Administration Prosperity Party Branch Office',
    organization: 'Dire Dawa Prosperity Party',
    documentType: 'REGULATION',
    domain: 'DOMAIN_B',
    level: 2,
    language: 'en',
    version: 'v2.1',
    effectiveDate: '2025-03-01',
    uploadedBy: 'dd_admin',
    reviewedBy: 'dd_reviewer',
    approvedBy: 'dd_approver',
    approvalStatus: 'PUBLISHED',
    createdAt: '2025-02-20T10:00:00Z',
    updatedAt: '2025-03-01T11:00:00Z',
    checksum: 'c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
    summary: 'Outlines Dire Dawa branch priorities for urban infrastructure, youth empowerment, trade facilitation, and transparent public grievance handling.',
    content: `Dire Dawa Prosperity Party Branch Directive 2025/2026.
Section 1: Urban Development. Focus on expanding potable water supply, asphalt and cobblestone road connectivity across urban kebeles and rural kebeles (Gotta).
Section 2: Youth & Women Employment. Strengthening vocational training centers, micro and small enterprise (MSE) financing support, and digital literacy hubs.
Section 3: Citizen Grievance Redress. Mandating weekly public town halls and digital feedback desks across all 9 urban districts and 3 agricultural administrative units.`
  },
  {
    id: 'DOC-DD-102',
    title: 'የድሬዳዋ ብልጽግና ፓርቲ ቅርንጫፍ ጽህፈት ቤት የልማት እና የአገልግሎት መመሪያ',
    source: 'Dire Dawa Administration Prosperity Party Branch Office',
    organization: 'Dire Dawa Prosperity Party',
    documentType: 'REGULATION',
    domain: 'DOMAIN_B',
    level: 2,
    language: 'am',
    version: 'v2.1',
    effectiveDate: '2025-03-01',
    uploadedBy: 'dd_admin',
    approvedBy: 'dd_approver',
    approvalStatus: 'PUBLISHED',
    createdAt: '2025-02-20T10:00:00Z',
    updatedAt: '2025-03-01T11:00:00Z',
    checksum: 'd8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3',
    summary: 'የድሬዳዋ ከተማ አስተዳደር ብልጽግና ፓርቲ ቅርንጫፍ የከተማ ልማት፣ የስራ እድል ፈጠራ እና የአገልግሎት አሰጣጥ መመሪያ።',
    content: `የድሬዳዋ ብልጽግና ፓርቲ ቅርንጫፍ መመሪያ 2017 ዓ.ም.
ክፍል 1፡ የከተማ ልማት። የንጹህ ውሃ አቅርቦት፣ የውስጥ ለውስጥ የመንገድ ግንባታ እና በከተማና ገጠር ቀበሌዎች የሚደረጉ የልማት ስራዎች።
ክፍል 2፡ የወጣቶችና ሴቶች ስራ እድል ፈጠራ። የሙያ ስልጠና ማዕከላት ማጠናከር እና ለአነስተኛና ጥቃቅን ኢንተርፕራይዞች የሚደረግ ድጋፍ።`
  },
  {
    id: 'DOC-CS-201',
    title: 'Ethiopian Customs Commission Import & Export Regulations Summary',
    source: 'Ethiopian Customs Commission Head Office',
    organization: 'Ethiopian Customs Commission',
    documentType: 'LAW',
    domain: 'DOMAIN_C',
    level: 3,
    language: 'en',
    version: 'v4.0',
    effectiveDate: '2024-07-01',
    uploadedBy: 'customs_admin',
    reviewedBy: 'customs_legal',
    approvedBy: 'customs_dg',
    approvalStatus: 'PUBLISHED',
    createdAt: '2024-06-15T09:00:00Z',
    updatedAt: '2024-07-01T10:00:00Z',
    checksum: 'e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4',
    summary: 'Official guidelines regarding customs declaration, duty-free privileges, prohibited imports, and clearance procedures at Dire Dawa dry port and customs branch.',
    content: `Ethiopian Customs Commission Directive on Clearance Procedures.
Section 1: Customs Declaration. All commercial imports must be accompanied by accurate commercial invoices, bills of lading, packing lists, and tax identification numbers (TIN) registered with Ministry of Revenues.
Section 2: Dire Dawa Dry Port Operations. Facilitating transit cargo from Djibouti port, customs warehousing, and expedited inspection for capital goods and agricultural inputs.
Section 3: Prohibited & Restricted Goods. Narcotics, counterfeit currency, unlicensed firearms, and hazardous chemicals are strictly prohibited.`
  },
  {
    id: 'DOC-LAW-301',
    title: 'Federal Democratic Republic of Ethiopia (FDRE) Proclamation on Public Organizations & Access to Information',
    source: 'Federal Negarit Gazette',
    organization: 'Federal Government of Ethiopia',
    documentType: 'LAW',
    domain: 'DOMAIN_D',
    level: 3,
    language: 'en',
    version: 'v1.0',
    effectiveDate: '2020-02-10',
    uploadedBy: 'legal_admin',
    approvedBy: 'legal_approver',
    approvalStatus: 'PUBLISHED',
    createdAt: '2020-02-01T00:00:00Z',
    updatedAt: '2020-02-10T00:00:00Z',
    checksum: 'f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5',
    summary: 'Legal framework guaranteeing citizens right to access public information while protecting national security, privacy, and official state secrets.',
    content: `FDRE Proclamation on Freedom of Information and Public Accountability.
Article 1: Right to Information. Every citizen has the right to seek and receive non-confidential public information from authorized government and party institutions.
Article 2: Limitations. Information affecting ongoing criminal investigations, national defense, commercial confidentiality, or personal privacy is restricted.`
  }
];

export const INITIAL_ESCALATIONS: EscalationTicket[] = [
  {
    id: 'ESC-2026-001',
    userId: 'user_991',
    userName: 'Abebe Kebede',
    question: 'What is the official procedure for obtaining agricultural fertilizer subsidy in Dire Dawa rural kebeles?',
    language: 'am',
    timestamp: '2026-10-04T14:20:00Z',
    category: 'Agricultural Policy & Subsidy',
    aiAnswer: 'I could not verify specific fertilizer quota allocation rules for the current season in the authorized knowledge base.',
    sourceStatus: 'NOT VERIFIED',
    assignedOfficer: 'Officer Mohamed Dire',
    status: 'IN_PROGRESS',
  },
  {
    id: 'ESC-2026-002',
    userId: 'user_442',
    userName: 'Fatuma Ali',
    question: 'Inquire about customs duty exemption rules for educational equipment imported by Dire Dawa non-profit associations.',
    language: 'en',
    timestamp: '2026-10-05T09:10:00Z',
    category: 'Customs & Duty Exemption',
    aiAnswer: 'Referenced Ethiopian Customs Commission general regulations, but specific NGO exemption criteria require manual officer review.',
    sourceStatus: 'PARTIALLY VERIFIED',
    assignedOfficer: 'Officer Tadesse Worku',
    status: 'ASSIGNED',
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'AUD-901',
    timestamp: '2026-10-05T11:00:00Z',
    userId: 'admin_central',
    userRole: 'SUPER_ADMIN',
    action: 'SYSTEM_INITIALIZATION',
    details: 'Initialized GIRMAIC DD-PP AI knowledge base and RAG indexing pipeline.',
    ipAddress: '192.168.1.50',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-902',
    timestamp: '2026-10-05T11:05:22Z',
    userId: 'officer_dd',
    userRole: 'OFFICER',
    action: 'RAG_QUERY',
    details: 'Queried Dire Dawa branch youth employment initiatives in English.',
    ipAddress: '192.168.1.88',
    status: 'SUCCESS'
  }
];

export const INITIAL_TERMINOLOGY: TerminologyItem[] = [
  {
    id: 'TERM-01',
    term: 'Democratic Developmental State',
    language: 'en',
    definition: 'A governance model prioritizing rapid equitable economic growth, public infrastructure investment, and poverty reduction under democratic rule.',
    domain: 'DOMAIN_A',
    authorizedSource: 'Prosperity Party Bylaws'
  },
  {
    id: 'TERM-02',
    term: 'ዴሞክራሲያዊ ልማታዊ መንግስት',
    language: 'am',
    definition: 'ህዝብን ማዕከል ባደረገ የልማት ፍጥነት፣ የኢኮኖሚ እድገት እና የዴሞክራሲ ስርዓት ግንባታ ላይ የተመሰረተ የአስተዳደር ጽንሰ-ሀሳብ።',
    domain: 'DOMAIN_A',
    authorizedSource: 'የብልጽግና ፓርቲ መሰረታዊ ሰነድ'
  },
  {
    id: 'TERM-03',
    term: 'Dry Port Customs Clearance',
    language: 'en',
    definition: 'The official process of inspecting, assessing duties, and releasing cargo at inland logistics terminals such as Dire Dawa Dry Port.',
    domain: 'DOMAIN_C',
    authorizedSource: 'Ethiopian Customs Commission Proclamation'
  }
];
