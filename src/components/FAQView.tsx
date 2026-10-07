import React, { useState, useEffect } from 'react';
import { apiGetFAQs, PolicyFAQItem } from '../services/api';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookMarked,
  Search,
  ArrowRight,
  X,
  Tag,
  Users,
  FileText,
  Calendar,
  Shield,
  Layers,
  Building2,
} from 'lucide-react';

interface FAQViewProps {
  language: LanguageCode;
  onSelectQuestion?: (question: string) => void;
}

const POPULAR_KEYWORDS = ['Bylaws', 'Customs', 'Youth', 'Federalism', 'Clearance', 'Proclamation'];

export const FAQView: React.FC<FAQViewProps> = ({ language, onSelectQuestion }) => {
  const [faqs, setFaqs] = useState<PolicyFAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>('FAQ-001');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    apiGetFAQs().then(items => {
      setFaqs(items);
      setLoading(false);
    });
  }, []);

  const categories = ['ALL', 'Membership', 'Policy', 'Events', 'Customs', 'Dire Dawa'];

  const getCategoryCount = (cat: string) => {
    if (cat === 'ALL') return faqs.length;
    return faqs.filter(f => f.category === cat).length;
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Membership':
        return <Users className="w-3.5 h-3.5" />;
      case 'Policy':
        return <FileText className="w-3.5 h-3.5" />;
      case 'Events':
        return <Calendar className="w-3.5 h-3.5" />;
      case 'Customs':
        return <Shield className="w-3.5 h-3.5" />;
      case 'Dire Dawa':
        return <Building2 className="w-3.5 h-3.5" />;
      default:
        return <Layers className="w-3.5 h-3.5" />;
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCat = selectedCategory === 'ALL' || faq.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCat;

    const matchesSearch =
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.sourceTitle.toLowerCase().includes(query) ||
      faq.category.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Authorized Policy FAQs & Common Inquiries</h2>
            <p className="text-xs text-slate-400">
              Verified answers to frequent Prosperity Party, Dire Dawa branch, and Customs administration questions.
            </p>
          </div>
        </div>

        {/* Category-based Filtering Tabs */}
        <div className="pt-2 border-t border-slate-700/80">
          <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Filter by Policy Category:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat;
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-emerald-900/30 border border-emerald-500'
                      : 'bg-slate-900 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  <span className={isSelected ? 'text-white' : 'text-emerald-400'}>
                    {getCategoryIcon(cat)}
                  </span>
                  <span>{cat === 'ALL' ? 'All Categories' : cat}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time Keyword Search */}
        <div className="space-y-3 pt-2">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords inside category (e.g. federalism, transfer, dry port, congress)..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                title="Clear keyword search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Keyword Filter Chips & Real-time Count */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" />
                <span>Popular:</span>
              </span>
              {POPULAR_KEYWORDS.map(keyword => (
                <button
                  key={keyword}
                  onClick={() => setSearchQuery(keyword)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                    searchQuery.toLowerCase() === keyword.toLowerCase()
                      ? 'bg-emerald-600 text-white border-emerald-500 font-semibold'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  #{keyword}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-mono text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Showing {filteredFaqs.length} FAQs
            </span>
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs italic">Loading verified policy FAQs...</div>
        ) : filteredFaqs.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 text-center text-slate-400 text-xs">
            No questions match your current query or category filter.
          </div>
        ) : (
          filteredFaqs.map(faq => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-md transition-all duration-200"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-700/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-[10px] font-mono bg-slate-900 text-emerald-400 px-2 py-0.5 rounded border border-slate-700 shrink-0">
                      {faq.id}
                    </span>
                    <span className="text-sm font-semibold text-white leading-snug truncate sm:whitespace-normal">
                      {faq.question}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden md:inline-block text-[10px] font-mono text-slate-400">
                      {faq.category}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-700/60 bg-slate-850/50 space-y-3 text-xs">
                    <p className="text-slate-200 leading-relaxed pt-3 text-sm">{faq.answer}</p>

                    <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-slate-300">
                        <BookMarked className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          <strong>Authorized Source:</strong> {faq.sourceTitle} (
                          <span className="font-mono text-emerald-400">{faq.sourceId}</span>)
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 self-start sm:self-auto">
                        {faq.verificationStatus}
                      </span>
                    </div>

                    {onSelectQuestion && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => onSelectQuestion(faq.question)}
                          className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Ask follow-up in Chat</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
