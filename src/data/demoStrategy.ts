import { MarketingFormInputs, MarketingStrategyResult } from '../types/marketing';

export const DEFAULT_FORM_INPUTS: MarketingFormInputs = {
  businessName: 'Kora Botanics',
  businessType: 'Small-Batch Natural Skincare',
  productOrService: 'Cold-pressed kumkumadi facial oils, clay masks, and gift hampers',
  businessLocation: 'Bengaluru, India',
  businessDescription:
    'Handcrafted botanical skincare made in small batches using locally sourced saffron, vetiver, and cold-pressed oils for humid Indian weather.',
  goals: ['Get First 50 Customers', 'Increase Brand Awareness'],
  ageGroup: '22–38',
  gender: 'All (primarily women)',
  customerInterests: 'Clean beauty, Ayurveda, mindful routines, sustainable gifting',
  targetMarket: 'Bengaluru & Metro Cities across India',
  budgetPreset: '₹5,000',
  budgetAmount: 5000,
  platforms: ['Instagram', 'WhatsApp', 'YouTube'],
  availableTime: '1 hour per day',
};

export function buildDemoStrategy(inputs: MarketingFormInputs): MarketingStrategyResult {
  const brand = inputs.businessName.trim() || 'Your Business';
  const product = inputs.productOrService.trim() || 'your core product or service';
  const location = inputs.businessLocation.trim() || 'your local market';
  const targetMarket = inputs.targetMarket.trim() || location;
  const budget = Math.max(0, Number(inputs.budgetAmount) || 0);
  const platforms = inputs.platforms.length > 0 ? inputs.platforms : ['Instagram', 'WhatsApp'];
  const primaryPlatform = platforms[0];
  const secondaryPlatform = platforms[1] || platforms[0];

  const isZeroBudget = budget === 0;
  const budgetAllocation = isZeroBudget
    ? [
        {
          category: 'Organic Short-Form Content',
          percentage: 45,
          amountInr: 0,
          rationale: 'Reels, behind-the-scenes clips, and founder stories produced on a smartphone.',
        },
        {
          category: 'WhatsApp & Referral Loops',
          percentage: 25,
          amountInr: 0,
          rationale: 'Personal broadcast lists, sample swaps, and word-of-mouth friend referrals.',
        },
        {
          category: 'Local Community & Collabs',
          percentage: 20,
          amountInr: 0,
          rationale: 'Barter collaborations with micro-creators and neighbourhood pop-ups.',
        },
        {
          category: 'Customer Retention & Reviews',
          percentage: 10,
          amountInr: 0,
          rationale: 'Post-purchase check-ins and Google Business Profile review collection.',
        },
      ]
    : [
        {
          category: 'Targeted Social Ads',
          percentage: 40,
          amountInr: Math.round(budget * 0.4),
          rationale: `Local radius and interest-targeted campaigns on ${primaryPlatform} to drive enquiries.`,
        },
        {
          category: 'Content & Visual Production',
          percentage: 25,
          amountInr: Math.round(budget * 0.25),
          rationale: 'Lighting basics, product props, and clean templates for consistent posts.',
        },
        {
          category: 'Promotions & Starter Offers',
          percentage: 20,
          amountInr: Math.round(budget * 0.2),
          rationale: 'First-order trial bundles, referral credits, and festive combo discounts.',
        },
        {
          category: 'Micro-Creator Seeding & Tools',
          percentage: 15,
          amountInr: budget - Math.round(budget * 0.4) - Math.round(budget * 0.25) - Math.round(budget * 0.2),
          rationale: 'Sending sample kits to 3–5 hyper-local creators and scheduling utilities.',
        },
      ];

  return {
    summaryNote: `Sample Demo Strategy generated for ${brand}. Connect a Gemini API key in Settings > Secrets for live tailored generation.`,
    businessAnalysis: {
      overview: `${brand} operates in ${inputs.businessType || 'a competitive local category'} serving ${targetMarket}. Focusing on ${product} gives you a tangible story that converts well through trust-building visual proof and direct messaging.`,
      keySellingPoints: [
        `Direct, personal craftsmanship and authentic local roots in ${location}`,
        `Clear problem-solution positioning around ${product}`,
        `Nimble decision-making allowing rapid customer feedback and personalised service`,
      ],
      opportunities: [
        `Build a repeatable ${primaryPlatform}-to-${secondaryPlatform} enquiry funnel for high-intent buyers`,
        `Turn early buyers into repeat advocates using simple referral bundles`,
        `Capture local search intent in ${targetMarket} through consistent educational short videos`,
      ],
    },
    audienceTargeting: [
      {
        segmentName: 'Quality-First Local Explorers',
        ageRange: inputs.ageGroup || '24–36',
        interests: [
          inputs.customerInterests.split(',')[0]?.trim() || 'Quality craftsmanship',
          'Local independent brands',
          'Behind-the-scenes stories',
        ],
        bestPlatform: primaryPlatform,
        buyingMotivation: 'Wants trustworthy quality and appreciates knowing who makes what they buy.',
      },
      {
        segmentName: 'Convenience & Value Seekers',
        ageRange: '28–44',
        interests: ['Quick WhatsApp ordering', 'Bundle deals', 'Verified customer reviews'],
        bestPlatform: secondaryPlatform,
        buyingMotivation: 'Prefers fast, friction-free ordering with transparent pricing and clear benefits.',
      },
      {
        segmentName: 'Gifting & Occasion Shoppers',
        ageRange: '22–45',
        interests: ['Curated gift sets', 'Festive shopping', 'Aesthetic packaging'],
        bestPlatform: platforms[2] || primaryPlatform,
        buyingMotivation: 'Looks for thoughtful, ready-to-gift options that feel distinctive.',
      },
    ],
    marketingStrategy: {
      recommendedPlatforms: platforms,
      contentStrategy: `Anchor your week around three content pillars: (1) Product Craft & Proof—show how ${product} solves real customer needs; (2) Customer Social Proof—share genuine reactions and FAQs; (3) Actionable Offers—direct viewers to message or order easily.`,
      customerAcquisitionStrategy: `Pair 4 weekly organic posts on ${primaryPlatform} with a direct call-to-action into ${secondaryPlatform} (WhatsApp catalogue or DM link). Offer a low-friction starter pack for first-time buyers in ${targetMarket}.`,
      promotionalIdeas: [
        `First-50 Customers Starter Kit with complimentary sample or priority delivery in ${location}`,
        'Refer-a-Friend credit: both referrer and friend receive 10% off their next order',
        'Weekend 48-hour WhatsApp broadcast drop for limited batches or combo bundles',
      ],
    },
    sevenDayPlan: [
      {
        day: 'Day 1',
        theme: 'Founder Story & Why',
        platform: primaryPlatform,
        contentIdea: `60-second vertical clip introducing ${brand}, your workspace in ${location}, and why you created ${product}.`,
        caption: `We started ${brand} in ${location} with one simple goal: making ${product} you can genuinely trust every single day. Tap our bio or message us to explore our latest batch.`,
        hashtags: ['#SmallBusinessIndia', '#SupportLocal', '#FounderStory', `#${brand.replace(/[^a-zA-Z0-9]/g, '')}`],
        targetAudience: 'Quality-First Local Explorers',
        goalKpi: 'Profile visits & 25+ saves',
      },
      {
        day: 'Day 2',
        theme: 'Problem vs Solution',
        platform: primaryPlatform,
        contentIdea: `3-slide carousel highlighting the most common frustration your buyers face and how ${product} solves it.`,
        caption: `Tired of guessing what actually works? Here is why customers across ${targetMarket} switch to ${brand} for ${product}. Save this checklist for later.`,
        hashtags: ['#SmartShopping', '#LocalBrand', '#ProductGuide'],
        targetAudience: 'Quality-First Local Explorers',
        goalKpi: 'Carousel shares & DMs',
      },
      {
        day: 'Day 3',
        theme: 'Behind the Scenes',
        platform: secondaryPlatform,
        contentIdea: 'Raw, unpolished packing and quality-check reel showing care, hygiene, and real textures.',
        caption: `Morning prep at ${brand}. Every order is packed by hand in ${location} before heading out. Want us to reserve one for you today? Reply "ORDER" below.`,
        hashtags: ['#BehindTheScenes', '#HandmadeWithCare', '#SmallBatch'],
        targetAudience: 'Convenience & Value Seekers',
        goalKpi: '10+ direct enquiries',
      },
      {
        day: 'Day 4',
        theme: 'Customer Proof & FAQ',
        platform: primaryPlatform,
        contentIdea: 'Screenshot or quote of real customer feedback paired with your top 2 frequently asked questions.',
        caption: `"Wish I found this sooner!" Here are the honest answers to the two questions we get asked most about ${product}.`,
        hashtags: ['#CustomerLove', '#VerifiedReviews', '#HonestQuality'],
        targetAudience: 'Convenience & Value Seekers',
        goalKpi: 'Link clicks & WhatsApp taps',
      },
      {
        day: 'Day 5',
        theme: 'How-To / Value Demo',
        platform: platforms[2] || primaryPlatform,
        contentIdea: `Short tutorial showing 3 practical ways to get the best value from ${product}.`,
        caption: `3 quick ways to get the most out of ${product} in under 2 minutes. Which tip are you trying first?`,
        hashtags: ['#HowToGuide', '#DailyRoutine', '#TipsAndTricks'],
        targetAudience: 'Quality-First Local Explorers',
        goalKpi: 'Watch time & saves',
      },
      {
        day: 'Day 6',
        theme: 'Weekend Starter Offer',
        platform: 'WhatsApp',
        contentIdea: 'Clean broadcast card announcing a weekend First-Time Buyer Combo or free local shipping.',
        caption: `Weekend Special from ${brand}: Order our starter combo before Sunday 9 PM and get complimentary priority dispatch across ${location}. Reply "YES" to claim yours.`,
        hashtags: ['#WeekendOffer', '#StarterPack', '#ShopLocal'],
        targetAudience: 'Gifting & Occasion Shoppers',
        goalKpi: '5–10 direct orders',
      },
      {
        day: 'Day 7',
        theme: 'Weekly Recap & Community Poll',
        platform: primaryPlatform,
        contentIdea: 'Interactive Story poll asking followers which variant, scent, or bundle they want featured next week.',
        caption: `Thank you for an amazing week! Help us decide what we create next at ${brand}—vote in our stories and grab the last spots from this week's batch.`,
        hashtags: ['#CommunityFirst', '#WeeklyRecap', '#SmallBusinessJourney'],
        targetAudience: 'All Segments',
        goalKpi: 'Poll votes & repeat engagement',
      },
    ],
    budgetAllocation,
    dailyActionPlan: {
      timeCommitment: inputs.availableTime,
      schedule: [
        {
          timeSlot: 'First 15 mins',
          task: 'Reply to all DMs, comments, and WhatsApp enquiries from the past 24 hours.',
          impact: 'Fast replies double conversion rates for small businesses.',
        },
        {
          timeSlot: 'Middle block',
          task: `Create or schedule today's post from the 7-day plan (${inputs.availableTime} window).`,
          impact: 'Maintains consistent visibility without daily creative burnout.',
        },
        {
          timeSlot: 'Final 15 mins',
          task: `Engage thoughtfully on 10 local community or complementary business accounts in ${location}.`,
          impact: 'Drives organic discovery among high-intent nearby buyers.',
        },
      ],
    },
    performanceTracking: [
      {
        metric: 'Qualified Enquiries / DMs',
        target: '25–40 per week',
        timeframe: 'Weekly',
        measurementMethod: `Count inbound messages on ${secondaryPlatform} and ${primaryPlatform}.`,
      },
      {
        metric: 'New Customer Orders',
        target: inputs.goals.includes('Get First 50 Customers') ? '12–15 orders/week toward 50 customers' : '15% week-over-week growth',
        timeframe: 'Weekly',
        measurementMethod: 'Order ledger or WhatsApp invoice count.',
      },
      {
        metric: 'Content Saves & Shares',
        target: '5%+ engagement rate on educational posts',
        timeframe: 'Per Post (48 hrs)',
        measurementMethod: `${primaryPlatform} native Insights tab.`,
      },
      {
        metric: 'Cost per Enquiry',
        target: isZeroBudget ? '₹0 (100% organic)' : `Under ₹${Math.max(40, Math.round(budget / 50))}`,
        timeframe: 'Bi-weekly',
        measurementMethod: 'Total ad spend divided by enquiries generated.',
      },
    ],
    additionalRecommendations: [
      {
        title: 'Optimise Your Bio & WhatsApp Catalogue First',
        tip: `Before boosting any post, make sure your ${primaryPlatform} bio states what you sell, where you ship (${targetMarket}), and includes a one-tap WhatsApp order link.`,
      },
      {
        title: 'Batch Film Once a Week',
        tip: `Use a 60-minute window on Sunday to capture 4 short raw clips in natural window light so you never scramble on busy weekdays.`,
      },
      {
        title: 'Collect Micro-Testimonials Early',
        tip: 'Ask your first 10 buyers for a 1-sentence WhatsApp review and permission to share a screenshot—social proof outperforms polished ads.',
      },
    ],
  };
}
