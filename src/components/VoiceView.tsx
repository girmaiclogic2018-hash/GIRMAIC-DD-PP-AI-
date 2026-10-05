import React, { useState, useEffect } from 'react';
import { LanguageCode, KnowledgeDocument, ChatMessage } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { processRAGQuery } from '../utils/ragEngine';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface VoiceViewProps {
  language: LanguageCode;
  documents: KnowledgeDocument[];
}

export const VoiceView: React.FC<VoiceViewProps> = ({ language, documents }) => {
  const t = TRANSLATIONS[language];
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [latestAnswer, setLatestAnswer] = useState<ChatMessage | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const startListening = () => {
    setSpeechError(null);
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
          // Process RAG query
          const ragRes = await processRAGQuery(transcript, language, documents);
          setLatestAnswer({
            id: 'voice-' + Date.now(),
            sender: 'assistant',
            text: ragRes.answer,
            language,
            timestamp: new Date().toISOString(),
            citations: ragRes.citations,
            verificationStatus: ragRes.verificationStatus
          });

          // Read aloud
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(ragRes.answer);
            utterance.lang = recognition.lang;
            window.speechSynthesis.speak(utterance);
          }
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-[calc(100vh-140px)] text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-amber-600 flex items-center justify-center text-white shadow-xl mb-6">
        <Mic className={`w-10 h-10 ${isRecording ? 'animate-pulse text-red-200' : 'text-white'}`} />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">{t.askByVoice}</h2>
      <p className="text-sm text-slate-400 max-w-md mb-8">
        Speak naturally in Amharic, English, Afaan Oromo, Somali, or Tigrinya. Our AI voice engine will retrieve verified knowledge and respond.
      </p>

      {speechError && (
        <div className="bg-rose-950/80 border border-rose-800 text-rose-200 text-xs p-3 rounded-xl mb-6 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{speechError}</span>
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
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
        <div className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-6 text-left shadow-md">
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
        </div>
      )}
    </div>
  );
};
