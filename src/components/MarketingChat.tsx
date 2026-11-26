import { useEffect, useRef, useState } from 'react';
import { Check, Copy, RefreshCw, Send, Sparkles, User } from 'lucide-react';
import {
  ChatMessage,
  MarketingFormInputs,
  MarketingStrategyResult,
} from '../types/marketing';

interface MarketingChatProps {
  inputs: MarketingFormInputs;
  currentStrategy: MarketingStrategyResult | null;
  demoMode: boolean;
  externalPrompt?: string | null;
  onConsumeExternalPrompt?: () => void;
  onEnableDemoMode: () => void;
}

const SUGGESTED_PROMPTS = [
  'Create a marketing plan for my business.',
  'Help me find my target audience.',
  'Write Instagram captions.',
  'Plan a product launch campaign.',
  'How should I spend my marketing budget?',
];

function buildDemoChatReply(prompt: string, inputs: MarketingFormInputs): string {
  const brand = inputs.businessName || 'your business';
  const product = inputs.productOrService || 'your products';
  const budget = inputs.budgetAmount || 5000;
  const lower = prompt.toLowerCase();

  if (lower.includes('caption') || lower.includes('instagram')) {
    return `[Demo Mode Sample Response]\n\nHere are 3 ready-to-post Instagram captions for ${brand}:\n\n1. Story & Craft:\n"Every batch of ${product} starts in ${inputs.businessLocation} with carefully chosen ingredients and zero shortcuts. Tap the link in bio or DM us to reserve yours today."\n\n2. Social Proof:\n"Why customers keep coming back to ${brand}: honest quality you can feel from day one. Which bestseller should we restock next? Tell us below."\n\n3. Direct Offer:\n"New to ${brand}? Try our starter pack this week and enjoy priority local dispatch. Message 'START' to order on WhatsApp."`;
  }
  if (lower.includes('audience')) {
    return `[Demo Mode Sample Response]\n\nThree high-potential buyer segments for ${brand}:\n\n1. Local Quality Explorers (${inputs.ageGroup}): Active on ${inputs.platforms[0] || 'Instagram'}, motivated by authentic craftsmanship and transparent pricing.\n2. Busy Convenience Buyers (28–44): Prefer quick WhatsApp ordering, reliable delivery, and curated bundles.\n3. Occasion & Gifting Shoppers (22–45): Look for thoughtful packaging and ready-to-gift combos for birthdays and festivals.`;
  }
  if (lower.includes('budget')) {
    return `[Demo Mode Sample Response]\n\nFor a ₹${budget.toLocaleString('en-IN')} monthly budget for ${brand}:\n• 40% (₹${Math.round(budget * 0.4).toLocaleString('en-IN')}): Local radius & interest ads on ${inputs.platforms[0] || 'Instagram'}\n• 25% (₹${Math.round(budget * 0.25).toLocaleString('en-IN')}): Product photography & short-video lighting\n• 20% (₹${Math.round(budget * 0.2).toLocaleString('en-IN')}): First-50 customer starter offers\n• 15% (₹${Math.round(budget * 0.15).toLocaleString('en-IN')}): Micro-creator product seeding in ${inputs.businessLocation}`;
  }
  if (lower.includes('launch')) {
    return `[Demo Mode Sample Response]\n\n7-Day Launch Sprint for ${brand}:\n• Days 1–2 (Tease): Share behind-the-scenes clips and open a WhatsApp early-access list.\n• Days 3–4 (Reveal): Publish product showcase Reel + transparent pricing carousel.\n• Days 5–6 (Convert): Launch a 48-hour introductory bundle for your first 25 buyers.\n• Day 7 (Social Proof): Repost early unboxing reactions and thank-you notes.`;
  }
  return `[Demo Mode Sample Response]\n\nFor ${brand} (${inputs.businessType}) in ${inputs.businessLocation}, focus on a 2-channel loop: post 4 educational/proof Reels per week on ${inputs.platforms[0] || 'Instagram'} and close enquiries directly via WhatsApp Catalogue. Use the Strategy Builder tab to generate your full 7-day table and PDF export.`;
}

export function MarketingChat({
  inputs,
  currentStrategy,
  demoMode,
  externalPrompt,
  onConsumeExternalPrompt,
  onEnableDemoMode,
}: MarketingChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm MarketMate AI, your personal marketing partner. Ask me to write captions, refine your target audience, plan a launch campaign, or optimise your INR budget for ${inputs.businessName || 'your business'}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (text: string, baseMessages?: ChatMessage[]) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextHistory = [...(baseMessages ?? messages), userMsg];
    setMessages(nextHistory);
    setInputText('');
    setIsLoading(true);

    if (demoMode) {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: buildDemoChatReply(trimmed, inputs),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDemo: true,
        };
        setMessages((prev) => [...prev, replyMsg]);
        setIsLoading(false);
      }, 450);
      return;
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({ role: m.role, content: m.content })),
          inputs,
          currentStrategy,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not reach AI chat service.');
      }

      const replyMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to get AI response.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (externalPrompt && externalPrompt.trim()) {
      const promptToRun = externalPrompt;
      onConsumeExternalPrompt?.();
      sendMessage(promptToRun);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPrompt]);

  const handleRegenerateLast = () => {
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === 'user');
    if (lastUserIdx === -1) return;
    const actualIdx = messages.length - 1 - lastUserIdx;
    const lastUserMessage = messages[actualIdx];
    const trimmedHistory = messages.slice(0, actualIdx);
    sendMessage(lastUserMessage.content, trimmedHistory);
  };

  const handleCopyMessage = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      // Ignore
    }
  };

  const hasUserSentMessage = messages.some((m) => m.role === 'user');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[640px]">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-[#F8FAFC] flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-[#172554]">
            MarketMate AI Marketing Chat
          </h3>
          <p className="text-xs text-slate-500">
            Context: {inputs.businessName || 'New Business'} · ₹
            {inputs.budgetAmount.toLocaleString('en-IN')} budget
            {demoMode ? ' · Demo Mode' : ''}
          </p>
        </div>

        {hasUserSentMessage && (
          <button
            type="button"
            disabled={isLoading}
            onClick={handleRegenerateLast}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#172554] bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Regenerate response
          </button>
        )}
      </div>

      {/* Messages Feed */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-[#172554] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed space-y-2 ${
                msg.role === 'user'
                  ? 'bg-[#172554] text-white'
                  : 'bg-[#F8FAFC] border border-slate-200 text-[#1E293B]'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div
                className={`flex items-center justify-between gap-4 text-[11px] ${
                  msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'
                }`}
              >
                <span className="font-mono tabular-nums">
                  {msg.timestamp}
                  {msg.isDemo ? ' · Sample Demo' : ''}
                </span>
                {msg.role === 'assistant' && (
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(msg.id, msg.content)}
                    className="inline-flex items-center gap-1 hover:text-[#172554] transition-colors cursor-pointer"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-[#6366F1] flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#172554] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-500">
              Thinking through your business context...
            </div>
          </div>
        )}

        {errorMsg && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 space-y-2"
          >
            <p className="font-medium">{errorMsg}</p>
            {!demoMode && (
              <button
                type="button"
                onClick={onEnableDemoMode}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-[#172554] bg-white border border-red-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Use Demo Mode for Sample Chat
              </button>
            )}
          </div>
        )}
      </div>

      {/* Suggested Prompts + Composer */}
      <div className="p-4 border-t border-slate-200 bg-[#F8FAFC] space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={isLoading}
              onClick={() => sendMessage(prompt)}
              className="text-xs font-medium text-slate-600 hover:text-[#172554] bg-white hover:bg-indigo-50/70 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputText);
          }}
          className="flex items-center gap-2.5"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything — e.g. Write a WhatsApp launch message for my product..."
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            aria-label="Send message"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#172554] hover:bg-[#6366F1] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
