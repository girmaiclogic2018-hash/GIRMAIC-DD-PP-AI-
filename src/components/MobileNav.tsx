import React from 'react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { MessageSquare, Mic, PhoneCall, BookOpen, UserCheck, BarChart3, HelpCircle } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: LanguageCode;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, setCurrentTab, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 text-white z-50 flex items-center justify-around py-2 px-1 shadow-2xl">
      <button
        onClick={() => setCurrentTab('chat')}
        className={`flex flex-col items-center gap-0.5 text-[10px] ${currentTab === 'chat' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
      >
        <MessageSquare className="w-5 h-5" />
        <span>{t.askByText.split(' ')[0]}</span>
      </button>
      <button
        onClick={() => setCurrentTab('voice')}
        className={`flex flex-col items-center gap-0.5 text-[10px] ${currentTab === 'voice' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
      >
        <Mic className="w-5 h-5" />
        <span>{t.askByVoice.split(' ')[0]}</span>
      </button>
      <button
        onClick={() => setCurrentTab('kb')}
        className={`flex flex-col items-center gap-0.5 text-[10px] ${currentTab === 'kb' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
      >
        <BookOpen className="w-5 h-5" />
        <span>KB</span>
      </button>
      <button
        onClick={() => setCurrentTab('faq')}
        className={`flex flex-col items-center gap-0.5 text-[10px] ${currentTab === 'faq' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
      >
        <HelpCircle className="w-5 h-5" />
        <span>FAQ</span>
      </button>
      <button
        onClick={() => setCurrentTab('escalations')}
        className={`flex flex-col items-center gap-0.5 text-[10px] ${currentTab === 'escalations' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
      >
        <UserCheck className="w-5 h-5" />
        <span>Human</span>
      </button>
      <button
        onClick={() => setCurrentTab('admin')}
        className={`flex flex-col items-center gap-0.5 text-[10px] ${currentTab === 'admin' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
      >
        <BarChart3 className="w-5 h-5" />
        <span>Admin</span>
      </button>
    </div>
  );
};
