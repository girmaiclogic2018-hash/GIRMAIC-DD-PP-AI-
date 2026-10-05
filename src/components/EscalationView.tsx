import React from 'react';
import { EscalationTicket, LanguageCode } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { UserCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface EscalationViewProps {
  escalations: EscalationTicket[];
  setEscalations: React.Dispatch<React.SetStateAction<EscalationTicket[]>>;
  language: LanguageCode;
}

export const EscalationView: React.FC<EscalationViewProps> = ({ escalations, setEscalations, language }) => {
  const t = TRANSLATIONS[language];

  const handleStatusChange = (id: string, newStatus: EscalationTicket['status']) => {
    setEscalations(prev => prev.map(esc => {
      if (esc.id === id) {
        return { ...esc, status: newStatus };
      }
      return esc;
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-amber-400" />
            <span>Human Officer Escalation Queue</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Managing citizen inquiries requiring official human review, legal determination, or dispute resolution.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-center">
          <div className="text-xs text-slate-400">Total Tickets</div>
          <div className="text-lg font-bold font-mono text-amber-400">{escalations.length}</div>
        </div>
      </div>

      <div className="space-y-4">
        {escalations.map(ticket => (
          <div key={ticket.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-slate-900 text-amber-400 px-2.5 py-1 rounded border border-slate-700">
                  {ticket.id}
                </span>
                <span className="text-xs text-slate-300 font-medium">{ticket.userName} ({ticket.category})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  ticket.status === 'RESOLVED'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : ticket.status === 'IN_PROGRESS'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {ticket.status}
                </span>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(ticket.id, e.target.value as EscalationTicket['status'])}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/60 text-sm text-slate-100">
              <strong>Question:</strong> {ticket.question}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 pt-1">
              <div>Assigned Officer: <span className="text-white font-medium">{ticket.assignedOfficer}</span></div>
              <div>Submitted: {new Date(ticket.timestamp).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
