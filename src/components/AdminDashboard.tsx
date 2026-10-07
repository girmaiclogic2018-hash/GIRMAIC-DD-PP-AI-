import React, { useState } from 'react';
import { UserRole, AuditLogItem, LanguageCode } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { INITIAL_AUDIT_LOGS } from '../data/initialData';
import { AnalyticsCharts } from './AnalyticsCharts';
import { AuditLogView } from './AuditLogView';
import { RAGHealthMonitor } from './RAGHealthMonitor';
import { RAGPerformanceView } from './RAGPerformanceView';
import { BarChart3, Shield, Users, FileText, Lock, Activity, CheckCircle2 } from 'lucide-react';

interface AdminDashboardProps {
  userRole: UserRole;
  language: LanguageCode;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ userRole, language }) => {
  const t = TRANSLATIONS[language];
  const [auditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            <span>Secure Administrator Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Role-Based Access Control: Current Role — <span className="text-amber-400 font-semibold">{userRole}</span></p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-emerald-300 font-mono font-semibold">SECURE SSL // HSM ACTIVE</span>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="text-xs text-slate-400 font-medium">Total Questions Answered</div>
          <div className="text-2xl font-bold font-mono text-white">1,428</div>
          <div className="text-[10px] text-emerald-400">99.4% Verified RAG Accuracy</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="text-xs text-slate-400 font-medium">Active Languages</div>
          <div className="text-2xl font-bold font-mono text-white">5 Languages</div>
          <div className="text-[10px] text-slate-400">Amharic, English, Oromo, Somali, Tigrinya</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="text-xs text-slate-400 font-medium">Human Escalations</div>
          <div className="text-2xl font-bold font-mono text-amber-400">2 Active</div>
          <div className="text-[10px] text-amber-300">Requires officer response</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="text-xs text-slate-400 font-medium">Knowledge Base Documents</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">6 Authorized</div>
          <div className="text-[10px] text-slate-400">Levels 1-3 Verified</div>
        </div>
      </div>

      {/* Real-time RAG Pipeline Health & Connectivity Monitor */}
      <RAGHealthMonitor />

      {/* RAG Performance & Optimization Telemetry View */}
      <RAGPerformanceView />

      {/* Analytics Charts Visualizations */}
      <AnalyticsCharts />

      {/* Observability Audit Log View */}
      <AuditLogView />

      {/* Audit Logs */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span>System Security & Audit Logs</span>
        </h3>
        <div className="space-y-2">
          {auditLogs.map(log => (
            <div key={log.id} className="bg-slate-900 border border-slate-700/60 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400">{log.id}</span>
                <span className="text-slate-300 font-medium">{log.action}</span>
                <span className="text-slate-400 hidden md:inline">({log.details})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-mono">{log.userId}</span>
                <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
