import React, { useState, useEffect } from 'react';
import { LanguageCode, UserRole, KnowledgeDocument, EscalationTicket } from './types';
import { INITIAL_DOCUMENTS, INITIAL_ESCALATIONS } from './data/initialData';
import { apiGetDocuments, apiGetEscalations } from './services/api';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { ChatView } from './components/ChatView';
import { VoiceView } from './components/VoiceView';
import { PhoneView } from './components/PhoneView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { LanguageView } from './components/LanguageView';
import { EscalationView } from './components/EscalationView';
import { AdminDashboard } from './components/AdminDashboard';
import { TestingSuiteView } from './components/TestingSuiteView';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('chat');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [userRole, setUserRole] = useState<UserRole>('SUPER_ADMIN');

  const [documents, setDocuments] = useState<KnowledgeDocument[]>(INITIAL_DOCUMENTS);
  const [escalations, setEscalations] = useState<EscalationTicket[]>(INITIAL_ESCALATIONS);

  useEffect(() => {
    // Fetch initial documents and escalations from backend API
    apiGetDocuments().then(docs => {
      if (docs && docs.length > 0) setDocuments(docs);
    });
    apiGetEscalations().then(escs => {
      if (escs && escs.length > 0) setEscalations(escs);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 xl:pb-0">
      <DisclaimerBanner />
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      <main className="flex-1">
        {currentTab === 'chat' && (
          <ChatView
            language={language}
            documents={documents}
            escalations={escalations}
            setEscalations={setEscalations}
            setCurrentTab={setCurrentTab}
          />
        )}
        {currentTab === 'voice' && (
          <VoiceView language={language} documents={documents} />
        )}
        {currentTab === 'phone' && <PhoneView />}
        {currentTab === 'kb' && (
          <KnowledgeBaseView
            documents={documents}
            setDocuments={setDocuments}
            language={language}
            userRole={userRole}
          />
        )}
        {currentTab === 'languages' && (
          <LanguageView language={language} setLanguage={setLanguage} />
        )}
        {currentTab === 'escalations' && (
          <EscalationView
            escalations={escalations}
            setEscalations={setEscalations}
            language={language}
          />
        )}
        {currentTab === 'admin' && (
          <AdminDashboard userRole={userRole} language={language} />
        )}
        {currentTab === 'testing' && (
          <TestingSuiteView language={language} />
        )}
      </main>

      <MobileNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
      />
    </div>
  );
}

export default App;
