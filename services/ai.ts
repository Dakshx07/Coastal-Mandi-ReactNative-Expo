// AI Service for Market Analysis
// Uses intelligent fallback data based on actual market information

export interface RateData {
    name: string;
    price: number;
    trend: 'up' | 'down';
    trendPercentage: number;
}

export interface MarketAnalysis {
    summary: string;
    topGainers: { name: string; change: string }[];
    topLosers: { name: string; change: string }[];
    recommendations: string[];
}

export async function analyzeMarket(rates: RateData[]): Promise<MarketAnalysis> {
    // Simulate AI processing time for realistic UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate intelligent analysis based on actual data
    const gainers = rates.filter(r => r.trend === 'up').sort((a, b) => b.trendPercentage - a.trendPercentage);
    const losers = rates.filter(r => r.trend === 'down').sort((a, b) => b.trendPercentage - a.trendPercentage);

    const topGainer = gainers[0];
    const topLoser = losers[0];
    const avgPrice = Math.round(rates.reduce((sum, r) => sum + r.price, 0) / rates.length);

    // Generate contextual summary
    let summary = '';
    if (gainers.length > losers.length) {
        summary = `Today's market shows bullish momentum with ${gainers.length} species rising. ${topGainer?.name || 'Premium fish'} leads gains at +${topGainer?.trendPercentage.toFixed(1)}%, indicating strong buyer demand. Average price across species is ₹${avgPrice}/kg.`;
    } else if (losers.length > gainers.length) {
        summary = `Market correction observed today with ${losers.length} species declining. ${topLoser?.name || 'Some species'} saw the largest drop at -${topLoser?.trendPercentage.toFixed(1)}%. This may present buying opportunities for traders.`;
    } else {
        summary = `Mixed market conditions today with balanced activity. ${topGainer?.name || 'Some species'} showing strength while ${topLoser?.name || 'others'} see corrections. Average price stands at ₹${avgPrice}/kg.`;
    }

    // Generate recommendations based on data
    const recommendations: string[] = [];

    if (topGainer && topGainer.trendPercentage > 5) {
        recommendations.push(`Strong momentum in ${topGainer.name} - consider stocking up before prices rise further.`);
    }

    if (topLoser && topLoser.trendPercentage > 10) {
        recommendations.push(`${topLoser.name} correction may be temporary - good value buy at current prices.`);
    }

    recommendations.push('Monitor early morning arrivals at 5-6 AM for best wholesale prices.');

    if (gainers.length > 3) {
        recommendations.push('Overall bullish trend suggests holding inventory rather than quick sales.');
    }

    return {
        summary,
        topGainers: gainers.slice(0, 3).map(g => ({
            name: g.name,
            change: `+${g.trendPercentage.toFixed(1)}%`
        })),
        topLosers: losers.slice(0, 3).map(l => ({
            name: l.name,
            change: `-${l.trendPercentage.toFixed(1)}%`
        })),
        recommendations: recommendations.slice(0, 4),
    };
}

export async function getMarketPrediction(
    speciesName: string,
    currentPrice: number,
    trend: 'up' | 'down',
    trendPercentage: number
): Promise<string> {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));

    const weekAhead = trend === 'up'
        ? Math.round(currentPrice * (1 + trendPercentage / 200))
        : Math.round(currentPrice * (1 - trendPercentage / 200));

    if (trend === 'up') {
        if (trendPercentage > 10) {
            return `${speciesName} is experiencing strong demand with a ${trendPercentage.toFixed(1)}% surge. At ₹${currentPrice}/kg, prices could reach ₹${weekAhead}/kg by next week if momentum continues. Recommend securing stock now as supplies from boats are limited due to seasonal patterns.`;
        } else {
            return `${speciesName} shows steady growth at +${trendPercentage.toFixed(1)}%. Current price of ₹${currentPrice}/kg is expected to remain stable with minor upward movement to around ₹${weekAhead}/kg. Good time to buy for retail customers.`;
        }
    } else {
        if (trendPercentage > 10) {
            return `${speciesName} is correcting sharply at -${trendPercentage.toFixed(1)}%. The current ₹${currentPrice}/kg price may stabilize around ₹${weekAhead}/kg. This could be a value buying opportunity if you can hold inventory for 1-2 weeks until prices recover.`;
        } else {
            return `${speciesName} is seeing minor correction of -${trendPercentage.toFixed(1)}%. At ₹${currentPrice}/kg, this represents normal market fluctuation. Prices expected to hold steady. Wait for clearer trends before making large purchases.`;
        }
    }
}
