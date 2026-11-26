import { jsPDF } from 'jspdf';
import { MarketingFormInputs, MarketingStrategyResult } from '../types/marketing';

export function formatStrategyAsText(
  inputs: MarketingFormInputs,
  strategy: MarketingStrategyResult
): string {
  const lines: string[] = [];
  lines.push(`MARKETMATE AI — MARKETING STRATEGY`);
  lines.push(`Business: ${inputs.businessName} (${inputs.businessType})`);
  lines.push(`Location: ${inputs.businessLocation} | Budget: ₹${inputs.budgetAmount.toLocaleString('en-IN')}`);
  lines.push(`Goals: ${inputs.goals.join(', ')}`);
  lines.push(`Platforms: ${inputs.platforms.join(', ')} | Time: ${inputs.availableTime}`);
  lines.push('');
  lines.push('1. BUSINESS ANALYSIS');
  lines.push(strategy.businessAnalysis.overview);
  lines.push('Key Selling Points:');
  strategy.businessAnalysis.keySellingPoints.forEach((p) => lines.push(`  • ${p}`));
  lines.push('Opportunities:');
  strategy.businessAnalysis.opportunities.forEach((o) => lines.push(`  • ${o}`));
  lines.push('');
  lines.push('2. AUDIENCE TARGETING');
  strategy.audienceTargeting.forEach((seg, idx) => {
    lines.push(`  ${idx + 1}. ${seg.segmentName} (${seg.ageRange}) — Best on ${seg.bestPlatform}`);
    lines.push(`     Interests: ${seg.interests.join(', ')}`);
    lines.push(`     Motivation: ${seg.buyingMotivation}`);
  });
  lines.push('');
  lines.push('3. MARKETING STRATEGY');
  lines.push(`Recommended Platforms: ${strategy.marketingStrategy.recommendedPlatforms.join(', ')}`);
  lines.push(`Content Strategy: ${strategy.marketingStrategy.contentStrategy}`);
  lines.push(`Customer Acquisition: ${strategy.marketingStrategy.customerAcquisitionStrategy}`);
  lines.push('Promotional Ideas:');
  strategy.marketingStrategy.promotionalIdeas.forEach((idea) => lines.push(`  • ${idea}`));
  lines.push('');
  lines.push('4. 7-DAY MARKETING PLAN');
  strategy.sevenDayPlan.forEach((row) => {
    lines.push(`${row.day} — ${row.theme} (${row.platform})`);
    lines.push(`  Idea: ${row.contentIdea}`);
    lines.push(`  Caption: ${row.caption}`);
    lines.push(`  Hashtags: ${row.hashtags.join(' ')}`);
    lines.push(`  Audience: ${row.targetAudience} | Goal: ${row.goalKpi}`);
  });
  lines.push('');
  lines.push('5. BUDGET ALLOCATION');
  strategy.budgetAllocation.forEach((item) => {
    lines.push(
      `  • ${item.category}: ${item.percentage}% (₹${item.amountInr.toLocaleString('en-IN')}) — ${item.rationale}`
    );
  });
  lines.push('');
  lines.push(`6. DAILY ACTION PLAN (${strategy.dailyActionPlan.timeCommitment})`);
  strategy.dailyActionPlan.schedule.forEach((step) => {
    lines.push(`  • ${step.timeSlot}: ${step.task} (${step.impact})`);
  });
  lines.push('');
  lines.push('7. PERFORMANCE TRACKING & KPIs');
  strategy.performanceTracking.forEach((kpi) => {
    lines.push(`  • ${kpi.metric}: ${kpi.target} (${kpi.timeframe}) via ${kpi.measurementMethod}`);
  });
  lines.push('');
  lines.push('8. ADDITIONAL RECOMMENDATIONS');
  strategy.additionalRecommendations.forEach((rec) => {
    lines.push(`  • ${rec.title}: ${rec.tip}`);
  });

  return lines.join('\n');
}

export function downloadStrategyPdf(
  inputs: MarketingFormInputs,
  strategy: MarketingStrategyResult
): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 44;
  const maxWidth = pageWidth - margin * 2;
  let y = 52;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 48) {
      doc.addPage();
      y = 52;
    }
  };

  const addHeading = (text: string) => {
    ensureSpace(32);
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(23, 37, 84);
    doc.text(text, margin, y);
    y += 6;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;
  };

  const addParagraph = (text: string, boldPrefix?: string) => {
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const fullText = boldPrefix ? `${boldPrefix} ${text}` : text;
    doc.setFont('helvetica', 'normal');
    const wrapped = doc.splitTextToSize(fullText, maxWidth);
    ensureSpace(wrapped.length * 14 + 6);
    doc.text(wrapped, margin, y);
    y += wrapped.length * 14 + 4;
  };

  // Header
  doc.setFillColor(23, 37, 84);
  doc.rect(0, 0, pageWidth, 88, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(`MarketMate AI — ${inputs.businessName}`, margin, 38);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(199, 210, 254);
  doc.text(
    `${inputs.businessType} | ${inputs.businessLocation} | Budget: INR ${inputs.budgetAmount.toLocaleString('en-IN')} | ${inputs.availableTime}`,
    margin,
    58
  );
  doc.text(`Goals: ${inputs.goals.join(', ')}`, margin, 74);
  y = 112;

  addHeading('1. Business Analysis');
  addParagraph(strategy.businessAnalysis.overview);
  strategy.businessAnalysis.keySellingPoints.forEach((pt) => addParagraph(`• ${pt}`));
  strategy.businessAnalysis.opportunities.forEach((op) => addParagraph(`• Opportunity: ${op}`));

  addHeading('2. Audience Targeting');
  strategy.audienceTargeting.forEach((seg, idx) => {
    addParagraph(
      `${idx + 1}. ${seg.segmentName} (Age ${seg.ageRange}, Best on ${seg.bestPlatform}) — Interests: ${seg.interests.join(', ')}. Motivation: ${seg.buyingMotivation}`
    );
  });

  addHeading('3. Marketing Strategy');
  addParagraph(strategy.marketingStrategy.recommendedPlatforms.join(', '), 'Platforms:');
  addParagraph(strategy.marketingStrategy.contentStrategy, 'Content Strategy:');
  addParagraph(strategy.marketingStrategy.customerAcquisitionStrategy, 'Customer Acquisition:');
  strategy.marketingStrategy.promotionalIdeas.forEach((idea) => addParagraph(`• ${idea}`));

  addHeading('4. 7-Day Marketing Plan');
  strategy.sevenDayPlan.forEach((row) => {
    addParagraph(
      `${row.day} (${row.platform}) — ${row.theme}: ${row.contentIdea} | Caption: "${row.caption}" | Hashtags: ${row.hashtags.join(' ')} | Goal: ${row.goalKpi}`
    );
  });

  addHeading('5. Budget Allocation');
  strategy.budgetAllocation.forEach((b) => {
    addParagraph(
      `• ${b.category}: ${b.percentage}% (INR ${b.amountInr.toLocaleString('en-IN')}) — ${b.rationale}`
    );
  });

  addHeading(`6. Daily Action Plan (${strategy.dailyActionPlan.timeCommitment})`);
  strategy.dailyActionPlan.schedule.forEach((item) => {
    addParagraph(`• ${item.timeSlot}: ${item.task} — ${item.impact}`);
  });

  addHeading('7. Performance Tracking & KPIs');
  strategy.performanceTracking.forEach((kpi) => {
    addParagraph(`• ${kpi.metric}: ${kpi.target} (${kpi.timeframe}) — ${kpi.measurementMethod}`);
  });

  addHeading('8. Additional Recommendations');
  strategy.additionalRecommendations.forEach((rec) => {
    addParagraph(`• ${rec.title}: ${rec.tip}`);
  });

  const safeSlug = (inputs.businessName || 'marketing-plan')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  doc.save(`${safeSlug}-marketmate-strategy.pdf`);
}
