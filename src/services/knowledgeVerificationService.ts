import { Citation, VerificationStatus, KnowledgeDocument } from '../types';
import { logger } from './logger';

export interface VerificationResult {
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  confidenceScore: string;
  flaggedWarnings: string[];
}

class KnowledgeVerificationService {
  /**
   * Validates AI response text and citations against authoritative source hierarchy.
   */
  public validateResponse(
    answer: string,
    citations: Citation[],
    availableDocuments: KnowledgeDocument[]
  ): VerificationResult {
    const warnings: string[] = [];
    let status: VerificationStatus = 'VERIFIED';

    // 1. Check if citations are present
    if (!citations || citations.length === 0) {
      status = 'NOT VERIFIED';
      warnings.push('CRITICAL: Response contains zero authorized source citations (NO SOURCE = NO CLAIM violation risk).');
      logger.warn('RAG', 'KnowledgeVerificationService flagged response with zero citations', { answer });
      return {
        isVerified: false,
        verificationStatus: status,
        confidenceScore: '0% (Ungrounded)',
        flaggedWarnings: warnings,
      };
    }

    // 2. Validate citation against authorized documents
    let validCitationsCount = 0;
    for (const cite of citations) {
      const match = availableDocuments.find(d => d.id === cite.documentId || d.title.toLowerCase().includes(cite.title.toLowerCase()));
      if (match) {
        validCitationsCount++;
      } else {
        warnings.push(`Warning: Citation [${cite.documentId} - ${cite.title}] could not be matched to an active authorized document in the knowledge base.`);
      }
    }

    if (validCitationsCount === 0) {
      status = 'NOT VERIFIED';
      logger.error('RAG', 'KnowledgeVerificationService: All citations failed verification against knowledge base', { citations });
      return {
        isVerified: false,
        verificationStatus: 'NOT VERIFIED',
        confidenceScore: '15% (Low Groundedness)',
        flaggedWarnings: warnings,
      };
    }

    // 3. Determine status based on source hierarchy levels
    const highestPriorityLevel = Math.min(...citations.map(c => c.level || 6));
    if (highestPriorityLevel <= 2) {
      status = 'VERIFIED';
      logger.info('RAG', 'KnowledgeVerificationService validated response against Priority Level 1-2 source', { level: highestPriorityLevel });
    } else if (highestPriorityLevel <= 4) {
      status = 'PARTIALLY VERIFIED';
      logger.info('RAG', 'KnowledgeVerificationService validated response against Priority Level 3-4 source', { level: highestPriorityLevel });
    } else {
      status = 'REQUIRES HUMAN REVIEW';
      warnings.push('Notice: Response relies on general or lower-priority reference materials.');
    }

    return {
      isVerified: status === 'VERIFIED' || status === 'PARTIALLY VERIFIED',
      verificationStatus: status,
      confidenceScore: highestPriorityLevel <= 2 ? '98.5% (High Groundedness)' : '82.0% (Moderate Groundedness)',
      flaggedWarnings: warnings,
    };
  }
}

export const knowledgeVerificationService = new KnowledgeVerificationService();
