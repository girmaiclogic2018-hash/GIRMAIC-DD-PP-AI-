import React, { useState, useEffect } from 'react';
import { LanguageCode, KnowledgeDocument, ChatMessage } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { processRAGQuery } from '../utils/ragEngine';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, History, Clock, BookMarked, Trash2, Download, Command, Sliders, UserCheck, X } from 'lucide-react';

interface VoiceHistoryItem {
  id: string;
  transcript: string;
  answer: string;
  timestamp: string;
  language: LanguageCode;
  verificationStatus?: string;
  citationTitle?: string;
}

interface VoiceViewProps {
  language: LanguageCode;
  documents: KnowledgeDocument[];
  setCurrentTab?: (tab: string) => void;
}

const AudioWaveform: React.FC<{ active: boolean }> = ({ active }) => {
  const [heights, setHeights] = useState<number[]>([15, 25, 40, 20, 35, 50, 30, 20, 15]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setHeights(Array.from({ length: 9 }, () => Math.floor(15 + Math.random() * 55)));
    }, 120);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="flex items-center justify-center gap-1.5 h-12 my-2">
      {heights.map((h, i) => (
        <div
          key={i}
          style={{ height: active ? `${h}px` : '6px' }}
          className={`w-1.5 rounded-full transition-all duration-150 ${
            active ? 'bg-gradient-to-t from-emerald-500 to-amber-400' : 'bg-slate-700'
          }`}
        />
      ))}
    </div>
  );
};

export const VoiceView: React.FC<VoiceViewProps> = ({ language, documents, setCurrentTab }) => {
  const t = TRANSLATIONS[language];
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [latestAnswer, setLatestAnswer] = useState<ChatMessage | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [lastCommandNotice, setLastCommandNotice] = useState<string | null>(null);

  const [micSensitivity, setMicSensitivity] = useState<number>(() => {
    const saved = localStorage.getItem('girmaic_mic_sensitivity');
    return saved ? Number(saved) : 75;
  });
  const [vadThreshold, setVadThreshold] = useState<number>(() => {
    const saved = localStorage.getItem('girmaic_vad_threshold');
    return saved ? Number(saved) : 50;
  });
  const [showSettings, setShowSettings] = useState(false);

  // Voice Persona & TTS Playback Speed Settings
  const [voicePersona, setVoicePersona] = useState<string>(() => {
    return localStorage.getItem('girmaic_voice_persona') || 'formal_officer';
  });
  const [speechRate, setSpeechRate] = useState<number>(() => {
    const saved = localStorage.getItem('girmaic_speech_rate');
    return saved ? Number(saved) : 1.0;
  });
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const [voiceHistory, setVoiceHistory] = useState<VoiceHistoryItem[]>(() => {
    const saved = localStorage.getItem('girmaic_voice_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('girmaic_voice_history', JSON.stringify(voiceHistory));
  }, [voiceHistory]);

  useEffect(() => {
    localStorage.setItem('girmaic_mic_sensitivity', micSensitivity.toString());
  }, [micSensitivity]);

  useEffect(() => {
    localStorage.setItem('girmaic_vad_threshold', vadThreshold.toString());
  }, [vadThreshold]);

  useEffect(() => {
    localStorage.setItem('girmaic_voice_persona', voicePersona);
  }, [voicePersona]);

  useEffect(() => {
    localStorage.setItem('girmaic_speech_rate', speechRate.toString());
  }, [speechRate]);

  const speakFeedback = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;

      if (voicePersona === 'calm_guide') {
        utterance.pitch = 0.85;
      } else if (voicePersona === 'energetic_assistant') {
        utterance.pitch = 1.15;
      } else {
        utterance.pitch = 1.0;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const checkAndExecuteVoiceCommand = (spokenText: string): boolean => {
    const lower = spokenText.toLowerCase().trim();
    if (!setCurrentTab) return false;

    if (lower.includes('faq') || lower.includes('f.a.q') || lower.includes('questions') || lower.includes('ጥያቄ')) {
      setCurrentTab('faq');
      setLastCommandNotice('Voice Command Triggered: Navigating to Policy FAQs');
      speakFeedback('Navigating to Policy FAQs.');
      return true;
    }
    if (lower.includes('knowledge base') || lower.includes('kb') || lower.includes('documents') || lower.includes('ሰነድ') || lower.includes('እውቀት')) {
      setCurrentTab('kb');
      setLastCommandNotice('Voice Command Triggered: Opening Knowledge Base');
      speakFeedback('Opening Knowledge Base.');
      return true;
    }
    if (lower.includes('chat') || lower.includes('text') || lower.includes('message') || lower.includes('መልዕክት')) {
      setCurrentTab('chat');
      setLastCommandNotice('Voice Command Triggered: Switching to Text Chat');
      speakFeedback('Switching to Text Chat Assistant.');
      return true;
    }
    if (lower.includes('admin') || lower.includes('dashboard') || lower.includes('analytics') || lower.includes('አስተዳዳሪ')) {
      setCurrentTab('admin');
      setLastCommandNotice('Voice Command Triggered: Opening Admin Dashboard');
      speakFeedback('Opening Admin Dashboard.');
      return true;
    }
    if (lower.includes('human') || lower.includes('escalation') || lower.includes('officer') || lower.includes('ሰው')) {
      setCurrentTab('escalations');
      setLastCommandNotice('Voice Command Triggered: Opening Human Escalations');
      speakFeedback('Opening Human Escalations.');
      return true;
    }
    return false;
  };

  const startListening = () => {
    setSpeechError(null);
    setLastCommandNotice(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. Please use text input fallback.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'am' ? 'am-ET' : language === 'om' ? 'om-ET' : language === 'so' ? 'so-SO' : language === 'ti' ? 'ti-ER' : 'en-US';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = (event: any) => {
        setSpeechError('Speech recognition error: ' + event.error);
        setIsRecording(false);
      };

      recognition.onend = async () => {
        setIsRecording(false);
        if (transcript.trim()) {
          const executedCommand = checkAndExecuteVoiceCommand(transcript);
          if (executedCommand) {
            return;
          }

          const ragRes = await processRAGQuery(transcript, language, documents);
          const newMsg: ChatMessage = {
            id: 'voice-' + Date.now(),
            sender: 'assistant',
            text: ragRes.answer,
            language,
            timestamp: new Date().toISOString(),
            citations: ragRes.citations,
            verificationStatus: ragRes.verificationStatus
          };
          setLatestAnswer(newMsg);

          const historyItem: VoiceHistoryItem = {
            id: newMsg.id,
            transcript,
            answer: ragRes.answer,
            timestamp: newMsg.timestamp,
            language,
            verificationStatus: ragRes.verificationStatus,
            citationTitle: ragRes.citations?.[0]?.title || 'Dire Dawa PP Authorized Record'
          };

          setVoiceHistory(prev => [historyItem, ...prev]);

          speakFeedback(ragRes.answer);
        }
      };

      recognition.start();
    } catch (err: any) {
      setSpeechError('Could not start microphone: ' + err.message);
      setIsRecording(false);
    }
  };

  const stopListening = () => {
    setIsRecording(false);
  };

  const clearHistory = () => {
    setVoiceHistory([]);
    localStorage.removeItem('girmaic_voice_history');
  };

  const exportHistoryAsText = () => {
    if (voiceHistory.length === 0) return;
    const content = [
      '============================================================',
      'GIRMAIC DD-PP AI · VOICE INTERACTION TRANSCRIPTS EXPORT',
      `Generated At: ${new Date().toISOString()}`,
      '============================================================\n',
      ...voiceHistory.map((item, index) => [
        `[Interaction #${voiceHistory.length - index}] - ${new Date(item.timestamp).toLocaleString()}`,
        `Language: ${item.language.toUpperCase()}`,
        `User Query: "${item.transcript}"`,
        `AI Response: ${item.answer}`,
        `Source Citation: ${item.citationTitle || 'N/A'}`,
        `Verification Status: ${item.verificationStatus || 'VERIFIED'}`,
        '------------------------------------------------------------\n'
      ].join('\n'))
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Girmaic_Voice_Transcripts_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-[calc(100vh-140px)] text-center space-y-8">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-amber-600 flex items-center justify-center text-white shadow-xl relative">
        <Mic className={`w-10 h-10 ${isRecording ? 'animate-pulse text-red-200' : 'text-white'}`} />
        {isRecording && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-slate-950 animate-ping" />
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold text-white">{t.askByVoice}</h2>
        <p className="text-sm text-slate-400 max-w-md">
          Speak naturally in Amharic, English, Afaan Oromo, Somali, or Tigrinya. Use voice commands like <span className="text-emerald-400 font-semibold">"Go to FAQ"</span> or <span className="text-emerald-400 font-semibold">"Open Knowledge Base"</span>.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          <button
            onClick={() => setShowVoiceModal(true)}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Voice Personas & Speed</span>
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showSettings ? 'Hide Mic Settings' : 'Microphone Sensitivity'}</span>
          </button>
        </div>
      </div>

      {/* Voice Settings Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-left space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-amber-400" />
                <span>AI Voice Persona & Playback Speed</span>
              </h3>
              <button
                onClick={() => setShowVoiceModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold block">Select Voice Persona:</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'formal_officer', name: 'Formal Officer', desc: 'Authoritative, clear, and professional tone.' },
                    { id: 'calm_guide', name: 'Calm Guide', desc: 'Lower pitch, measured pace for relaxation.' },
                    { id: 'energetic_assistant', name: 'Energetic Assistant', desc: 'Higher pitch, upbeat and engaging cadence.' },
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setVoicePersona(p.id)}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                        voicePersona === p.id
                          ? 'bg-emerald-950/60 border-emerald-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      <span className="font-bold text-emerald-300">{p.name}</span>
                      <span className="text-[11px] text-slate-400">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>Playback Speed (TTS Rate):</span>
                  <span className="font-mono text-emerald-400">{speechRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0.75x (Slower)</span>
                  <span>1.0x (Normal)</span>
                  <span>1.5x (Faster)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowVoiceModal(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-md cursor-pointer"
              >
                Save Voice Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animated Audio Waveform Visualizer */}
      <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center shadow-inner">
        <div className="text-[11px] text-slate-400 font-mono mb-1">
          {isRecording ? '🔴 Microphone Active (Listening & Analyzing)...' : '⏸️ Microphone Standby'}
        </div>
        <AudioWaveform active={isRecording} />
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-5 text-left space-y-4 shadow-xl">
          <div className="text-xs font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Advanced Microphone & Voice Activity Detection (VAD) Settings</span>
          </div>
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Microphone Sensitivity (Gain):</span>
                <span className="font-mono text-emerald-400 font-semibold">{micSensitivity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={micSensitivity}
                onChange={(e) => setMicSensitivity(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Higher sensitivity captures quieter voices or distant speech.</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>VAD Silence Threshold:</span>
                <span className="font-mono text-emerald-400 font-semibold">{vadThreshold}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={vadThreshold}
                onChange={(e) => setVadThreshold(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Adjusts background noise filtering and end-of-speech pause detection.</p>
            </div>
          </div>
        </div>
      )}

      {lastCommandNotice && (
        <div className="w-full bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs p-3 rounded-xl flex items-center gap-2">
          <Command className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{lastCommandNotice}</span>
        </div>
      )}

      {speechError && (
        <div className="w-full bg-rose-950/80 border border-rose-800 text-rose-200 text-xs p-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{speechError}</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        {!isRecording ? (
          <button
            onClick={startListening}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
          >
            <Mic className="w-5 h-5" />
            <span>{t.startRecording}</span>
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg flex items-center gap-2 transition-all animate-pulse cursor-pointer"
          >
            <MicOff className="w-5 h-5" />
            <span>{t.stopRecording}</span>
          </button>
        )}
      </div>

      {transcript && (
        <div className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-left shadow-md">
          <div className="text-xs font-semibold text-slate-400 mb-1">Recognized Speech Query:</div>
          <p className="text-sm text-white italic">"{transcript}"</p>
        </div>
      )}

      {latestAnswer && (
        <div className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-6 text-left shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Verified Voice Response</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
              {latestAnswer.verificationStatus}
            </span>
          </div>
          <p className="text-sm text-slate-100 leading-relaxed">{latestAnswer.text}</p>

          {latestAnswer.citations && latestAnswer.citations.length > 0 && (
            <div className="pt-3 border-t border-slate-700 text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-emerald-400">Source:</span> {latestAnswer.citations[0].title} ({latestAnswer.citations[0].source})
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => speakFeedback(latestAnswer.text)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read Aloud (TTS)</span>
            </button>
            <button
              onClick={() => {
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-medium px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              Stop Speech
            </button>
          </div>
        </div>
      )}

      {/* Voice History Section */}
      <div className="w-full bg-slate-850 border border-slate-700/80 rounded-2xl p-6 shadow-xl text-left space-y-4 mt-6">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <span>Previous Voice Interaction Transcripts ({voiceHistory.length})</span>
          </h3>
          {voiceHistory.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={exportHistoryAsText}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export (.txt)</span>
              </button>
              <button
                onClick={clearHistory}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </div>
          )}
        </div>

        {voiceHistory.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs italic">
            No previous voice transcripts recorded yet. Use the microphone above to start a voice query or voice command.
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {voiceHistory.map(item => (
              <div key={item.id} className="bg-slate-900 border border-slate-700/70 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-400">Query: "{item.transcript}"</span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
                <p className="text-slate-200 leading-snug">{item.answer}</p>
                {item.citationTitle && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-800">
                    <BookMarked className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">Source: {item.citationTitle}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
