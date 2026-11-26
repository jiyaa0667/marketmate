import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, MessageSquare, SlidersHorizontal, Sparkles } from 'lucide-react';
import { buildDemoStrategy, DEFAULT_FORM_INPUTS } from '../data/demoStrategy';
import {
  AvailableTimeOption,
  BudgetPreset,
  MarketingFormInputs,
  MarketingGoal,
  MarketingPlatform,
  MarketingStrategyResult,
} from '../types/marketing';
import { MarketingChat } from './MarketingChat';
import { StrategyResults } from './StrategyResults';

interface AssistantWorkspaceProps {
  activeTab: 'builder' | 'chat';
  onTabChange: (tab: 'builder' | 'chat') => void;
  queuedChatPrompt: string | null;
  onConsumeQueuedPrompt: () => void;
}

const GOAL_OPTIONS: MarketingGoal[] = [
  'Increase Brand Awareness',
  'Get First 50 Customers',
  'Increase Sales',
  'Generate Leads',
  'Increase Social Media Engagement',
  'Launch a New Product',
];

const PLATFORM_OPTIONS: MarketingPlatform[] = [
  'Instagram',
  'WhatsApp',
  'Facebook',
  'YouTube',
  'LinkedIn',
  'Pinterest',
];

const BUDGET_PRESETS: { label: BudgetPreset; value: number }[] = [
  { label: '₹0 – Free Marketing', value: 0 },
  { label: '₹1,000', value: 1000 },
  { label: '₹2,500', value: 2500 },
  { label: '₹5,000', value: 5000 },
  { label: '₹10,000+', value: 10000 },
  { label: 'Custom Budget', value: 3000 },
];

const TIME_OPTIONS: AvailableTimeOption[] = [
  '30 minutes per day',
  '1 hour per day',
  '2 hours per day',
  '4+ hours per day',
];

export function AssistantWorkspace({
  activeTab,
  onTabChange,
  queuedChatPrompt,
  onConsumeQueuedPrompt,
}: AssistantWorkspaceProps) {
  const [inputs, setInputs] = useState<MarketingFormInputs>(DEFAULT_FORM_INPUTS);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [strategy, setStrategy] = useState<MarketingStrategyResult | null>(null);
  const [strategySource, setStrategySource] = useState<'live-ai' | 'demo'>('live-ai');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [refineError, setRefineError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);
  const audienceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setAiConfigured(Boolean(data.aiConfigured));
      })
      .catch(() => {
        setAiConfigured(false);
      });
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!inputs.businessName.trim()) errors.businessName = 'Please enter your business name.';
    if (!inputs.businessType.trim()) errors.businessType = 'Please specify your business type.';
    if (!inputs.productOrService.trim())
      errors.productOrService = 'Describe what product or service you offer.';
    if (!inputs.businessLocation.trim())
      errors.businessLocation = 'Enter your city, region, or online focus.';
    if (!inputs.businessDescription.trim())
      errors.businessDescription = 'Add a brief description of your business.';
    if (inputs.goals.length === 0) errors.goals = 'Select at least one marketing goal.';
    if (!inputs.ageGroup.trim()) errors.ageGroup = 'Specify a target age range.';
    if (!inputs.customerInterests.trim())
      errors.customerInterests = 'Add 2–3 customer interests.';
    if (!inputs.targetMarket.trim()) errors.targetMarket = 'Specify your target market location.';
    if (inputs.platforms.length === 0)
      errors.platforms = 'Select at least one marketing platform.';
    if (inputs.budgetAmount < 0 || Number.isNaN(inputs.budgetAmount))
      errors.budgetAmount = 'Enter a valid budget amount in INR.';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const toggleGoal = (goal: MarketingGoal) => {
    setInputs((prev) => {
      const exists = prev.goals.includes(goal);
      return {
        ...prev,
        goals: exists ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal],
      };
    });
  };

  const togglePlatform = (platform: MarketingPlatform) => {
    setInputs((prev) => {
      const exists = prev.platforms.includes(platform);
      return {
        ...prev,
        platforms: exists
          ? prev.platforms.filter((p) => p !== platform)
          : [...prev.platforms, platform],
      };
    });
  };

  const handleBudgetPreset = (preset: BudgetPreset, value: number) => {
    setInputs((prev) => ({
      ...prev,
      budgetPreset: preset,
      budgetAmount: preset === 'Custom Budget' ? prev.budgetAmount || value : value,
    }));
  };

  const generateStrategy = async (forceDemo = false) => {
    if (!validateForm()) return;

    setApiError(null);
    setRefineError(null);
    setIsGenerating(true);

    if (forceDemo || demoMode) {
      setTimeout(() => {
        setStrategy(buildDemoStrategy(inputs));
        setStrategySource('demo');
        setDemoMode(true);
        setIsGenerating(false);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      }, 450);
      return;
    }

    try {
      const res = await fetch('/api/strategy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate strategy.');
      }

      setStrategy(data.strategy);
      setStrategySource('live-ai');
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : 'Something went wrong generating your strategy.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const refineStrategy = async (instruction: string) => {
    if (!strategy) return;
    setRefineError(null);
    setIsRefining(true);

    if (strategySource === 'demo' || demoMode) {
      setTimeout(() => {
        const lower = instruction.toLowerCase();
        let nextInputs = { ...inputs };
        const budgetMatch = instruction.match(/₹?\s*([\d,]+)/);
        if (lower.includes('budget') && budgetMatch) {
          const parsed = Number(budgetMatch[1].replace(/,/g, ''));
          if (!Number.isNaN(parsed)) {
            nextInputs = { ...inputs, budgetAmount: parsed, budgetPreset: 'Custom Budget' };
            setInputs(nextInputs);
          }
        }
        const regenerated = buildDemoStrategy(nextInputs);
        if (lower.includes('day 3')) {
          regenerated.sevenDayPlan = regenerated.sevenDayPlan.map((row) =>
            row.day === 'Day 3'
              ? {
                  ...row,
                  theme: 'Interactive Poll + Behind-the-Scenes Hook',
                  caption: `Wait until you see how we pack ${nextInputs.productOrService} in ${nextInputs.businessLocation}. Vote A or B in our story poll and DM "PACK" for a surprise sample!`,
                }
              : row
          );
        } else if (lower.includes('whatsapp')) {
          regenerated.sevenDayPlan = regenerated.sevenDayPlan.map((row, i) =>
            i === 5
              ? {
                  ...row,
                  platform: 'WhatsApp',
                  caption: `Hi! Exclusive update from ${nextInputs.businessName}: Our fresh batch of ${nextInputs.productOrService} is ready in ${nextInputs.businessLocation}. Reply "MENU" for pricing & quick delivery today.`,
                }
              : row
          );
        } else if (lower.includes('caption')) {
          regenerated.sevenDayPlan = regenerated.sevenDayPlan.map((row) => ({
            ...row,
            caption: `Elevated & customer-focused: ${row.caption}`,
          }));
        }
        regenerated.summaryNote = `Demo Mode Update applied for "${instruction}". Connect GEMINI_API_KEY for full AI section-targeted rewrites.`;
        setStrategy(regenerated);
        setIsRefining(false);
      }, 400);
      return;
    }

    try {
      const res = await fetch('/api/strategy/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs,
          currentStrategy: strategy,
          instruction,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not update strategy.');
      }
      setStrategy(data.strategy);
    } catch (err) {
      setRefineError(err instanceof Error ? err.message : 'Unable to apply modification.');
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <section id="ai-assistant" className="py-16 lg:py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Heading & Mode Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <p className="text-sm font-semibold text-[#6366F1]">AI Marketing Assistant</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#172554] [text-wrap:balance]">
              Build Your Personalised Marketing Strategy.
            </h2>
            <p className="text-base text-slate-600">
              Complete your business profile below or chat directly with MarketMate AI for custom
              captions, audience targeting, and campaign ideas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {aiConfigured === false && !demoMode && (
              <button
                type="button"
                onClick={() => setDemoMode(true)}
                className="text-xs font-semibold text-[#172554] bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl px-3.5 py-2.5 transition-colors cursor-pointer"
              >
                Enable Demo Mode (No API Key Detected)
              </button>
            )}
            {demoMode && (
              <button
                type="button"
                onClick={() => setDemoMode(false)}
                className="text-xs font-semibold text-amber-900 bg-amber-100 border border-amber-300 rounded-xl px-3.5 py-2.5 transition-colors cursor-pointer"
              >
                Demo Mode Active · Switch to Live AI
              </button>
            )}

            <div className="inline-flex items-center p-1 bg-slate-200/70 rounded-xl">
              <button
                type="button"
                onClick={() => onTabChange('builder')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'builder'
                    ? 'bg-white text-[#172554] shadow-xs'
                    : 'text-slate-600 hover:text-[#172554]'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Strategy Builder
              </button>
              <button
                type="button"
                onClick={() => onTabChange('chat')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-white text-[#172554] shadow-xs'
                    : 'text-slate-600 hover:text-[#172554]'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                AI Chat Assistant
              </button>
            </div>
          </div>
        </div>

        {/* Workspace Tab 1: Strategy Builder Form + Dynamic Output */}
        {activeTab === 'builder' ? (
          <div className="space-y-10">
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                generateStrategy(false);
              }}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8"
            >
              {/* Form Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#172554]">
                    Business &amp; Campaign Brief
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pre-filled with a realistic example — edit any field or clear to start fresh.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setInputs(DEFAULT_FORM_INPUTS);
                      setValidationErrors({});
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-[#172554] bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Load Sample Business
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputs({
                        businessName: '',
                        businessType: '',
                        productOrService: '',
                        businessLocation: '',
                        businessDescription: '',
                        goals: [],
                        ageGroup: '',
                        gender: '',
                        customerInterests: '',
                        targetMarket: '',
                        budgetPreset: '₹2,500',
                        budgetAmount: 2500,
                        platforms: [],
                        availableTime: '1 hour per day',
                      });
                      setValidationErrors({});
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-[#172554] bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Clear Form
                  </button>
                </div>
              </div>

              {/* A. Business Information */}
              <div className="space-y-4">
                <h4 className="font-display text-base font-bold text-[#172554]">
                  A. Business Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="businessName" className="block text-sm font-medium text-[#1E293B]">
                      Business Name
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      value={inputs.businessName}
                      onChange={(e) => setInputs({ ...inputs, businessName: e.target.value })}
                      placeholder="e.g., Kora Botanics"
                      className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:bg-white"
                    />
                    {validationErrors.businessName && (
                      <p className="text-xs text-red-600">{validationErrors.businessName}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="businessType" className="block text-sm font-medium text-[#1E293B]">
                      Business Type
                    </label>
                    <input
                      id="businessType"
                      type="text"
                      value={inputs.businessType}
                      onChange={(e) => setInputs({ ...inputs, businessType: e.target.value })}
                      placeholder="e.g., Home Bakery, D2C Skincare, Coaching Studio"
                      className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:bg-white"
                    />
                    {validationErrors.businessType && (
                      <p className="text-xs text-red-600">{validationErrors.businessType}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="productOrService"
                      className="block text-sm font-medium text-[#1E293B]"
                    >
                      Product or Service
                    </label>
                    <input
                      id="productOrService"
                      type="text"
                      value={inputs.productOrService}
                      onChange={(e) => setInputs({ ...inputs, productOrService: e.target.value })}
                      placeholder="e.g., Custom wedding cakes, cold-pressed oils, UI design"
                      className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:bg-white"
                    />
                    {validationErrors.productOrService && (
                      <p className="text-xs text-red-600">{validationErrors.productOrService}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="businessLocation"
                      className="block text-sm font-medium text-[#1E293B]"
                    >
                      Business Location
                    </label>
                    <input
                      id="businessLocation"
                      type="text"
                      value={inputs.businessLocation}
                      onChange={(e) => setInputs({ ...inputs, businessLocation: e.target.value })}
                      placeholder="e.g., Bengaluru, Mumbai, Pune, Pan-India"
                      className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:bg-white"
                    />
                    {validationErrors.businessLocation && (
                      <p className="text-xs text-red-600">{validationErrors.businessLocation}</p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label
                      htmlFor="businessDescription"
                      className="block text-sm font-medium text-[#1E293B]"
                    >
                      Business Description
                    </label>
                    <textarea
                      id="businessDescription"
                      rows={3}
                      value={inputs.businessDescription}
                      onChange={(e) =>
                        setInputs({ ...inputs, businessDescription: e.target.value })
                      }
                      placeholder="Briefly describe what makes your product or service special..."
                      className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:bg-white"
                    />
                    {validationErrors.businessDescription && (
                      <p className="text-xs text-red-600">{validationErrors.businessDescription}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* B. Marketing Goals */}
              <div className="space-y-3 pt-4 border-t border-slate-200/80">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-base font-bold text-[#172554]">
                    B. Marketing Goals
                  </h4>
                  <span className="text-xs text-slate-500">Select one or more</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {GOAL_OPTIONS.map((goal) => {
                    const selected = inputs.goals.includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleGoal(goal)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#172554] text-white border-[#172554]'
                            : 'bg-[#F8FAFC] text-[#1E293B] border-slate-200 hover:border-[#6366F1]'
                        }`}
                      >
                        {selected && <Check className="w-3.5 h-3.5 text-[#8B8CF6]" />}
                        {goal}
                      </button>
                    );
                  })}
                </div>
                {validationErrors.goals && (
                  <p className="text-xs text-red-600">{validationErrors.goals}</p>
                )}
              </div>

              {/* C. Target Audience */}
              <div ref={audienceRef} className="space-y-4 pt-4 border-t border-slate-200/80">
                <h4 className="font-display text-base font-bold text-[#172554]">
                  C. Target Audience
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="ageGroup" className="block text-sm font-medium text-[#1E293B]">
                      Age Group
                    </label>
                    <input
                      id="ageGroup"
                      type="text"
                      value={inputs.ageGroup}
                      onChange={(e) => setInputs({ ...inputs, ageGroup: e.target.value })}
                      placeholder="e.g., 22–38"
                      className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:bg-white"
                    />
                    {validationErrors.ageGroup && (
                      <p className="text-xs text-red-600">{validationErrors.ageGroup}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="gender" className="block text-sm font-medium text-[#1E293B]">
                      Gender (optional)
                    </label>
                    <input
                      id="gender"
                      type="text"
                      value={inputs.gender}
                      onChange={(e) => setInputs({ ...inputs, gender: e.target.value })}
                      placeholder="e.g., All, Women, Men"
                      className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="customerInterests"
                      className="block text-sm font-medium text-[#1E293B]"
                    >
                      Customer Interests
                    </label>
                    <input
                      id="customerInterests"
                      type="text"
                      value={inputs.customerInterests}
                      onChange={(e) => setInputs({ ...inputs, customerInterests: e.target.value })}
                      placeholder="e.g., Organic food, fitness, gifting"
                      className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:bg-white"
                    />
                    {validationErrors.customerInterests && (
                      <p className="text-xs text-red-600">{validationErrors.customerInterests}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="targetMarket"
                      className="block text-sm font-medium text-[#1E293B]"
                    >
                      Location / Target Market
                    </label>
                    <input
                      id="targetMarket"
                      type="text"
                      value={inputs.targetMarket}
                      onChange={(e) => setInputs({ ...inputs, targetMarket: e.target.value })}
                      placeholder="e.g., Tier-1 Indian Cities"
                      className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:bg-white"
                    />
                    {validationErrors.targetMarket && (
                      <p className="text-xs text-red-600">{validationErrors.targetMarket}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* D. Marketing Budget + E. Platforms + F. Available Time */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-slate-200/80">
                {/* D. Budget */}
                <div className="lg:col-span-5 space-y-3">
                  <h4 className="font-display text-base font-bold text-[#172554]">
                    D. Marketing Budget (INR ₹)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BUDGET_PRESETS.map((preset) => {
                      const active = inputs.budgetPreset === preset.label;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleBudgetPreset(preset.label, preset.value)}
                          className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#6366F1] text-white border-[#6366F1]'
                              : 'bg-[#F8FAFC] text-[#1E293B] border-slate-200 hover:border-[#6366F1]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <label
                      htmlFor="budgetAmount"
                      className="text-xs font-medium text-slate-600 whitespace-nowrap"
                    >
                      Exact Monthly Budget (₹):
                    </label>
                    <input
                      id="budgetAmount"
                      type="number"
                      min={0}
                      step={100}
                      value={inputs.budgetAmount}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          budgetPreset: 'Custom Budget',
                          budgetAmount: Math.max(0, Number(e.target.value) || 0),
                        })
                      }
                      className="w-36 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-sm text-[#172554] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:bg-white"
                    />
                  </div>
                  {validationErrors.budgetAmount && (
                    <p className="text-xs text-red-600">{validationErrors.budgetAmount}</p>
                  )}
                </div>

                {/* E. Marketing Platforms */}
                <div className="lg:col-span-4 space-y-3">
                  <h4 className="font-display text-base font-bold text-[#172554]">
                    E. Marketing Platforms
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {PLATFORM_OPTIONS.map((platform) => {
                      const selected = inputs.platforms.includes(platform);
                      return (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => togglePlatform(platform)}
                          className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                            selected
                              ? 'bg-[#172554] text-white border-[#172554]'
                              : 'bg-[#F8FAFC] text-[#1E293B] border-slate-200 hover:border-[#6366F1]'
                          }`}
                        >
                          {selected && <Check className="w-3 h-3 text-[#8B8CF6]" />}
                          {platform}
                        </button>
                      );
                    })}
                  </div>
                  {validationErrors.platforms && (
                    <p className="text-xs text-red-600">{validationErrors.platforms}</p>
                  )}
                </div>

                {/* F. Available Time */}
                <div className="lg:col-span-3 space-y-3">
                  <h4 className="font-display text-base font-bold text-[#172554]">
                    F. Available Time
                  </h4>
                  <div className="space-y-2">
                    {TIME_OPTIONS.map((time) => {
                      const active = inputs.availableTime === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setInputs({ ...inputs, availableTime: time })}
                          className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#6366F1] text-white border-[#6366F1]'
                              : 'bg-[#F8FAFC] text-[#1E293B] border-slate-200 hover:border-[#6366F1]'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Error Banner (Never masks live AI errors) */}
              {apiError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-red-900">
                        Live AI Generation Unavailable
                      </div>
                      <p className="text-xs text-red-700">{apiError}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => generateStrategy(true)}
                    className="px-4 py-2 text-xs font-semibold text-[#172554] bg-white hover:bg-slate-50 border border-red-200 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Use Demo Mode
                  </button>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                  {demoMode
                    ? 'Demo Mode selected — generates a sample plan tailored to your inputs.'
                    : 'Generates a complete 8-part marketing strategy and 7-day execution table.'}
                </p>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-semibold text-white bg-[#172554] hover:bg-[#6366F1] rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4 text-[#8B8CF6]" />
                  {isGenerating
                    ? 'Building Your Strategy...'
                    : 'Generate My Marketing Strategy ✨'}
                </button>
              </div>
            </form>

            {/* Loading State Skeleton */}
            {isGenerating && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-5 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="h-28 bg-slate-100 rounded-xl" />
                  <div className="h-28 bg-slate-100 rounded-xl" />
                  <div className="h-28 bg-slate-100 rounded-xl" />
                </div>
                <div className="h-48 bg-slate-100 rounded-xl" />
              </div>
            )}

            {/* Dynamic Results */}
            <div ref={resultsRef}>
              {!isGenerating && strategy && (
                <StrategyResults
                  inputs={inputs}
                  strategy={strategy}
                  source={strategySource}
                  isRefining={isRefining}
                  refineError={refineError}
                  onRegenerate={() => generateStrategy(demoMode)}
                  onRefine={refineStrategy}
                  onUpdateStrategy={setStrategy}
                  onJumpToAudienceInput={() =>
                    audienceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                />
              )}
            </div>
          </div>
        ) : (
          /* Workspace Tab 2: AI Marketing Chat */
          <MarketingChat
            inputs={inputs}
            currentStrategy={strategy}
            demoMode={demoMode}
            externalPrompt={queuedChatPrompt}
            onConsumeExternalPrompt={onConsumeQueuedPrompt}
            onEnableDemoMode={() => setDemoMode(true)}
          />
        )}
      </div>
    </section>
  );
}
