import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  Database,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  Copy,
  Check
} from 'lucide-react';
import { ChatMessage } from '../../types/index.js';

export const AiAssistantView: React.FC = () => {
  const { language, t } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: language === 'bn'
          ? `নমস্কার / আসসালামু আলাইকুম! আমি **সামিহা এআই**—আপনার ব্যক্তিগত সহকারী ও সামিহা বিউটি শপের ম্যানেজার।\n\nআমি আপনার দোকানের সরাসরি ডাটাবেস বিশ্লেষণ করে তথ্য দিতে পারি:\n- 💰 "আজ কত বিক্রি হয়েছে?" বা "সর্বমোট লাভ কত?"\n- 📦 "কোন পণ্যের স্টক কম?"\n- 🏆 "Top 5 selling products দেখাও"\n- 📋 "আজকের পেন্ডিং অর্ডারগুলোর হিসাব দাও"\n\nআপনি কী জানতে চান? বাংলায় অথবা ইংরেজিতে প্রশ্ন করতে পারেন।`
          : `Hello! I am **SAMIHA AI**—your personal assistant & store manager for SAMIHA BEAUTY SHOP.\n\nI can analyze your live database to answer:\n- 💰 "How much did we sell today?" or "What is our gross profit?"\n- 📦 "Which products have low stock?"\n- 🏆 "Show top 5 best selling products"\n- 📋 "Summarize pending orders"\n\nHow can I help you today?`,
        timestamp: new Date().toISOString(),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(language === 'bn' ? 'আপনার ব্রাউজারে ভয়েস রিকগনিশন সাপোর্ট নেই।' : 'Voice input not supported on this browser.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Could not start recognition:', err);
      setIsListening(false);
    }
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'bn' ? 'bn-BD' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toISOString(),
      language,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || t.ai.errorLimit);
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || (language === 'bn' ? 'তথ্য পাওয়া যায়নি।' : 'No details available.'),
        timestamp: new Date().toISOString(),
        language,
        toolInvocations: data.toolsUsed,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(err.message || t.ai.errorLimit);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          content: `${language === 'bn' ? '⚠️ দুঃখিত, এআই পরিষেবা এই মুহূর্তে সাড়া দিচ্ছে না।' : '⚠️ AI service temporarily interrupted.'}\n\n${err.message || t.ai.errorLimit}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'msg-welcome-new',
        role: 'assistant',
        content: language === 'bn'
          ? 'নতুন কথোপকথন শুরু হয়েছে। আমি আপনাকে কীভাবে সাহায্য করতে পারি?'
          : 'New conversation started. How may I assist you?',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const suggestedQuestions = [
    t.ai.q1,
    t.ai.q2,
    t.ai.q3,
    t.ai.q4,
    t.ai.q5,
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="px-4 py-3 border-b border-pink-100 bg-pink-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <span>{t.ai.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-pink-100 text-pink-700">
                Gemini AI
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              {t.ai.businessGrounded} • {language === 'bn' ? 'বাস্তব তথ্য যাচাইকৃত' : 'Strict Zero-Hallucination'}
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
          title={t.ai.clearChat}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.ai.clearChat}</span>
        </button>
      </div>

      {/* Suggested Quick Queries */}
      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/70 overflow-x-auto flex items-center gap-2 text-xs">
        <span className="text-slate-400 shrink-0 font-medium flex items-center gap-1 text-[11px]">
          <Sparkles className="w-3 h-3 text-pink-500" />
          {language === 'bn' ? 'দ্রুত প্রশ্ন:' : 'Quick:'}
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="shrink-0 px-2.5 py-1 bg-white hover:bg-pink-50 hover:border-pink-300 border border-slate-200 rounded-full text-slate-700 text-xs font-medium transition-all active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat scroll area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-3xl ${
                isAssistant ? '' : 'ml-auto flex-row-reverse'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white text-xs ${
                  isAssistant
                    ? 'bg-gradient-to-tr from-violet-600 to-pink-500 shadow-xs'
                    : 'bg-slate-700'
                }`}
              >
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className="space-y-1.5 max-w-[85%] sm:max-w-[75%]">
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isAssistant
                      ? 'bg-slate-50 border border-slate-200/80 text-slate-800'
                      : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Tool Invocations Badge if assistant used business tools */}
                {msg.toolInvocations && msg.toolInvocations.length > 0 && (
                  <div className="p-2 rounded-xl bg-violet-50/70 border border-violet-100 text-[11px] text-violet-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Database className="w-3 h-3 text-violet-600" />
                      <span>{language === 'bn' ? 'সরাসরি ডাটাবেস অনুসন্ধান:' : 'Database Grounded Retrieval:'}</span>
                    </div>
                    {msg.toolInvocations.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-[10px] text-violet-700 pl-3">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                        <span className="font-mono font-medium">{t.toolName}</span>
                        <span className="text-slate-400">—</span>
                        <span className="truncate">{t.resultSummary}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className={`flex items-center gap-2 pt-0.5 text-[10px] text-slate-400 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isAssistant && (
                    <>
                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className={`p-1 rounded-md hover:bg-slate-200/60 transition-colors ${
                          speakingId === msg.id ? 'text-pink-600 animate-pulse' : 'text-slate-400'
                        }`}
                        title={speakingId === msg.id ? 'Stop Speaking' : 'Read Out Loud (TTS)'}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 rounded-md hover:bg-slate-200/60 transition-colors text-slate-400"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs py-2 pl-2">
            <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <span>{t.ai.thinking}</span>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Mic Button */}
          <button
            type="button"
            onClick={startVoiceInput}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-500 border-rose-500 text-white animate-bounce shadow-md shadow-rose-500/30'
                : 'border-slate-200 bg-slate-50 hover:bg-pink-50 hover:border-pink-300 text-slate-600 hover:text-pink-600'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Speak in Bengali or English (Voice Search)'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={isListening ? (language === 'bn' ? 'কথা বলুন, শোনা হচ্ছে...' : 'Listening to your voice...') : t.ai.inputPlaceholder}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-xs sm:text-sm text-slate-800 outline-hidden transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <span>{t.ai.send}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 mt-1.5 text-center">
          {t.ai.disclaimer}
        </p>
      </div>
    </div>
  );
};
