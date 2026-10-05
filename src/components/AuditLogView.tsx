import React, { useState } from 'react';
import { logger, LogEntry } from '../services/logger';
import { Search, Terminal, BookMarked, ShieldCheck } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(() => logger.getRecentLogs());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const refreshLogs = () => {
    setLogs(logger.getRecentLogs());
  };

  const filteredLogs = logs.filter(log => {
    const matchesCategory = selectedCategory === 'ALL' || log.category === selectedCategory;
    const matchesLevel = selectedLevel === 'ALL' || log.level === selectedLevel;
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || JSON.stringify(log.details || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">System Observability & RAG Transparency Audit Logs</h3>
        </div>
        <button
          onClick={refreshLogs}
          className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer w-fit"
        >
          Refresh Logs
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit logs by query, citations, or confidence..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          <option value="API">API</option>
          <option value="UI">UI</option>
          <option value="RAG">RAG</option>
          <option value="AUTH">AUTH</option>
          <option value="SYSTEM">SYSTEM</option>
        </select>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none"
        >
          <option value="ALL">All Levels</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
        </select>
      </div>

      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs italic">No matching audit logs found.</div>
        ) : (
          filteredLogs.map(log => {
            const details = log.details || {};
            const confidenceScore = details.confidenceScore;
            const citations = details.citations;

            return (
              <div key={log.id} className="bg-slate-900 border border-slate-700/60 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      log.level === 'ERROR' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      log.level === 'WARN' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {log.level}
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold">[{log.category}]</span>
                    <span className="text-slate-200 font-medium">{log.message}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>

                {/* Explicit Source Confidence & Citations Display */}
                {(confidenceScore || (citations && citations.length > 0)) && (
                  <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800 space-y-2">
                    {confidenceScore && (
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-400 font-medium">Source Confidence Score:</span>
                        <span className="text-emerald-300 font-mono font-bold">{confidenceScore}</span>
                      </div>
                    )}
                    {citations && citations.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-slate-400 font-medium flex items-center gap-1.5">
                          <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                          <span>Retrieved Document Citations:</span>
                        </div>
                        {citations.map((cite: any, idx: number) => (
                          <div key={idx} className="text-slate-300 font-mono text-[11px] pl-5">
                            • {cite.title} <span className="text-slate-400">({cite.source} | Level {cite.level} | {cite.effectiveDate})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {log.details && (!confidenceScore && (!citations || citations.length === 0)) && (
                  <pre className="text-[10px] font-mono bg-slate-950 p-2 rounded text-slate-300 overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
