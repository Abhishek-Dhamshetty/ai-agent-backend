import type { PluginResult } from '../types/index.js';
import { WeatherPlugin } from './weatherPlugin.js';
import { MathPlugin } from './mathPlugin.js';

export class PluginDetector {
  private weatherPlugin = new WeatherPlugin();
  private mathPlugin = new MathPlugin();

  async detectAndExecute(message: string): Promise<PluginResult | null> {
    // Weather plugin detection
    const weatherMatch = message.match(/weather\s+in\s+([a-zA-Z\s]+)/i);
    if (weatherMatch) {
      const city = weatherMatch[1]?.trim();
      if (city) {
        return await this.weatherPlugin.execute(city);
      }
    }

    // Math plugin detection
    const mathExpressions = [
      /(\d+(?:\.\d+)?)\s*[\+\-\*\/]\s*(\d+(?:\.\d+)?)/,
      /calculate\s+(.+)/i,
      /what\s+is\s+(.+)\s*[\+\-\*\/]\s*(.+)/i
    ];

    for (const regex of mathExpressions) {
      const match = message.match(regex);
      if (match) {
        return await this.mathPlugin.execute(message);
      }
    }

    return null;
  }
}