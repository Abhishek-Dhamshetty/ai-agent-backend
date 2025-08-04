import type { PluginResult } from '../types/index.js';
import axios from 'axios';

export class WeatherPlugin {
  async execute(city: string): Promise<PluginResult> {
    try {
      // Using a free weather API (OpenWeatherMap)
      const apiKey = process.env.WEATHER_API_KEY || 'demo_key';
      
      if (apiKey === 'demo_key') {
        // Mock response for demo purposes
        return {
          type: 'weather',
          input: city,
          output: `Current weather in ${city}: 22°C, partly cloudy with light winds. (Demo data - add WEATHER_API_KEY to .env for real data)`,
          success: true
        };
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      const weather = response.data;
      
      const output = `Current weather in ${city}: ${Math.round(weather.main.temp)}°C, ${weather.weather[0].description}, humidity ${weather.main.humidity}%, wind ${weather.wind.speed} m/s`;
      
      return {
        type: 'weather',
        input: city,
        output,
        success: true
      };
    } catch (error) {
      return {
        type: 'weather',
        input: city,
        output: `Unable to fetch weather data for ${city}`,
        success: false
      };
    }
  }
}