import {
  BarChart3,
  CalendarDays,
  Clock,
  Compass,
  Hash,
  IndianRupee,
  Lightbulb,
  PenTool,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';

interface LandingSectionsProps {
  onSelectFeature: (prompt: string) => void;
  onStartBuilder: () => void;
}

const PROBLEMS = [
  {
    number: '01',
    title: 'No Clear Strategy',
    description:
      "Small business owners don't know where to start or which marketing activities will help their business grow.",
    icon: Compass,
  },
  {
    number: '02',
    title: 'Limited Budget',
    description:
      'Hiring marketing agencies or professional consultants can be expensive for small businesses.',
    icon: Wallet,
  },
  {
    number: '03',
    title: 'Content Creation Struggles',
    description:
      'Business owners often run out of ideas for social media posts, captions, campaigns, and promotions.',
    icon: PenTool,
  },
  {
    number: '04',
    title: 'Lack of Time',
    description:
      'Managing a business while planning and executing marketing activities can be overwhelming.',
    icon: Clock,
  },
];

const SOLUTIONS = [
  {
    title: 'Smart Strategy Planning',
    description: 'Generates customised marketing strategies for individual businesses.',
    icon: Target,
  },
  {
    title: 'Audience Targeting',
    description: 'Identifies customer segments and their interests.',
    icon: Users,
  },
  {
    title: 'Content Generation',
    description: 'Creates social media captions, post ideas, hashtags, and campaign concepts.',
    icon: Sparkles,
  },
  {
    title: 'Budget Optimisation',
    description: 'Suggests how to distribute marketing budgets effectively.',
    icon: IndianRupee,
  },
];

const FEATURES = [
  {
    title: 'AI Marketing Strategy Generator',
    description: 'Builds a complete growth roadmap matched to your product, market, and stage.',
    prompt: 'Create a marketing plan for my business.',
    icon: Rocket,
  },
  {
    title: '7-Day Marketing Plan Generator',
    description: 'Produces a full week of daily themes, post formats, captions, and KPIs.',
    prompt: 'Create a 7-day social media content schedule for my business.',
    icon: CalendarDays,
  },
  {
    title: 'Target Audience Analyzer',
    description: 'Breaks down buyer segments by age, interests, motivation, and best channels.',
    prompt: 'Help me find my target audience.',
    icon: Users,
  },
  {
    title: 'Social Media Caption Writer',
    description: 'Drafts ready-to-post captions tailored to Instagram, WhatsApp, or LinkedIn.',
    prompt: 'Write Instagram captions.',
    icon: PenTool,
  },
  {
    title: 'Hashtag Generator',
    description: 'Selects niche, local, and category hashtags that improve organic discovery.',
    prompt: 'Suggest high-intent local and niche hashtags for my business.',
    icon: Hash,
  },
  {
    title: 'Marketing Budget Planner',
    description: 'Divides your INR budget across ads, content creation, offers, and creators.',
    prompt: 'How should I spend my marketing budget?',
    icon: IndianRupee,
  },
  {
    title: 'Campaign Idea Generator',
    description: 'Crafts seasonal promos, referral loops, and launch pushes that drive enquiries.',
    prompt: 'Plan a product launch campaign.',
    icon: Lightbulb,
  },
  {
    title: 'Marketing Performance Tracker',
    description: 'Sets practical weekly KPIs and simple tracking methods you can measure fast.',
    prompt: 'What weekly KPIs should I track for my marketing campaigns?',
    icon: BarChart3,
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Tell Us About Your Business',
    description: 'Enter your business type, products, industry, and location.',
  },
  {
    step: '02',
    title: 'Set Your Marketing Goals',
    description: 'Select goals such as brand awareness, customer acquisition, engagement, or sales.',
  },
  {
    step: '03',
    title: 'Share Your Budget and Platforms',
    description: 'Enter your marketing budget, preferred social media platforms, and time availability.',
  },
  {
    step: '04',
    title: 'Generate Your Marketing Plan',
    description:
      'Get a personalised strategy with actionable steps, content ideas, captions, hashtags, and budget recommendations.',
  },
];

export function LandingSections({ onSelectFeature, onStartBuilder }: LandingSectionsProps) {
  return (
    <>
      {/* 2. Problem Section */}
      <section id="problem" className="py-16 lg:py-22 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 mb-10">
            <p className="text-sm font-semibold text-[#6366F1]">The Challenge</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#172554] [text-wrap:balance]">
              Marketing Is Hard When You&apos;re Doing Everything Alone.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROBLEMS.map((problem) => {
              const Icon = problem.icon;
              return (
                <div
                  key={problem.title}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between transition-colors hover:border-[#8B8CF6]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-center text-[#172554]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs text-slate-400 tabular-nums">
                        {problem.number}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#172554]">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{problem.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Solution Section */}
      <section id="solution" className="py-16 lg:py-22 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-sm font-semibold text-[#6366F1]">The Solution</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#172554] [text-wrap:balance]">
                Meet Your Personal AI Marketing Assistant.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                MarketMate AI takes the confusion out of marketing. Simply tell us about your
                business, and our AI creates a personalised marketing strategy based on your goals,
                audience, budget, and available time.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onStartBuilder}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#6366F1] hover:bg-[#172554] rounded-xl transition-colors cursor-pointer"
                >
                  Try Strategy Builder
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {SOLUTIONS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6 space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#6366F1]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#172554]">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-16 lg:py-22 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-semibold text-[#6366F1]">Toolkit</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#172554] [text-wrap:balance]">
                Eight Focused Tools Built for Small Business Growth.
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-sm">
              Select any capability below to ask the AI Assistant directly or build your full plan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.title}
                  type="button"
                  onClick={() => onSelectFeature(feature.prompt)}
                  className="text-left group bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#6366F1] hover:shadow-md hover:shadow-indigo-950/[0.04] transition-all cursor-pointer flex flex-col justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50/70 text-[#6366F1] flex items-center justify-center group-hover:bg-[#6366F1] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs text-slate-400 tabular-nums">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold text-[#172554]">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#6366F1] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Open in Assistant →
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="py-16 lg:py-22 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 mb-12">
            <p className="text-sm font-semibold text-[#6366F1]">Workflow</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#172554] [text-wrap:balance]">
              Your Marketing Strategy in 4 Simple Steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="relative bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6 space-y-3"
              >
                <div className="font-mono text-sm font-semibold text-[#6366F1] tabular-nums">
                  Step {item.step}
                </div>
                <h3 className="font-display text-lg font-bold text-[#172554]">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
