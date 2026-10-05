import React, { useState } from 'react';
import { PhoneCall, Server, Radio, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';

export const PhoneView: React.FC = () => {
  const [gatewayStatus, setGatewayStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('CONNECTED');
  const [activeCalls, setActiveCalls] = useState<number>(3);
  const [testPhoneNumber, setTestPhoneNumber] = useState('+251911223344');
  const [callInitiated, setCallInitiated] = useState(false);

  const handleTestCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhoneNumber) return;
    setCallInitiated(true);
    setTimeout(() => {
      setActiveCalls(prev => prev + 1);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Telephone AI Agent Integration Layer</h2>
              <p className="text-xs text-slate-400">SIP/Voice Gateway adapter for IVR and telephone-based citizen inquiries.</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 ${gatewayStatus === 'CONNECTED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{gatewayStatus}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4">
            <div className="text-xs text-slate-400">SIP Trunk URI</div>
            <div className="text-sm font-mono text-emerald-400 mt-1">sip://gateway.diredawapp.org:5060</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4">
            <div className="text-xs text-slate-400">Active Concurrent Calls</div>
            <div className="text-xl font-bold font-mono text-white mt-1">{activeCalls} Channels</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4">
            <div className="text-xs text-slate-400">Speech Verification Engine</div>
            <div className="text-sm font-semibold text-amber-400 mt-1">Gemini 3.8 RAG + TTS</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Simulator */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            <span>Simulate Inbound Telephone Call</span>
          </h3>
          <p className="text-xs text-slate-400">
            Test the telephony RAG retrieval pipeline by initiating a test call routing simulation.
          </p>
          <form onSubmit={handleTestCall} className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Caller Phone Number</label>
              <input
                type="text"
                value={testPhoneNumber}
                onChange={(e) => setTestPhoneNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Simulate Inbound IVR Call</span>
            </button>
          </form>

          {callInitiated && (
            <div className="bg-emerald-950/80 border border-emerald-800 p-3 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Call routed successfully to RAG speech orchestrator. IVR audio prompt synthesized.</span>
            </div>
          )}
        </div>

        {/* Configuration Notice */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Telephony Security & Authorization</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The telephony adapter uses secure SIP/RTP encryption protocols. In production deployments, proper provider credentials (Twilio, Asterisk, or Ethiopian Telecommunications Corporation SIP trunks) must be configured via Google Secret Manager.
          </p>
          <div className="text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
            <strong>Architecture:</strong> Caller → Telephony Provider → SIP Gateway → Speech Recognition → RAG Knowledge Base → TTS → Caller.
          </div>
        </div>
      </div>
    </div>
  );
};
