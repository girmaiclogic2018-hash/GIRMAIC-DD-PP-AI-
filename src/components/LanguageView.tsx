import React, { useState } from 'react';
import { LanguageCode, TerminologyItem } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { INITIAL_TERMINOLOGY } from '../data/initialData';
import { Globe, Book, Search } from 'lucide-react';

interface LanguageViewProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

export const LanguageView: React.FC<LanguageViewProps> = ({ language, setLanguage }) => {
  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = INITIAL_TERMINOLOGY.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Multilingual & Controlled Terminology Dictionary</h2>
            <p className="text-xs text-slate-400">Supporting Amharic, English, Afaan Oromo, Somali, and Tigrinya with strict official definitions.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {[
            { code: 'en', label: 'English' },
            { code: 'am', label: 'አማርኛ' },
            { code: 'om', label: 'Afaan Oromo' },
            { code: 'so', label: 'Soomaali' },
            { code: 'ti', label: 'ትግርኛ' },
          ].map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code as LanguageCode)}
              className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                language === lang.code
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Book className="w-5 h-5 text-emerald-400" />
            <span>Controlled Political & Legal Terminology</span>
          </h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search terminology..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredTerms.map(item => (
            <div key={item.id} className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{item.term}</span>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                  {item.language.toUpperCase()} | {item.domain}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.definition}</p>
              <div className="text-[10px] text-slate-400 font-medium">Authorized Source: {item.authorizedSource}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
