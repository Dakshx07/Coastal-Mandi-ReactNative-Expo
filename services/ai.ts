import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API Key - Set your valid API key here
// Get a new key from: https://makersuite.google.com/app/apikey
const GEMINI_API_KEY = 'AIzaSyAZfoQJsTp5xha45bmHVe-odqJOJeKiv2E';

let genAI: GoogleGenerativeAI | null = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export const initializeAI = (apiKey?: string) => {
    const key = apiKey || GEMINI_API_KEY;
    if (key) {
        genAI = new GoogleGenerativeAI(key);
    }
};

export interface MarketAnalysis {
    summary: string;
    topGainers: { name: string; change: string }[];
    topLosers: { name: string; change: string }[];
    recommendations: string[];
}

export interface RateData {
    name: string;
    price: number;
    trend: 'up' | 'down';
    trendPercentage: number;
}

// Generate mock analysis based on actual rate data
const generateMockAnalysis = (ratesData: RateData[]): MarketAnalysis => {
    const gainers = ratesData
        .filter(r => r.trend === 'up')
        .sort((a, b) => b.trendPercentage - a.trendPercentage)
        .slice(0, 3)
        .map(r => ({ name: r.name, change: `+${r.trendPercentage}%` }));

    const losers = ratesData
        .filter(r => r.trend === 'down')
        .sort((a, b) => b.trendPercentage - a.trendPercentage)
        .slice(0, 3)
        .map(r => ({ name: r.name, change: `-${r.trendPercentage}%` }));

    const topGainer = gainers[0]?.name || 'Sardine';
    const topLoser = losers[0]?.name || 'Seer Fish';

    return {
        summary: `Today's fish market shows mixed signals. ${topGainer} and other mid-range species are trending upward due to seasonal availability, while premium species like ${topLoser} are experiencing price corrections after last week's highs.`,
        topGainers: gainers.length > 0 ? gainers : [
            { name: 'Sardine', change: '+5.2%' },
            { name: 'Mackerel', change: '+8.4%' },
            { name: 'Anchovies', change: '+3.1%' },
        ],
        topLosers: losers.length > 0 ? losers : [
            { name: 'Seer Fish', change: '-12.79%' },
            { name: 'Pomfret (Black)', change: '-10.81%' },
            { name: 'Prawns (Tiger)', change: '-2.1%' },
        ],
        recommendations: [
            `🟢 BUY: ${topGainer} - Price is low, expected to rise`,
            `🔴 SELL: ${topLoser} - Prices dropping, book profits`,
            '🟡 HOLD: Mackerel - Wait for stabilization',
        ],
    };
};

export const analyzeMarket = async (ratesData: RateData[]): Promise<MarketAnalysis> => {
    // Always return mock data if no valid API key
    if (!genAI || !GEMINI_API_KEY) {
        return generateMockAnalysis(ratesData);
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a fish market analyst. Analyze these fish market rates and provide a JSON response with:
1. "summary": Market summary in 2-3 sentences
2. "topGainers": Array of top 3 gainers with {name, change} (e.g., "+5.2%")
3. "topLosers": Array of top 3 losers with {name, change} (e.g., "-10.8%")
4. "recommendations": Array of 3 buy/sell/hold recommendations with emoji indicators

Current Rates Data:
${JSON.stringify(ratesData, null, 2)}

Return ONLY valid JSON, no markdown or explanation.`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Parse JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]) as MarketAnalysis;
        }

        throw new Error('Invalid response format');
    } catch (error) {
        // Log error but return mock data gracefully
        console.log('AI Analysis using mock data (API unavailable)');
        return generateMockAnalysis(ratesData);
    }
};

// Generate mock prediction based on species name
const generateMockPrediction = (speciesName: string): string => {
    const predictions = [
        `Strong bullish trend detected for ${speciesName}. Prices are expected to surge by ~16% over the week. Recommendation: Hold stock for better margins.`,
        `Bearish outlook for ${speciesName}. Prices might drop by ~26% this week. Recommendation: Sell now to avoid further depreciation.`,
        `${speciesName} showing stable patterns. Prices expected to remain within ±5% range. Recommendation: Good time for steady trading.`,
        `Mixed signals for ${speciesName}. Short-term volatility expected, but medium-term outlook is positive. Recommendation: Buy on dips.`,
    ];

    // Use name hash to pick consistent prediction for same species
    const hash = speciesName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return predictions[hash % predictions.length];
};

export const getMarketPrediction = async (speciesName: string): Promise<string> => {
    // Always return mock data if no valid API key
    if (!genAI || !GEMINI_API_KEY) {
        return generateMockPrediction(speciesName);
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `Give a brief 1-2 sentence price prediction for ${speciesName} fish in Indian coastal markets. Be concise.`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        // Return mock prediction gracefully
        return generateMockPrediction(speciesName);
    }
};
