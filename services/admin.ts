import { supabase } from './supabase';
import { Logger } from './logger';

export const AdminService = {
    /**
     * Update the price and trend for a specific fish at a harbour.
     * If entry exists for today, update it. If not, insert it.
     */
    async updateDailyPrice(
        harbourId: string,
        speciesId: string,
        price: number,
        trend: 'up' | 'down' | 'stable',
        trendPercentage: number,
        stockStatus: string
    ) {
        const today = new Date().toISOString().split('T')[0];

        try {
            const { data, error } = await supabase
                .from('daily_prices')
                .upsert({
                    harbour_id: harbourId,
                    species_id: speciesId,
                    price_per_kg: price,
                    trend,
                    trend_percentage: trendPercentage,
                    stock_status: stockStatus,
                    date: today // Uses composite unique key (harbour_id, species_id, date)
                }, { onConflict: 'species_id, harbour_id, date' })
                .select();

            if (error) throw error;
            return { success: true, data };
        } catch (e) {
            Logger.error('Admin update failed:', e);
            return { success: false, error: e };
        }
    },

    /**
     * Get all species for admin list
     */
    async getAllSpecies() {
        const { data, error } = await supabase.from('species').select('*').order('name');
        if (error) {
            Logger.error('Failed to fetch species:', error);
            return [];
        }
        return data;
    },

    /**
   * Get all harbours for admin list
   */
    async getAllHarbours() {
        const { data, error } = await supabase.from('harbours').select('*').order('name');
        if (error) {
            Logger.error('Failed to fetch harbours:', error);
            return [];
        }
        return data;
    }
};
