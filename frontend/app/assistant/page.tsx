'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { apiRequest } from '@/services/api';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Trash2, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck,
  RefreshCw,
  User as UserIcon,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface ChatSource {
  source_name: string;
  url: string;
  scheme?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  timestamp: string;
}

export default function AssistantPage() {
  const { language } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: language === 'te'
        ? 'నమస్కారం! నేను మీ జన్ సాథి AI సహాయకుడిని. భారత ప్రభుత్వ సంక్షేమ పథకాలు, అర్హత నిబంధనలు, దరఖాస్తు విధానం లేదా అవసరమైన పత్రాల గురించి నన్ను తెలుగు లేదా ఇంగ్లీషులో అడగండి.'
        : 'Namaste! I am your JanSathi AI Assistant. Ask me anything about Indian government welfare schemes, eligibility rules, application steps, or required documents in English or Telugu.',
      sources: [
        {
          source_name: 'Official Government of India Portals (data.gov.in / india.gov.in)',
          url: 'https://data.gov.in',
          scheme: 'Central & State Public Welfare'
        }
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize session ID
  useEffect(() => {
    let currentSession = localStorage.getItem('jansathi_chat_session');
    if (!currentSession) {
      currentSession = 'session_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('jansathi_chat_session', currentSession);
    }
    setSessionId(currentSession);

    // Initialize Web Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === 'te' ? 'te-IN' : 'en-IN';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await apiRequest<{ response: string; sources: ChatSource[]; session_id: string }>(
        '/chat',
        {
          method: 'POST',
          body: JSON.stringify({
            message: text.trim(),
            session_id: sessionId,
            language: language
          })
        }
      );

      const botMessage: Message = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        content: res.response,
        sources: res.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: language === 'te' 
          ? 'క్షమించండి, సమాధానం రూపొందించడంలో సమస్య ఎదురైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.'
          : 'I apologize, an error occurred while processing your request. Please check your connection and try again.',
        sources: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'te' ? 'te-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Mic error:', err);
      }
    }
  };

  const speakText = (id: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown characters before speech
    const cleanText = text.replace(/[*#_`\[\]()]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'te' ? 'te-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = async () => {
    if (confirm(language === 'te' ? 'సంభాషణను క్లియర్ చేయాలా?' : 'Clear conversation history?')) {
      try {
        await apiRequest(`/chat/history?session_id=${sessionId}`, { method: 'DELETE' });
      } catch (e) {
        // ignore
      }
      setMessages([]);
    }
  };

  const suggestedQuestions = [
    {
      en: "What government schemes are available for farmers?",
      te: "రైతులకు అందుబాటులో ఉన్న ప్రభుత్వ పథకాలు ఏమిటి?"
    },
    {
      en: "How can I apply for PM-KISAN ₹6,000 grant?",
      te: "పీఎం కిసాన్ ₹6,000 కోసం ఎలా దరఖాస్తు చేయాలి?"
    },
    {
      en: "What documents are required for Ayushman Bharat PM-JAY?",
      te: "ఆయుష్మాన్ భారత్ హెల్త్ కార్డుకు ఏ పత్రాలు అవసరం?"
    },
    {
      en: "How can I get a collateral-free Mudra business loan?",
      te: "పూచీకత్తు లేకుండా ముద్రా లోన్ ఎలా పొందాలి?"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 flex flex-col">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col">
        {/* Top Header Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 shadow-sm mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-saffron-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-navy-900 text-base sm:text-lg">
                  JanSathi Multilingual AI
                </h1>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ● Grounded RAG
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'te' ? 'గెజిట్-ఆధారిత ఖచ్చితమైన సమాచారం' : 'Verified Gazette Intelligence • Telugu & English'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 overflow-y-auto mb-4 space-y-5 min-h-[440px] max-h-[600px]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <Bot className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-600">Start asking questions about government welfare</p>
              <p className="text-xs text-slate-400 mt-1">Grounded directly in official central & state portals</p>
            </div>
          ) : (
            messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-saffron-700 flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 text-sm ${
                      isUser
                        ? 'bg-gradient-to-r from-navy-900 to-navy-800 text-white rounded-tr-none shadow-md'
                        : 'glass-panel border border-slate-200/90 text-slate-800 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line leading-relaxed">
                      {m.content}
                    </div>

                    {/* Official Citations Section */}
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-200/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700 block mb-1.5 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{language === 'te' ? 'ధృవీకరించబడిన ప్రభుత్వ మూలాలు' : 'Verified Gazette Citations:'}</span>
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {m.sources.map((src, i) => (
                            <a
                              key={i}
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-[11px] font-semibold text-saffron-800 border border-orange-200 transition-colors"
                            >
                              <span>{src.source_name}</span>
                              <ExternalLink className="w-3 h-3 text-saffron-600" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Message Actions */}
                    {!isUser && (
                      <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-400">
                        <span className="text-[10px]">{m.timestamp}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => speakText(m.id, m.content)}
                            className="p-1 hover:text-navy-900 transition-colors"
                            title={speakingMessageId === m.id ? 'Stop audio' : 'Listen in audio'}
                          >
                            {speakingMessageId === m.id ? (
                              <VolumeX className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(m.id, m.content)}
                            className="p-1 hover:text-navy-900 transition-colors"
                            title="Copy response"
                          >
                            {copiedId === m.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-saffron-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="glass-panel p-3.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-600 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-saffron-600" />
                <span>{language === 'te' ? 'గెజిట్ రికార్డులను శోధిస్తోంది...' : 'Consulting official gazette knowledge base...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries Pills */}
        <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-semibold shrink-0">Suggested:</span>
          {suggestedQuestions.map((q, idx) => {
            const label = language === 'te' ? q.te : q.en;
            return (
              <button
                key={idx}
                onClick={() => handleSend(label)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-saffron-400 hover:text-saffron-700 whitespace-nowrap shadow-sm transition-all"
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Input Bar with Voice Toggle */}
        <div className="glass-panel p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-3 rounded-xl transition-all ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-saffron-600'
            }`}
            title={isRecording ? 'Listening... click to stop' : 'Voice Input (Telugu / English)'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={
              isRecording 
                ? (language === 'te' ? 'మాట్లాడండి, వింటున్నాము...' : 'Listening to speech...')
                : (language === 'te' ? 'ప్రభుత్వ పథకం లేదా సేవల గురించి అడగండి...' : 'Ask about welfare schemes, documents, or eligibility...')
            }
            className="flex-1 px-4 py-2.5 rounded-xl border-none focus:outline-none text-sm text-slate-900 bg-transparent placeholder-slate-400"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-gradient-to-r from-saffron-600 to-orange-600 hover:from-saffron-700 text-white font-bold transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
