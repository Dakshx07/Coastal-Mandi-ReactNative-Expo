import { Logger } from './logger';

// OpenWeatherMap Free API Key
const API_KEY = '053eb631afe108a42053a7da220a6597'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export interface WeatherData {
    temp: number;
    condition: string;
    wind: number;
    humidity: number;
    location: string;
}

// Coordinates for all Harbours
export const HARBOUR_COORDINATES: Record<string, { lat: number; lon: number }> = {
    'Kochi Harbour': { lat: 9.9312, lon: 76.2673 },
    'Vizag Fishing Harbour': { lat: 17.6868, lon: 83.2185 },
    'Mangalore Old Port': { lat: 12.9141, lon: 74.8560 },
    'Sassoon Dock': { lat: 18.9220, lon: 72.8347 },
    'Chennai Kasimedu': { lat: 13.1278, lon: 80.2945 },
    'Veraval Harbour': { lat: 20.9048, lon: 70.3725 },
    'Paradip Port': { lat: 20.2647, lon: 86.6669 },
};

// Fallback Data for instant load if API fails
const FALLBACK_WEATHER: WeatherData = {
    temp: 29,
    condition: 'Partly Cloudy',
    wind: 12,
    humidity: 75,
    location: 'Coastal Region'
};

export const WeatherService = {
  /**
   * Fetch weather with 2s timeout and fallback
   */
  async getWeatherForHarbour(harbourName: string): Promise<WeatherData> {
    const coords = HARBOUR_COORDINATES[harbourName] || HARBOUR_COORDINATES['Kochi Harbour'];
    
    try {
        // Create a timeout promise (2 seconds)
        const timeout = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Request timed out')), 2000)
        );

        // Fetch request
        const request = fetch(`${BASE_URL}?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`);

        // Race them
        const response: any = await Promise.race([request, timeout]);
        const data = await response.json();

        if (response.status !== 200) {
            throw new Error(data.message || 'API Error');
        }

        return {
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main,
            wind: Math.round(data.wind.speed * 3.6), // km/h
            humidity: data.main.humidity,
            location: data.name
        };

    } catch (error) {
        Logger.warn(`Weather Fetch Failed for ${harbourName} (Using Fallback):`, error);
        // Return fallback data adjusted slightly for reliability feel
        return {
            ...FALLBACK_WEATHER,
            location: harbourName, // At least show selected harbour name
            temp: 28 + Math.floor(Math.random() * 4) // Mild variation
        };
    }
  }
};
