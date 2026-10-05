import { KnowledgeDocument, Citation, VerificationStatus, DomainType, LanguageCode } from '../types';

export interface RAGResult {
  answer: string;
  citations: Citation[];
  verificationStatus: VerificationStatus;
  domain: DomainType;
  conflictDetected: boolean;
}

export function detectDomain(query: string): DomainType {
  const q = query.toLowerCase();
  if (q.includes('customs') || q.includes('import') || q.includes('export') || q.includes('duty') || q.includes('port') || q.includes('ጉምሩክ') || q.includes('ዕቃ') || q.includes('gumruuk')) {
    return 'DOMAIN_C';
  }
  if (q.includes('dire dawa') || q.includes('dd') || q.includes('branch') || q.includes('kebele') || q.includes('ድሬዳዋ') || q.includes('ከተማ አስተዳደር') || q.includes('Dire Dawa')) {
    return 'DOMAIN_B';
  }
  if (q.includes('law') || q.includes('constitution') || q.includes('proclamation') || q.includes('rights') || q.includes('ህግ') || q.includes('ህገ-መንግስት') || q.includes('seera')) {
    return 'DOMAIN_D';
  }
  if (q.includes('prosperity') || q.includes('party') || q.includes('pp') || q.includes('bylaws') || q.includes('ብልጽግና') || q.includes('ፓርቲ') || q.includes('paartii')) {
    return 'DOMAIN_A';
  }
  return 'DOMAIN_E';
}

export function checkPromptInjection(query: string): boolean {
  const q = query.toLowerCase();
  const injectionKeywords = [
    'ignore previous instructions',
    'system prompt',
    'reveal prompt',
    'bypass verification',
    'override administrator',
    'pretend to be official',
    'act as government',
    'secret key',
    'api_key'
  ];
  return injectionKeywords.some(keyword => q.includes(keyword));
}

export async function processRAGQuery(
  query: string,
  language: LanguageCode,
  documents: KnowledgeDocument[]
): Promise<RAGResult> {
  // 1. Check prompt injection
  if (checkPromptInjection(query)) {
    return {
      answer: 'Security policy violation detected. I am programmed strictly to retrieve authorized information from verified knowledge bases and cannot execute instruction overrides or prompt disclosures.',
      citations: [],
      verificationStatus: 'NOT VERIFIED',
      domain: 'DOMAIN_E',
      conflictDetected: false
    };
  }

  const domain = detectDomain(query);
  const lowerQuery = query.toLowerCase();
  const searchKeywords = lowerQuery.split(/\s+/).filter(w => w.length > 2);

  // Filter docs matching domain or relevant keywords
  const matchedDocs = documents.filter(doc => {
    if (doc.approvalStatus !== 'PUBLISHED' && doc.approvalStatus !== 'APPROVED') return false;
    if (doc.domain === domain) return true;
    const contentLower = (doc.title + ' ' + doc.content + ' ' + doc.summary).toLowerCase();
    return searchKeywords.some(kw => contentLower.includes(kw));
  });

  if (matchedDocs.length === 0) {
    return {
      answer: 'I could not verify this information from the authorized knowledge base, so I will not guess. Please contact a human officer or submit an escalation ticket for official verification.',
      citations: [],
      verificationStatus: 'NOT VERIFIED',
      domain,
      conflictDetected: false
    };
  }

  // Select top 2 matched docs
  const primaryDoc = matchedDocs[0];
  const secondaryDoc = matchedDocs[1];

  let verificationStatus: VerificationStatus = 'VERIFIED';
  if (matchedDocs.length === 1 && searchKeywords.length > 3) {
    verificationStatus = 'PARTIALLY VERIFIED';
  }

  // Check potential conflict if 2+ docs
  let conflictDetected = false;
  if (secondaryDoc && primaryDoc.domain !== secondaryDoc.domain) {
    conflictDetected = true;
    verificationStatus = 'REQUIRES HUMAN REVIEW';
    return {
      answer: 'There are conflicting sources in the knowledge base between Prosperity Party guidelines and administrative records. The current information requires human verification.',
      citations: [
        {
          documentId: primaryDoc.id,
          title: primaryDoc.title,
          source: primaryDoc.source,
          level: primaryDoc.level,
          domain: primaryDoc.domain,
          version: primaryDoc.version,
          effectiveDate: primaryDoc.effectiveDate,
          verificationStatus: 'VERIFIED'
        },
        {
          documentId: secondaryDoc.id,
          title: secondaryDoc.title,
          source: secondaryDoc.source,
          level: secondaryDoc.level,
          domain: secondaryDoc.domain,
          version: secondaryDoc.version,
          effectiveDate: secondaryDoc.effectiveDate,
          verificationStatus: 'VERIFIED'
        }
      ],
      verificationStatus,
      domain,
      conflictDetected: true
    };
  }

  // Generate answer based on primaryDoc content snippet
  const snippet = primaryDoc.summary || primaryDoc.content.substring(0, 300);
  const synthesizedAnswer = `Based on authorized document [${primaryDoc.id}] (${primaryDoc.title}), effective ${primaryDoc.effectiveDate}: ${snippet}`;

  const citations: Citation[] = [
    {
      documentId: primaryDoc.id,
      title: primaryDoc.title,
      source: primaryDoc.source,
      level: primaryDoc.level,
      domain: primaryDoc.domain,
      version: primaryDoc.version,
      effectiveDate: primaryDoc.effectiveDate,
      section: 'Section 1',
      verificationStatus
    }
  ];

  return {
    answer: synthesizedAnswer,
    citations,
    verificationStatus,
    domain,
    conflictDetected: false
  };
}
