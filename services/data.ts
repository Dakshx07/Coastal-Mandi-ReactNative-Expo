import { supabase } from './supabase';

export interface Species {
    id: string;
    name: string;
    scientific_name: string;
    local_name: string;
    image_url: string;
    description?: string;
}

export interface Harbour {
    id: string;
    name: string;
    location: string;
    city: string;
    state: string;
}

export interface DailyPrice {
    id: string;
    species_id: string;
    harbour_id: string;
    price_per_kg: number;
    trend: 'up' | 'down' | 'stable';
    trend_percentage: number;
    date: string;
    // Joins
    species?: Species;
    harbour?: Harbour;
}

export const DataService = {
    /**
     * Fetch all species with their current prices for a specific harbour
     */
    async getMarketData(harbourName: string) {
        try {
            // 1. Get Harbour ID
            const { data: harbour, error: hError } = await supabase
                .from('harbours')
                .select('id')
                .eq('name', harbourName)
                .single();

            if (hError || !harbour) {
                console.error('Error fetching harbour:', hError);
                return [];
            }

            // 2. Get Prices for this harbour with Species details
            const { data, error } = await supabase
                .from('daily_prices')
                .select(`
          price_per_kg,
          trend,
          trend_percentage,
          stock_status,
          species:species_id (
            id,
            name,
            scientific_name,
            local_name,
            image_url
          )
        `)
                .eq('harbour_id', harbour.id)
                .order('price_per_kg', { ascending: false });

            if (error) {
                console.error('Error fetching market data:', error);
                return [];
            }

            // 3. Transform to App Format (Filter out invalid data)
            return data
                .filter((item: any) => item.species != null)
                .map((item: any) => ({
                    id: item.species.id,
                    name: item.species.name,
                    scientificName: item.species.local_name || item.species.scientific_name,
                    price: item.price_per_kg,
                    trend: item.trend,
                    trendPercentage: item.trend_percentage,
                    imageUrl: item.species.image_url,
                    trustScore: 85 + Math.floor(Math.random() * 10), // Mock for now
                    stockStatus: item.stock_status,
                }));
        } catch (e) {
            console.error('Unexpected error in getMarketData:', e);
            return [];
        }
    },

    /**
     * Fetch cross-harbour prices for a specific species
     */
    async getCrossHarbourPrices(speciesName: string) {
        // First find species ID
        const { data: species } = await supabase
            .from('species')
            .select('id')
            .eq('name', speciesName)
            .single();

        if (!species) return null;

        // Get all prices for this species
        const { data } = await supabase
            .from('daily_prices')
            .select(`
        price_per_kg,
        trend,
        trend_percentage,
        harbour:harbour_id ( name )
      `)
            .eq('species_id', species.id);

        if (!data) return null;

        // Transform to record format: { 'Kochi': { price: 100... } }
        const result: Record<string, any> = {};
        data.forEach((item: any) => {
            if (item.harbour?.name) {
                result[item.harbour.name] = {
                    price: item.price_per_kg,
                    trend: item.trend,
                    trendPercentage: item.trend_percentage
                };
            }
        });

        return result;
    },

    /**
     * Search species by name
     */
    async searchSpecies(query: string) {
        const { data } = await supabase
            .from('species')
            .select('*')
            .ilike('name', `%${query}%`)
            .limit(5);
        return data || [];
    }
};
