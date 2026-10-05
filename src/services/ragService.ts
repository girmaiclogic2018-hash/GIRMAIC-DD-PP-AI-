import { apiSendChatMessage } from './api';
import { RAGResult } from '../utils/ragEngine';
import { LanguageCode } from '../types';

export async function fetchRAGResponse(prompt: string, language: LanguageCode): Promise<RAGResult> {
  return await apiSendChatMessage(prompt, language);
}
