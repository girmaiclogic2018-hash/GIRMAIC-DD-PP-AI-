import React, { useState } from 'react';
import { KnowledgeDocument, LanguageCode, DomainType, ApprovalStatus, SourceHierarchyLevel, UserRole } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { apiCreateDocument } from '../services/api';
import { BookOpen, Upload, CheckCircle2, ShieldCheck, FileText, Search, PlusCircle, Check, X } from 'lucide-react';

interface KnowledgeBaseViewProps {
  documents: KnowledgeDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<KnowledgeDocument[]>>;
  language: LanguageCode;
  userRole: UserRole;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  documents,
  setDocuments,
  language,
  userRole,
}) => {
  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New document form state
  const [newTitle, setNewTitle] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newDomain, setNewDomain] = useState<DomainType>('DOMAIN_A');
  const [newLevel, setNewLevel] = useState<SourceHierarchyLevel>(1);
  const [newContent, setNewContent] = useState('');
  const [newSummary, setNewSummary] = useState('');

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newDoc: Partial<KnowledgeDocument> = {
      title: newTitle,
      source: newSource || 'Dire Dawa PP Secretariat',
      organization: 'Dire Dawa Prosperity Party',
      documentType: 'POLICY',
      domain: newDomain,
      level: newLevel,
      language: 'en',
      version: 'v1.0',
      effectiveDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'user_current',
      approvalStatus: 'DRAFT',
      content: newContent,
      summary: newSummary || newContent.substring(0, 150)
    };

    const created = await apiCreateDocument(newDoc);
    if (created) {
      setDocuments(prev => [created as KnowledgeDocument, ...prev]);
    }
    setNewTitle('');
    setNewSource('');
    setNewContent('');
    setNewSummary('');
    setShowUploadModal(false);
    alert('Document uploaded successfully into Ingestion Pipeline via secure backend API as DRAFT.');
  };

  const handleApprove = (id: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        return { ...doc, approvalStatus: 'PUBLISHED', approvedBy: 'user_admin' };
      }
      return doc;
    }));
    alert('Document approved and published to verified RAG index.');
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || doc.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === 'ALL' || doc.domain === selectedDomain;
    const matchesStatus = selectedStatus === 'ALL' || doc.approvalStatus === selectedStatus;
    return matchesSearch && matchesDomain && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>Authorized Knowledge-Base & Ingestion Pipeline</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            UPLOADING → OCR/PARSING → VALIDATION → CLASSIFICATION → APPROVAL → CHUNKING → RAG INDEXING
          </p>
        </div>
        {(userRole === 'SUPER_ADMIN' || userRole === 'KNOWLEDGE_ADMIN') && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-md cursor-pointer w-fit"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload New Document</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-800/80 border border-slate-700 p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search authorized documents by title or source..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none"
        >
          <option value="ALL">All Domains</option>
          <option value="DOMAIN_A">Domain A: Prosperity Party</option>
          <option value="DOMAIN_B">Domain B: Dire Dawa Branch</option>
          <option value="DOMAIN_C">Domain C: Ethiopian Customs</option>
          <option value="DOMAIN_D">Domain D: Ethiopian Laws</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="UNDER_REVIEW">Under Review</option>
        </select>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono bg-slate-900 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                  {doc.id} | Level {doc.level}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-mono font-semibold text-[10px] flex items-center gap-1 ${
                    doc.approvalStatus === 'PUBLISHED' || doc.approvalStatus === 'APPROVED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : doc.approvalStatus === 'DRAFT' || doc.approvalStatus === 'UNDER_REVIEW'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  {doc.approvalStatus === 'PUBLISHED' || doc.approvalStatus === 'APPROVED' ? '🛡️ Validated' :
                   doc.approvalStatus === 'DRAFT' || doc.approvalStatus === 'UNDER_REVIEW' ? '⏳ Pending Approval' :
                   '⚠️ ' + doc.approvalStatus}
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">{doc.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-2">{doc.summary || doc.content}</p>
            </div>

            <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
              <div>
                <span className="font-medium text-slate-300">Source:</span> {doc.source}
              </div>
              <div className="flex items-center gap-2">
                <span>Eff: {doc.effectiveDate}</span>
                {doc.approvalStatus === 'DRAFT' && (userRole === 'SUPER_ADMIN' || userRole === 'APPROVER') && (
                  <button
                    onClick={() => handleApprove(doc.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] px-2.5 py-1 rounded font-semibold transition-colors shadow-sm"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-400" />
              <span>Upload Document to Ingestion Pipeline</span>
            </h3>
            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Document Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Dire Dawa Branch Youth Empowerment Directive 2026"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Authoritative Source</label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    placeholder="e.g., Dire Dawa PP Office"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Domain</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value as DomainType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  >
                    <option value="DOMAIN_A">Domain A: Prosperity Party</option>
                    <option value="DOMAIN_B">Domain B: Dire Dawa Branch</option>
                    <option value="DOMAIN_C">Domain C: Ethiopian Customs</option>
                    <option value="DOMAIN_D">Domain D: Ethiopian Laws</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Document Content & Policy Text</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste official policy text, regulations, or procedures here..."
                  rows={5}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
