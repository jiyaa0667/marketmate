import { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Edit3,
  RefreshCw,
  Send,
  Sparkles,
  Users,
  Wand2,
} from 'lucide-react';
import {
  MarketingFormInputs,
  MarketingStrategyResult,
  SevenDayPlanRow,
} from '../types/marketing';
import { downloadStrategyPdf, formatStrategyAsText } from '../utils/exportStrategy';

interface StrategyResultsProps {
  inputs: MarketingFormInputs;
  strategy: MarketingStrategyResult;
  source: 'live-ai' | 'demo';
  isRefining: boolean;
  refineError: string | null;
  onRegenerate: () => void;
  onRefine: (instruction: string) => void;
  onUpdateStrategy: (updated: MarketingStrategyResult) => void;
  onJumpToAudienceInput: () => void;
}

const CHART_COLORS = ['#172554', '#6366F1', '#8B8CF6', '#334155', '#4F46E5'];

const QUICK_FOLLOW_UPS = [
  'Make Day 3 more engaging.',
  'Reduce my budget to ₹3,000.',
  'Write premium Instagram captions.',
  'Create a WhatsApp promotional message.',
];

export function StrategyResults({
  inputs,
  strategy,
  source,
  isRefining,
  refineError,
  onRegenerate,
  onRefine,
  onUpdateStrategy,
  onJumpToAudienceInput,
}: StrategyResultsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedRowIdx, setCopiedRowIdx] = useState<number | null>(null);
  const [followUpText, setFollowUpText] = useState('');
  const [hoveredBudgetIdx, setHoveredBudgetIdx] = useState<number | null>(null);

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(formatStrategyAsText(inputs, strategy));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const handleCopyCaption = async (caption: string, hashtags: string[], idx: number) => {
    try {
      await navigator.clipboard.writeText(`${caption}\n\n${hashtags.join(' ')}`);
      setCopiedRowIdx(idx);
      setTimeout(() => setCopiedRowIdx(null), 1800);
    } catch {
      // Ignore
    }
  };

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpText.trim() || isRefining) return;
    onRefine(followUpText.trim());
    setFollowUpText('');
  };

  const updateOverview = (overview: string) => {
    onUpdateStrategy({
      ...strategy,
      businessAnalysis: { ...strategy.businessAnalysis, overview },
    });
  };

  const updateContentStrategy = (contentStrategy: string) => {
    onUpdateStrategy({
      ...strategy,
      marketingStrategy: { ...strategy.marketingStrategy, contentStrategy },
    });
  };

  const updateDayRow = (index: number, patch: Partial<SevenDayPlanRow>) => {
    const nextPlan = strategy.sevenDayPlan.map((row, idx) =>
      idx === index ? { ...row, ...patch } : row
    );
    onUpdateStrategy({ ...strategy, sevenDayPlan: nextPlan });
  };

  const totalBudgetDisplay = strategy.budgetAllocation.reduce(
    (sum, item) => sum + (Number(item.amountInr) || 0),
    0
  );

  // Compute SVG donut chart segments
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  let runningOffset = 0;

  return (
    <div className="space-y-8 pt-4">
      {/* Source Status Header + Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-semibold text-[#172554]">
                {source === 'live-ai' ? 'Live AI Strategy' : 'Demo Mode (Sample Strategy)'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{inputs.businessName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                ₹{inputs.budgetAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold text-[#172554] mt-1">
              Personalised Growth &amp; 7-Day Marketing Plan
            </h3>
          </div>

          {source === 'demo' && (
            <div className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-sm">
              Demo Mode Active: Showing realistic sample strategy data. Configure{' '}
              <span className="font-mono">GEMINI_API_KEY</span> for live AI tailoring.
            </div>
          )}
        </div>

        {strategy.summaryNote && (
          <p className="text-sm text-slate-600 leading-relaxed">{strategy.summaryNote}</p>
        )}

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            type="button"
            disabled={isRefining}
            onClick={onRegenerate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#172554] bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefining ? 'animate-spin' : ''}`} />
            Regenerate Strategy
          </button>

          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isEditing
                ? 'bg-[#6366F1] text-white border-[#6366F1]'
                : 'bg-[#F8FAFC] text-[#172554] hover:bg-slate-100 border-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditing ? 'Done Editing' : 'Edit Marketing Plan'}
          </button>

          <button
            type="button"
            disabled={isRefining}
            onClick={() =>
              onRefine(
                'Improve all 7 social media captions to be sharper, higher-converting, and more engaging while keeping the rest of the plan unchanged.'
              )
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#172554] bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#6366F1]" />
            Improve Captions
          </button>

          <button
            type="button"
            onClick={onJumpToAudienceInput}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#172554] bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-[#6366F1]" />
            Change Target Audience
          </button>

          <button
            type="button"
            onClick={() => downloadStrategyPdf(inputs, strategy)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#172554] hover:bg-[#6366F1] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download Marketing Plan as PDF
          </button>

          <button
            type="button"
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#172554] bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copied Strategy
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Strategy
              </>
            )}
          </button>
        </div>

        {/* Inline Follow-Up Refinement Bar */}
        <div className="pt-3 border-t border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="strategy-followup" className="text-xs font-semibold text-[#172554]">
              Modify Specific Sections With AI
            </label>
            <span className="text-xs text-slate-500">
              Updates only the requested section while preserving the rest
            </span>
          </div>

          <form onSubmit={handleFollowUpSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <input
              id="strategy-followup"
              type="text"
              value={followUpText}
              onChange={(e) => setFollowUpText(e.target.value)}
              placeholder='e.g., "Make Day 3 more engaging." or "Reduce my budget to ₹3,000."'
              className="flex-1 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:bg-white"
            />
            <button
              type="submit"
              disabled={!followUpText.trim() || isRefining}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#6366F1] hover:bg-[#172554] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isRefining ? 'Updating...' : 'Apply Change'}
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2">
            {QUICK_FOLLOW_UPS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={isRefining}
                onClick={() => onRefine(prompt)}
                className="text-xs font-medium text-slate-600 hover:text-[#172554] bg-[#F8FAFC] hover:bg-indigo-50/70 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {refineError && (
            <div
              role="alert"
              className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
            >
              {refineError}
            </div>
          )}
        </div>
      </div>

      {/* 1. Business Analysis */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="space-y-1">
          <div className="font-mono text-xs text-[#6366F1]">01</div>
          <h4 className="font-display text-xl font-bold text-[#172554]">Business Analysis</h4>
        </div>

        {isEditing ? (
          <textarea
            value={strategy.businessAnalysis.overview}
            onChange={(e) => updateOverview(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-[#6366F1] bg-[#F8FAFC] p-3 text-sm text-[#1E293B] focus:outline-none"
          />
        ) : (
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {strategy.businessAnalysis.overview}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200/80">
          <div className="space-y-2.5">
            <h5 className="text-sm font-semibold text-[#172554]">Key Selling Points</h5>
            <ul className="space-y-2">
              {strategy.businessAnalysis.keySellingPoints.map((point, idx) => (
                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2.5">
                  <span className="font-mono text-xs text-[#6366F1] mt-0.5 tabular-nums">
                    0{idx + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2.5">
            <h5 className="text-sm font-semibold text-[#172554]">Main Marketing Opportunities</h5>
            <ul className="space-y-2">
              {strategy.businessAnalysis.opportunities.map((opp, idx) => (
                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2.5">
                  <span className="font-mono text-xs text-[#6366F1] mt-0.5 tabular-nums">
                    0{idx + 1}
                  </span>
                  <span>{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Audience Targeting */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="space-y-1">
          <div className="font-mono text-xs text-[#6366F1]">02</div>
          <h4 className="font-display text-xl font-bold text-[#172554]">Audience Targeting</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {strategy.audienceTargeting.map((segment, idx) => (
            <div
              key={`${segment.segmentName}-${idx}`}
              className="bg-[#F8FAFC] rounded-xl border border-slate-200 p-5 space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono tabular-nums">Segment 0{idx + 1}</span>
                <span className="font-semibold text-[#6366F1]">{segment.bestPlatform}</span>
              </div>
              <h5 className="font-display text-base font-bold text-[#172554]">
                {segment.segmentName}
              </h5>
              <div className="text-xs text-slate-600 space-y-1.5">
                <div>
                  <span className="font-semibold text-[#1E293B]">Age Range:</span>{' '}
                  <span className="font-mono tabular-nums">{segment.ageRange}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#1E293B]">Interests:</span>{' '}
                  <span>{segment.interests.join(' · ')}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#1E293B]">Buying Motivation:</span>{' '}
                  <span>{segment.buyingMotivation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Marketing Strategy */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="font-mono text-xs text-[#6366F1]">03</div>
            <h4 className="font-display text-xl font-bold text-[#172554]">Marketing Strategy</h4>
          </div>
          <div className="text-xs text-slate-500">
            Recommended Platforms:{' '}
            <span className="font-semibold text-[#172554]">
              {strategy.marketingStrategy.recommendedPlatforms.join(' · ')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h5 className="text-sm font-semibold text-[#172554]">Content Strategy</h5>
            {isEditing ? (
              <textarea
                value={strategy.marketingStrategy.contentStrategy}
                onChange={(e) => updateContentStrategy(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-[#6366F1] bg-[#F8FAFC] p-3 text-sm text-[#1E293B] focus:outline-none"
              />
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed">
                {strategy.marketingStrategy.contentStrategy}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h5 className="text-sm font-semibold text-[#172554]">Customer Acquisition Strategy</h5>
            <p className="text-sm text-slate-600 leading-relaxed">
              {strategy.marketingStrategy.customerAcquisitionStrategy}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/80 space-y-2.5">
          <h5 className="text-sm font-semibold text-[#172554]">Promotional Ideas</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strategy.marketingStrategy.promotionalIdeas.map((idea, idx) => (
              <div
                key={idx}
                className="bg-[#F8FAFC] rounded-xl border border-slate-200 p-4 text-sm text-slate-700 leading-relaxed"
              >
                <span className="font-mono text-xs text-[#6366F1] block mb-1 tabular-nums">
                  Idea 0{idx + 1}
                </span>
                {idea}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 7-Day Marketing Plan */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="font-mono text-xs text-[#6366F1]">04</div>
            <h4 className="font-display text-xl font-bold text-[#172554]">
              7-Day Marketing Plan
            </h4>
          </div>
          <span className="text-xs text-slate-500">
            {isEditing
              ? 'Editing enabled — modify any theme, idea, or caption directly.'
              : 'Click Edit Marketing Plan above to customise any row.'}
          </span>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[960px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                <th className="py-3 pr-3 w-20">Day</th>
                <th className="py-3 px-3 w-36">Theme</th>
                <th className="py-3 px-3 w-28">Platform</th>
                <th className="py-3 px-3 w-52">Content Idea</th>
                <th className="py-3 px-3 w-64">Ready-to-Post Caption</th>
                <th className="py-3 px-3 w-40">Hashtags</th>
                <th className="py-3 px-3 w-36">Target Audience</th>
                <th className="py-3 pl-3 w-36">Goal / KPI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 text-sm text-[#1E293B]">
              {strategy.sevenDayPlan.map((row, idx) => (
                <tr key={`${row.day}-${idx}`} className="align-top hover:bg-[#F8FAFC]/80">
                  <td className="py-4 pr-3 font-mono text-xs font-semibold text-[#172554] whitespace-nowrap tabular-nums">
                    {row.day}
                  </td>
                  <td className="py-4 px-3 font-medium text-[#172554]">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.theme}
                        onChange={(e) => updateDayRow(idx, { theme: e.target.value })}
                        className="w-full rounded-lg border border-[#6366F1] px-2 py-1 text-xs"
                      />
                    ) : (
                      row.theme
                    )}
                  </td>
                  <td className="py-4 px-3 text-xs font-semibold text-[#6366F1] whitespace-nowrap">
                    {row.platform}
                  </td>
                  <td className="py-4 px-3 text-xs text-slate-600 leading-relaxed">
                    {isEditing ? (
                      <textarea
                        value={row.contentIdea}
                        onChange={(e) => updateDayRow(idx, { contentIdea: e.target.value })}
                        rows={3}
                        className="w-full rounded-lg border border-[#6366F1] px-2 py-1 text-xs"
                      />
                    ) : (
                      row.contentIdea
                    )}
                  </td>
                  <td className="py-4 px-3 text-xs text-slate-700 leading-relaxed space-y-2">
                    {isEditing ? (
                      <textarea
                        value={row.caption}
                        onChange={(e) => updateDayRow(idx, { caption: e.target.value })}
                        rows={4}
                        className="w-full rounded-lg border border-[#6366F1] px-2 py-1 text-xs"
                      />
                    ) : (
                      <>
                        <p>{row.caption}</p>
                        <button
                          type="button"
                          onClick={() => handleCopyCaption(row.caption, row.hashtags, idx)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6366F1] hover:text-[#172554] cursor-pointer"
                        >
                          {copiedRowIdx === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              Copied caption
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy caption
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </td>
                  <td className="py-4 px-3 font-mono text-[11px] text-slate-500 leading-relaxed">
                    {row.hashtags.join(' ')}
                  </td>
                  <td className="py-4 px-3 text-xs text-slate-600">{row.targetAudience}</td>
                  <td className="py-4 pl-3 text-xs font-medium text-[#172554] tabular-nums">
                    {row.goalKpi}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Budget Allocation & 6. Daily Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Budget Allocation Visual Chart */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-mono text-xs text-[#6366F1]">05</div>
              <h4 className="font-display text-xl font-bold text-[#172554]">Budget Allocation</h4>
            </div>
            <div className="font-mono text-sm font-semibold text-[#172554] tabular-nums">
              Total: ₹{totalBudgetDisplay.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* SVG Donut Chart */}
            <div className="sm:col-span-5 flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="18"
                  />
                  {strategy.budgetAllocation.map((item, idx) => {
                    const segLength = (item.percentage / 100) * circumference;
                    const dashArray = `${segLength} ${circumference - segLength}`;
                    const dashOffset = -runningOffset;
                    runningOffset += segLength;
                    return (
                      <circle
                        key={`${item.category}-${idx}`}
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="none"
                        stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                        strokeWidth={hoveredBudgetIdx === idx ? '22' : '18'}
                        strokeDasharray={dashArray}
                        strokeDashoffset={dashOffset}
                        className="transition-all cursor-pointer"
                        onMouseEnter={() => setHoveredBudgetIdx(idx)}
                        onMouseLeave={() => setHoveredBudgetIdx(null)}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                  <span className="text-[11px] text-slate-500">
                    {hoveredBudgetIdx !== null
                      ? strategy.budgetAllocation[hoveredBudgetIdx]?.category.split(' ')[0]
                      : 'Monthly'}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#172554] tabular-nums">
                    ₹
                    {(hoveredBudgetIdx !== null
                      ? strategy.budgetAllocation[hoveredBudgetIdx]?.amountInr || 0
                      : totalBudgetDisplay
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="sm:col-span-7 space-y-3">
              {strategy.budgetAllocation.map((item, idx) => (
                <div
                  key={`${item.category}-${idx}`}
                  onMouseEnter={() => setHoveredBudgetIdx(idx)}
                  onMouseLeave={() => setHoveredBudgetIdx(null)}
                  className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-1 transition-colors hover:border-[#8B8CF6]"
                >
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="flex items-center gap-2 font-semibold text-[#172554]">
                      <span
                        className="w-2.5 h-2.5 rounded-xs shrink-0"
                        style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                      />
                      <span>{item.category}</span>
                    </div>
                    <div className="font-mono text-xs font-semibold text-[#172554] whitespace-nowrap tabular-nums">
                      {item.percentage}% · ₹{item.amountInr.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-4.5">
                    {item.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Daily Action Plan */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-mono text-xs text-[#6366F1]">06</div>
              <h4 className="font-display text-xl font-bold text-[#172554]">Daily Action Plan</h4>
            </div>
            <span className="text-xs font-semibold text-[#6366F1] whitespace-nowrap">
              {strategy.dailyActionPlan.timeCommitment}
            </span>
          </div>

          <div className="space-y-3">
            {strategy.dailyActionPlan.schedule.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#F8FAFC] rounded-xl border border-slate-200 p-4 space-y-1.5"
              >
                <div className="font-mono text-xs font-semibold text-[#6366F1]">
                  {item.timeSlot}
                </div>
                <div className="text-sm font-semibold text-[#172554]">{item.task}</div>
                <div className="text-xs text-slate-600">{item.impact}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 7. Performance Tracking & 8. Additional Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div>
            <div className="font-mono text-xs text-[#6366F1]">07</div>
            <h4 className="font-display text-xl font-bold text-[#172554]">Performance Tracking</h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <th className="py-2.5 pr-3">Metric</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">Cadence</th>
                  <th className="py-2.5 pl-3">How to Measure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-xs sm:text-sm">
                {strategy.performanceTracking.map((kpi, idx) => (
                  <tr key={idx} className="align-top">
                    <td className="py-3 pr-3 font-semibold text-[#172554]">{kpi.metric}</td>
                    <td className="py-3 px-3 font-mono text-xs font-semibold text-[#6366F1] tabular-nums">
                      {kpi.target}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{kpi.timeframe}</td>
                    <td className="py-3 pl-3 text-slate-600">{kpi.measurementMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div>
            <div className="font-mono text-xs text-[#6366F1]">08</div>
            <h4 className="font-display text-xl font-bold text-[#172554]">
              Additional Recommendations
            </h4>
          </div>

          <div className="space-y-3">
            {strategy.additionalRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="bg-[#F8FAFC] rounded-xl border border-slate-200 p-4 space-y-1"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-[#172554]">
                  <Sparkles className="w-3.5 h-3.5 text-[#6366F1] shrink-0" />
                  <span>{rec.title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rec.tip}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
