import React, { useState } from 'react';
import { LanguageCode, KnowledgeDocument, ChatMessage, EscalationTicket } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { fetchRAGResponse } from '../services/ragService';
import { Send, Sparkles, CheckCircle2, AlertTriangle, HelpCircle, Volume2, Copy, Share2, UserCheck, BookMarked } from 'lucide-react';

interface ChatViewProps {
  language: LanguageCode;
  documents: KnowledgeDocument[];
  escalations: EscalationTicket[];
  setEscalations: React.Dispatch<React.SetStateAction<EscalationTicket[]>>;
  setCurrentTab: (tab: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ language, documents, escalations, setEscalations, setCurrentTab }) => {
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: language === 'am'
        ? 'ሰላም! እኔ ግርማይ የድሬዳዋ ብልጽግና ፓርቲ መረጃ እና ድምጽ ረዳት ነኝ። ስለ ፓርቲው መርሆዎች፣ የድሬዳዋ ቅርንጫፍ ልማት ወይም የጉምሩክ መመሪያዎች ጥያቄዎትን ይጠይቁ።'
        : 'Hello! I am GIRMAIC DD-PP AI, your verified information and voice assistant for Dire Dawa Prosperity Party and official guidelines. How can I assist you with verified evidence today?',
      language,
      timestamp: new Date().toISOString(),
      verificationStatus: 'VERIFIED'
    }
  ]);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [escalationQuestion, setEscalationQuestion] = useState('');

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isSubmitting) return;

    const userQuery = input.trim();
    setInput('');
    setIsSubmitting(true);

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: userQuery,
      language,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);

    // Process RAG query via secure backend API
    const ragRes = await fetchRAGResponse(userQuery, language);

    const assistantMsg: ChatMessage = {
      id: 'msg-' + (Date.now() + 1),
      sender: 'assistant',
      text: ragRes.answer,
      language,
      timestamp: new Date().toISOString(),
      domain: ragRes.domain,
      citations: ragRes.citations,
      verificationStatus: ragRes.verificationStatus
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsSubmitting(false);
  };

  const handleReadAloud = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'am' ? 'am-ET' : language === 'om' ? 'om-ET' : language === 'so' ? 'so-SO' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Answer copied to clipboard.');
  };

  const handleEscalationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalationQuestion.trim()) return;

    const newTicket: EscalationTicket = {
      id: 'ESC-2026-' + Math.floor(100 + Math.random() * 900),
      userId: 'user_current',
      userName: 'Authorized Citizen',
      question: escalationQuestion,
      language,
      timestamp: new Date().toISOString(),
      category: 'General Inquiry / Official Decision',
      aiAnswer: 'Escalated by user from chat interface.',
      sourceStatus: 'REQUIRES HUMAN REVIEW',
      assignedOfficer: 'Officer Tadesse Worku',
      status: 'OPEN'
    };

    setEscalations(prev => [newTicket, ...prev]);
    setEscalationQuestion('');
    setShowEscalationModal(false);
    alert('Human escalation ticket created successfully. Reference ID: ' + newTicket.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-120px)]">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4 bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Verified Knowledge Assistant (RAG Engine)</span>
          </h2>
          <p className="text-xs text-slate-400">Strict policy: NO SOURCE = NO CLAIM. All answers backed by verified documents.</p>
        </div>
        <button
          onClick={() => setShowEscalationModal(true)}
          className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <UserCheck className="w-4 h-4" />
          <span>{t.speakToHuman}</span>
        </button>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 shadow-sm text-sm ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

              {/* Verification & Citations for Assistant */}
              {msg.sender === 'assistant' && (
                <div className="mt-3 pt-3 border-t border-slate-700/80 space-y-2 text-xs">
                  {/* Verification Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">Verification:</span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-semibold text-[10px] ${
                        msg.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : msg.verificationStatus === 'PARTIALLY VERIFIED'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {msg.verificationStatus || 'VERIFIED'}
                    </span>
                  </div>

                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-700/60 space-y-2">
                      <div className="text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <BookMarked className="w-3.5 h-3.5" />
                          <span>Authorized Source Citations:</span>
                        </span>
                        <span className="text-[10px] text-slate-400">Click bubble to verify in KB</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.citations.map((cite, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentTab('kb')}
                            className="bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-emerald-500 text-xs text-emerald-300 font-mono px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                            title="Click to view source in Knowledge Base"
                          >
                            <span>📚 [{cite.documentId}]</span>
                            <span className="text-slate-300 text-[10px] truncate max-w-[180px]">{cite.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-1 text-slate-400">
                    <button
                      onClick={() => handleReadAloud(msg.text)}
                      className="hover:text-white flex items-center gap-1 bg-slate-700/50 hover:bg-slate-700 px-2 py-1 rounded transition-colors"
                      title="Read Aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.readAloud}</span>
                    </button>
                    <button
                      onClick={() => handleCopy(msg.text)}
                      className="hover:text-white flex items-center gap-1 bg-slate-700/50 hover:bg-slate-700 px-2 py-1 rounded transition-colors"
                      title="Copy Answer"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span>{t.copyAnswer}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {isSubmitting && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic bg-slate-800/40 p-3 rounded-xl w-fit">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>Searching authorized knowledge base and verifying sources...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="mt-2 flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-2xl p-2 shadow-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 px-3 py-2 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting || !input.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors shadow-md flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Human Escalation Modal */}
      {showEscalationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span>Request Human Officer Assistance</span>
            </h3>
            <p className="text-xs text-slate-400">
              If your question involves an official organizational decision, confidential matter, or requires human review, submit an escalation ticket below.
            </p>
            <form onSubmit={handleEscalationSubmit} className="space-y-3">
              <textarea
                value={escalationQuestion}
                onChange={(e) => setEscalationQuestion(e.target.value)}
                placeholder="Describe your question or matter for human review..."
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                required
              />
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEscalationModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-md"
                >
                  Submit Escalation Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
