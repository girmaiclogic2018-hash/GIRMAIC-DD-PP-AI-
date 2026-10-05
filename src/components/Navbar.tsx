import React from 'react';
import { LanguageCode, UserRole } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { MessageSquare, Mic, PhoneCall, BookOpen, Globe, Shield, UserCheck, BarChart3, TestTube2 } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  userRole,
  setUserRole,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-4 lg:px-8 py-3 flex items-center justify-between shadow-lg">
      {/* Zone 1: Brand title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 via-amber-600 to-red-600 flex items-center justify-center font-bold text-white shadow-md">
          GD
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
            GIRMAIC DD-PP AI
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono">
              VERIFIED RAG
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">Dire Dawa Prosperity Party Information & Voice Assistant</p>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => setCurrentTab('chat')}
          className={`hover:text-white transition-colors flex items-center gap-1.5 py-1 ${currentTab === 'chat' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.askByText}</span>
        </button>
        <button
          onClick={() => setCurrentTab('voice')}
          className={`hover:text-white transition-colors flex items-center gap-1.5 py-1 ${currentTab === 'voice' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''}`}
        >
          <Mic className="w-4 h-4" />
          <span>{t.askByVoice}</span>
        </button>
        <button
          onClick={() => setCurrentTab('phone')}
          className={`hover:text-white transition-colors flex items-center gap-1.5 py-1 ${currentTab === 'phone' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''}`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>{t.phoneAssistant}</span>
        </button>
        <button
          onClick={() => setCurrentTab('kb')}
          className={`hover:text-white transition-colors flex items-center gap-1.5 py-1 ${currentTab === 'kb' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t.knowledgeBase}</span>
        </button>
        <button
          onClick={() => setCurrentTab('escalations')}
          className={`hover:text-white transition-colors flex items-center gap-1.5 py-1 ${currentTab === 'escalations' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''}`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{t.escalations}</span>
        </button>
        <button
          onClick={() => setCurrentTab('admin')}
          className={`hover:text-white transition-colors flex items-center gap-1.5 py-1 ${currentTab === 'admin' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''}`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{t.adminDashboard}</span>
        </button>
        <button
          onClick={() => setCurrentTab('testing')}
          className={`hover:text-white transition-colors flex items-center gap-1.5 py-1 ${currentTab === 'testing' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' : ''}`}
        >
          <TestTube2 className="w-4 h-4" />
          <span>QA Audit</span>
        </button>
      </nav>

      {/* Zone 3: Actions (Language switcher & Role dropdown) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
          >
            <option value="en" className="bg-slate-900">English</option>
            <option value="am" className="bg-slate-900">አማርኛ (Amharic)</option>
            <option value="om" className="bg-slate-900">Afaan Oromo</option>
            <option value="so" className="bg-slate-900">Soomaali</option>
            <option value="ti" className="bg-slate-900">ትግርኛ (Tigrinya)</option>
          </select>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="bg-transparent text-xs text-amber-300 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="SUPER_ADMIN" className="bg-slate-900">Super Admin</option>
            <option value="KNOWLEDGE_ADMIN" className="bg-slate-900">Knowledge Admin</option>
            <option value="APPROVER" className="bg-slate-900">Approver</option>
            <option value="OFFICER" className="bg-slate-900">Officer</option>
            <option value="AUDITOR" className="bg-slate-900">Auditor</option>
            <option value="READ_ONLY" className="bg-slate-900">Read Only</option>
          </select>
        </div>
      </div>
    </header>
  );
};
