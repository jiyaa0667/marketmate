import { useState } from 'react';
import { ArrowRight, Calendar, MessageSquare, TrendingUp, Users } from 'lucide-react';

interface HeroSectionProps {
  onBuildPlan: () => void;
  onExploreFeatures: () => void;
}

const PREVIEW_DAYS = [
  {
    day: 'Mon',
    platform: 'Instagram Reel',
    title: 'Founder Story & Craft',
    caption:
      'Why we formulate in micro-batches every Monday morning — fresh botanicals, zero fillers, built for humid weather.',
    audience: 'Quality-First Explorers',
    metric: '1.4k est. reach',
  },
  {
    day: 'Wed',
    platform: 'WhatsApp Catalog',
    title: 'Mid-Week Starter Bundle',
    caption:
      'Try our 3-step Travel Glow Kit at ₹799 with complimentary local dispatch across Bengaluru until Friday.',
    audience: 'Value Seekers',
    metric: '12–18 enquiries',
  },
  {
    day: 'Fri',
    platform: 'Carousel Post',
    title: 'Customer Proof & FAQ',
    caption:
      'Swipe through real 14-day routine check-ins and answers to the top three ingredient questions you asked this week.',
    audience: 'Repeat & Gifting',
    metric: '6.2% save rate',
  },
];

export function HeroSection({ onBuildPlan, onExploreFeatures }: HeroSectionProps) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const activePreview = PREVIEW_DAYS[selectedDayIdx];

  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white via-[#F8FAFC] to-[#F8FAFC] pt-14 pb-16 lg:pt-20 lg:pb-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-sm font-semibold tracking-tight text-[#6366F1]">
              Your Business · Your Strategy · Your AI Marketing Partner
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-[#172554] leading-[1.08] [text-wrap:balance]">
              Marketing Made Simple. Growth Made Smarter.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Your personal AI marketing assistant that transforms your business ideas into
              actionable marketing strategies, content plans, and growth opportunities.
            </p>

            <p className="text-sm font-medium text-[#1E293B]">
              Plan smarter, market better, and grow faster with AI.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onBuildPlan}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#172554] hover:bg-[#6366F1] rounded-xl shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2"
              >
                Build My Marketing Plan
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreFeatures}
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-[#172554] bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
              >
                Explore Features
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="font-mono text-lg font-semibold text-[#172554] tabular-nums">
                  7-Day
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Ready-to-post calendar</div>
              </div>
              <div>
                <div className="font-mono text-lg font-semibold text-[#172554] tabular-nums">
                  ₹0–₹10k+
                </div>
                <div className="text-xs text-slate-500 mt-0.5">INR budget split</div>
              </div>
              <div>
                <div className="font-mono text-lg font-semibold text-[#172554] tabular-nums">
                  3 Segments
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Audience personas</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive AI Assistant Dashboard Preview */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-900/[0.04] overflow-hidden">
              {/* Preview Top Bar */}
              <div className="px-5 py-3.5 bg-[#172554] text-white flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">MarketMate Strategy Workspace</div>
                  <div className="text-xs text-indigo-200">
                    Kora Botanics · Bengaluru · ₹5,000/mo plan
                  </div>
                </div>
                <span className="text-xs font-mono text-indigo-200 whitespace-nowrap">
                  Sample Preview
                </span>
              </div>

              <div className="p-5 space-y-5">
                {/* Performance Cards Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Weekly Output</span>
                      <Calendar className="w-3.5 h-3.5 text-[#6366F1]" />
                    </div>
                    <div className="font-mono text-base font-semibold text-[#172554] mt-1 tabular-nums">
                      7 Posts
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Target Segments</span>
                      <Users className="w-3.5 h-3.5 text-[#6366F1]" />
                    </div>
                    <div className="font-mono text-base font-semibold text-[#172554] mt-1 tabular-nums">
                      3 Profiles
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Lead Target</span>
                      <TrendingUp className="w-3.5 h-3.5 text-[#6366F1]" />
                    </div>
                    <div className="font-mono text-base font-semibold text-[#172554] mt-1 tabular-nums">
                      35 / wk
                    </div>
                  </div>
                </div>

                {/* Interactive Marketing Calendar + Social Content Card */}
                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#172554]">
                      Interactive Content Calendar
                    </span>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                      {PREVIEW_DAYS.map((item, idx) => (
                        <button
                          key={item.day}
                          type="button"
                          onClick={() => setSelectedDayIdx(idx)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                            selectedDayIdx === idx
                              ? 'bg-white text-[#172554] shadow-xs'
                              : 'text-slate-600 hover:text-[#172554]'
                          }`}
                        >
                          {item.day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-[#6366F1]">{activePreview.platform}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activePreview.audience}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{activePreview.metric}</span>
                    </div>
                    <div className="text-sm font-semibold text-[#172554]">{activePreview.title}</div>
                    <p className="text-xs text-slate-600 leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-slate-200/70">
                      “{activePreview.caption}”
                    </p>
                  </div>
                </div>

                {/* Audience Insights & Budget Allocation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                    <div className="text-xs font-semibold text-[#172554]">
                      AI Budget Split (₹5,000)
                    </div>
                    <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-slate-100">
                      <div className="bg-[#172554] h-full" style={{ width: '40%' }} />
                      <div className="bg-[#6366F1] h-full" style={{ width: '25%' }} />
                      <div className="bg-[#8B8CF6] h-full" style={{ width: '20%' }} />
                      <div className="bg-slate-300 h-full" style={{ width: '15%' }} />
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600 font-mono tabular-nums">
                      <span>Ads 40%</span>
                      <span>Content 25%</span>
                      <span>Offers 20%</span>
                      <span>Creators 15%</span>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#172554]">
                      <span>AI Strategy Insight</span>
                      <MessageSquare className="w-3.5 h-3.5 text-[#6366F1]" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Pair Instagram Reels with a direct WhatsApp catalogue link to convert warm
                      local buyers in under 1 hour/day.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
