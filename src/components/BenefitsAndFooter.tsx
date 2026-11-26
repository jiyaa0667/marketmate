import { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface BenefitsAndFooterProps {
  onBuildPlan: () => void;
  onNavigate: (sectionId: string) => void;
}

const BENEFITS = [
  {
    title: 'Clarity Over Guesswork',
    detail:
      'Replace scattered random posts with a cohesive weekly theme, audience target, and clear goal per post.',
  },
  {
    title: 'Agency-Level Thinking Without Agency Retainers',
    detail:
      'Optimise ₹0 organic workflows or ₹1,000–₹10,000+ monthly ad budgets so every rupee works harder.',
  },
  {
    title: 'Built Around Your Real Schedule',
    detail:
      'Whether you have 30 minutes or 4 hours a day, your daily action checklist stays realistic and repeatable.',
  },
  {
    title: 'Editable, Exportable, Ready to Execute',
    detail:
      'Refine captions with follow-up prompts, edit any table row inline, copy instantly, or export a clean PDF.',
  },
];

export function BenefitsAndFooter({ onBuildPlan, onNavigate }: BenefitsAndFooterProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <>
      {/* 7. Benefits & About Section */}
      <section id="about" className="py-16 lg:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-6">
              <div className="h-full min-h-[320px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                {!imgFailed ? (
                  <img
                    src="/src/assets/images/small_business_studio_1795670884621.jpg"
                    alt="Small business founder planning product marketing in a sunlit studio"
                    referrerPolicy="no-referrer"
                    onError={() => setImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full min-h-[320px] bg-gradient-to-br from-[#172554] via-[#1E293B] to-[#6366F1] flex flex-col items-center justify-center p-8 text-white text-center">
                    <Sparkles className="w-10 h-10 text-indigo-200 mb-3" />
                    <p className="font-display text-lg font-bold">MarketMate AI Studio</p>
                    <p className="text-sm text-indigo-100 mt-1 max-w-xs">
                      Designed for founders, home businesses, and solo creators.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#6366F1]">Why Founders Choose MarketMate AI</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#172554] [text-wrap:balance]">
                  Built so Small Teams Move With Confidence.
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  You don&apos;t need to be a marketing expert. MarketMate AI acts as a practical
                  marketing partner that guides your business from scattered ideas to a clear,
                  personalised weekly action plan.
                </p>
              </div>

              <div className="space-y-4 pt-1">
                {BENEFITS.map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#6366F1] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-display text-base font-bold text-[#172554]">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                        {benefit.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call-to-Action Section */}
      <section className="py-16 lg:py-20 bg-[#172554] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-sm font-semibold text-[#8B8CF6]">
            Your Business. Your Strategy. Your AI Marketing Partner.
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight [text-wrap:balance]">
            Turn Your Business Idea Into a Clear 7-Day Growth Plan Today.
          </h2>
          <p className="text-base sm:text-lg text-indigo-100/90 max-w-2xl mx-auto">
            Plan smarter, market better, and grow faster with AI—tailored to your audience, INR
            budget, and daily schedule.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onBuildPlan}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-[#172554] bg-white hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Build My Marketing Plan
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 9. Quiet Footer */}
      <footer className="bg-[#F8FAFC] border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-display text-base font-bold text-[#172554]">MarketMate AI</div>
            <p className="text-xs text-slate-500">
              Your Business. Your Strategy. Your AI Marketing Partner.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
            {[
              { label: 'Home', target: 'home' },
              { label: 'Problem', target: 'problem' },
              { label: 'Solution', target: 'solution' },
              { label: 'Features', target: 'features' },
              { label: 'AI Assistant', target: 'ai-assistant' },
              { label: 'About', target: 'about' },
            ].map((item) => (
              <a
                key={item.target}
                href={`#${item.target}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.target);
                }}
                className="hover:text-[#172554] transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} MarketMate AI. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
