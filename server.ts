import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import type { Schema } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '2mb' }));

const STRATEGY_MODEL = 'gemini-4-hydrogen';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const strategyResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summaryNote: {
      type: Type.STRING,
      description: 'A brief 1-2 sentence summary of the strategy or what changed.',
    },
    businessAnalysis: {
      type: Type.OBJECT,
      properties: {
        overview: { type: Type.STRING },
        keySellingPoints: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        opportunities: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ['overview', 'keySellingPoints', 'opportunities'],
    },
    audienceTargeting: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          segmentName: { type: Type.STRING },
          ageRange: { type: Type.STRING },
          interests: { type: Type.ARRAY, items: { type: Type.STRING } },
          bestPlatform: { type: Type.STRING },
          buyingMotivation: { type: Type.STRING },
        },
        required: ['segmentName', 'ageRange', 'interests', 'bestPlatform', 'buyingMotivation'],
      },
    },
    marketingStrategy: {
      type: Type.OBJECT,
      properties: {
        recommendedPlatforms: { type: Type.ARRAY, items: { type: Type.STRING } },
        contentStrategy: { type: Type.STRING },
        customerAcquisitionStrategy: { type: Type.STRING },
        promotionalIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: [
        'recommendedPlatforms',
        'contentStrategy',
        'customerAcquisitionStrategy',
        'promotionalIdeas',
      ],
    },
    sevenDayPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          theme: { type: Type.STRING },
          platform: { type: Type.STRING },
          contentIdea: { type: Type.STRING },
          caption: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          targetAudience: { type: Type.STRING },
          goalKpi: { type: Type.STRING },
        },
        required: [
          'day',
          'theme',
          'platform',
          'contentIdea',
          'caption',
          'hashtags',
          'targetAudience',
          'goalKpi',
        ],
      },
    },
    budgetAllocation: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          percentage: { type: Type.NUMBER },
          amountInr: { type: Type.NUMBER },
          rationale: { type: Type.STRING },
        },
        required: ['category', 'percentage', 'amountInr', 'rationale'],
      },
    },
    dailyActionPlan: {
      type: Type.OBJECT,
      properties: {
        timeCommitment: { type: Type.STRING },
        schedule: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              timeSlot: { type: Type.STRING },
              task: { type: Type.STRING },
              impact: { type: Type.STRING },
            },
            required: ['timeSlot', 'task', 'impact'],
          },
        },
      },
      required: ['timeCommitment', 'schedule'],
    },
    performanceTracking: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          metric: { type: Type.STRING },
          target: { type: Type.STRING },
          timeframe: { type: Type.STRING },
          measurementMethod: { type: Type.STRING },
        },
        required: ['metric', 'target', 'timeframe', 'measurementMethod'],
      },
    },
    additionalRecommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          tip: { type: Type.STRING },
        },
        required: ['title', 'tip'],
      },
    },
  },
  required: [
    'summaryNote',
    'businessAnalysis',
    'audienceTargeting',
    'marketingStrategy',
    'sevenDayPlan',
    'budgetAllocation',
    'dailyActionPlan',
    'performanceTracking',
    'additionalRecommendations',
  ],
};

function formatGeminiError(err: unknown): { status: number; message: string; code: string } {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes('API_KEY_INVALID') || msg.includes('403') || msg.includes('PERMISSION_DENIED')) {
    return {
      status: 403,
      code: 'API_KEY_ERROR',
      message:
        'Your Gemini API key could not be verified. Check your key in Settings > Secrets, or switch to Demo Mode to explore sample output.',
    };
  }
  if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429')) {
    return {
      status: 429,
      code: 'RATE_LIMITED',
      message:
        'AI request quota reached temporarily. Please wait a moment and try again, or use Demo Mode to preview sample results.',
    };
  }
  if (msg.includes('NOT_FOUND') || msg.includes('404')) {
    return {
      status: 502,
      code: 'MODEL_NOT_FOUND',
      message: 'The configured AI model is temporarily unavailable. Please retry shortly.',
    };
  }
  return {
    status: 500,
    code: 'AI_ERROR',
    message: msg || 'Failed to generate marketing strategy. Please try again.',
  };
}

app.get('/api/health', (_req: Request, res: Response) => {
  const ai = getGeminiClient();
  res.json({
    ok: true,
    aiConfigured: Boolean(ai),
  });
});

app.post('/api/strategy/generate', async (req: Request, res: Response) => {
  const inputs = req.body?.inputs;
  if (!inputs || typeof inputs.businessName !== 'string' || !inputs.businessName.trim()) {
    res.status(400).json({ error: 'Business name and details are required.', code: 'VALIDATION_ERROR' });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    res.status(503).json({
      error:
        'Live AI generation is not configured because GEMINI_API_KEY is missing. Configure it in Settings > Secrets or click "Use Demo Mode" to explore a sample strategy.',
      code: 'AI_NOT_CONFIGURED',
    });
    return;
  }

  try {
    const prompt = `Create a tailored, practical, high-ROI marketing strategy and 7-day plan for this business:
- Business Name: ${inputs.businessName}
- Business Type: ${inputs.businessType}
- Product or Service: ${inputs.productOrService}
- Business Location: ${inputs.businessLocation}
- Business Description: ${inputs.businessDescription}
- Marketing Goals: ${Array.isArray(inputs.goals) ? inputs.goals.join(', ') : ''}
- Target Audience Age Group: ${inputs.ageGroup}
- Target Audience Gender: ${inputs.gender || 'All'}
- Customer Interests: ${inputs.customerInterests}
- Target Market / Location: ${inputs.targetMarket}
- Monthly Marketing Budget (INR): ₹${Number(inputs.budgetAmount) || 0} (${inputs.budgetPreset})
- Preferred Platforms: ${Array.isArray(inputs.platforms) ? inputs.platforms.join(', ') : ''}
- Daily Available Time: ${inputs.availableTime}

Requirements:
1. Make every recommendation deeply specific to this exact business, product, location, and INR budget.
2. Provide exactly 3 distinct customer segments in audienceTargeting.
3. Provide exactly 7 rows (Day 1 through Day 7) in sevenDayPlan with ready-to-post captions, practical hashtags, and realistic KPIs.
4. Ensure budgetAllocation percentages sum to 100 and amountInr sums to ${Number(inputs.budgetAmount) || 0}. If budget is 0, set amountInr to 0 for each category and recommend zero-cost organic activities.
5. Make dailyActionPlan fit realistically inside ${inputs.availableTime}.
6. Avoid generic fluff; write clear, human, small-business-friendly language.`;

    const response = await ai.models.generateContent({
      model: STRATEGY_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          'You are MarketMate AI, a senior growth strategist for small businesses, startups, home businesses, and creators. Produce concrete, high-clarity, actionable marketing plans tailored to Indian and global SMB contexts with INR budgeting.',
        responseMimeType: 'application/json',
        responseSchema: strategyResponseSchema,
      },
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      throw new Error('Empty response received from AI model.');
    }

    const strategy = JSON.parse(rawText);
    res.json({ strategy, source: 'live-ai' });
  } catch (err) {
    const formatted = formatGeminiError(err);
    res.status(formatted.status).json({ error: formatted.message, code: formatted.code });
  }
});

app.post('/api/strategy/refine', async (req: Request, res: Response) => {
  const { inputs, currentStrategy, instruction } = req.body || {};
  if (!inputs || !currentStrategy || typeof instruction !== 'string' || !instruction.trim()) {
    res.status(400).json({ error: 'Existing strategy and refinement instruction are required.' });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    res.status(503).json({
      error:
        'Live AI refinement requires GEMINI_API_KEY. Configure it in Settings > Secrets to run custom AI refinements.',
      code: 'AI_NOT_CONFIGURED',
    });
    return;
  }

  try {
    const prompt = `You are updating an existing marketing strategy based on the user's follow-up instruction.
CRITICAL: Understand the existing plan below and modify ONLY the sections requested by the user's instruction. Keep all unrelated sections intact and coherent.

User Business Profile:
${JSON.stringify(inputs)}

Existing Marketing Strategy JSON:
${JSON.stringify(currentStrategy)}

User's Modification Request:
"${instruction.trim()}"

Return the complete updated JSON object matching the schema, with summaryNote clearly stating which section(s) were updated.`;

    const response = await ai.models.generateContent({
      model: STRATEGY_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          'You are MarketMate AI. Modify only the sections implied by the user request while preserving unaffected sections accurately. Ensure INR budget numbers stay consistent if budget changes.',
        responseMimeType: 'application/json',
        responseSchema: strategyResponseSchema,
      },
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      throw new Error('Empty response received from AI model.');
    }

    const strategy = JSON.parse(rawText);
    res.json({ strategy, source: 'live-ai' });
  } catch (err) {
    const formatted = formatGeminiError(err);
    res.status(formatted.status).json({ error: formatted.message, code: formatted.code });
  }
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const { messages, inputs, currentStrategy } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Chat messages are required.' });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    res.status(503).json({
      error:
        'Live AI chat requires GEMINI_API_KEY. Configure it in Settings > Secrets or switch to Demo Mode for sample chat responses.',
      code: 'AI_NOT_CONFIGURED',
    });
    return;
  }

  try {
    const contextBlock = inputs
      ? `Current Business Context:\n- Name: ${inputs.businessName}\n- Type: ${inputs.businessType}\n- Offering: ${inputs.productOrService}\n- Location: ${inputs.businessLocation}\n- Budget: ₹${inputs.budgetAmount}\n- Platforms: ${(inputs.platforms || []).join(', ')}\n- Goals: ${(inputs.goals || []).join(', ')}`
      : 'No business profile submitted yet.';

    const planSnippet = currentStrategy
      ? `\n\nThe user already has a generated strategy summary: ${currentStrategy.businessAnalysis?.overview || ''}. Seven-day days: ${(currentStrategy.sevenDayPlan || []).map((d: { day: string; theme: string }) => `${d.day}: ${d.theme}`).join('; ')}.`
      : '';

    const conversation = messages
      .slice(-10)
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'MarketMate AI'}: ${m.content}`)
      .join('\n\n');

    const response = await ai.models.generateContent({
      model: STRATEGY_MODEL,
      contents: `${contextBlock}${planSnippet}\n\nConversation:\n${conversation}\n\nRespond directly as MarketMate AI:`,
      config: {
        systemInstruction:
          'You are MarketMate AI, a practical, friendly marketing partner for small businesses and creators. Give concise, structured, immediately usable advice, ready-to-paste captions, WhatsApp messages, or INR budget tips. Avoid hype and filler.',
      },
    });

    const reply = (response.text ?? '').trim();
    if (!reply) {
      throw new Error('Empty chat response from AI model.');
    }

    res.json({ reply, source: 'live-ai' });
  } catch (err) {
    const formatted = formatGeminiError(err);
    res.status(formatted.status).json({ error: formatted.message, code: formatted.code });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MarketMate AI server running on http://localhost:${PORT}`);
  });
}

startServer();
