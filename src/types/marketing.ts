export type MarketingGoal =
  | 'Increase Brand Awareness'
  | 'Get First 50 Customers'
  | 'Increase Sales'
  | 'Generate Leads'
  | 'Increase Social Media Engagement'
  | 'Launch a New Product';

export type MarketingPlatform =
  | 'Instagram'
  | 'WhatsApp'
  | 'Facebook'
  | 'YouTube'
  | 'LinkedIn'
  | 'Pinterest';

export type AvailableTimeOption =
  | '30 minutes per day'
  | '1 hour per day'
  | '2 hours per day'
  | '4+ hours per day';

export type BudgetPreset =
  | '₹0 – Free Marketing'
  | '₹1,000'
  | '₹2,500'
  | '₹5,000'
  | '₹10,000+'
  | 'Custom Budget';

export interface MarketingFormInputs {
  businessName: string;
  businessType: string;
  productOrService: string;
  businessLocation: string;
  businessDescription: string;
  goals: MarketingGoal[];
  ageGroup: string;
  gender: string;
  customerInterests: string;
  targetMarket: string;
  budgetPreset: BudgetPreset;
  budgetAmount: number;
  platforms: MarketingPlatform[];
  availableTime: AvailableTimeOption;
}

export interface AudienceSegment {
  segmentName: string;
  ageRange: string;
  interests: string[];
  bestPlatform: string;
  buyingMotivation: string;
}

export interface SevenDayPlanRow {
  day: string;
  theme: string;
  platform: string;
  contentIdea: string;
  caption: string;
  hashtags: string[];
  targetAudience: string;
  goalKpi: string;
}

export interface BudgetAllocationItem {
  category: string;
  percentage: number;
  amountInr: number;
  rationale: string;
}

export interface DailyActionItem {
  timeSlot: string;
  task: string;
  impact: string;
}

export interface PerformanceMetric {
  metric: string;
  target: string;
  timeframe: string;
  measurementMethod: string;
}

export interface RecommendationTip {
  title: string;
  tip: string;
}

export interface MarketingStrategyResult {
  summaryNote: string;
  businessAnalysis: {
    overview: string;
    keySellingPoints: string[];
    opportunities: string[];
  };
  audienceTargeting: AudienceSegment[];
  marketingStrategy: {
    recommendedPlatforms: string[];
    contentStrategy: string;
    customerAcquisitionStrategy: string;
    promotionalIdeas: string[];
  };
  sevenDayPlan: SevenDayPlanRow[];
  budgetAllocation: BudgetAllocationItem[];
  dailyActionPlan: {
    timeCommitment: string;
    schedule: DailyActionItem[];
  };
  performanceTracking: PerformanceMetric[];
  additionalRecommendations: RecommendationTip[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isDemo?: boolean;
}
