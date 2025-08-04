import type { PluginResult } from '../types/index.js';

export class MathPlugin {
  async execute(expression: string): Promise<PluginResult> {
    try {
      // Extract mathematical expression
      let mathExpression = this.extractMathExpression(expression);
      
      if (!mathExpression) {
        return {
          type: 'math',
          input: expression,
          output: 'No valid mathematical expression found',
          success: false
        };
      }

      // Safely evaluate the expression
      const result = this.evaluateExpression(mathExpression);
      
      return {
        type: 'math',
        input: expression,
        output: `${mathExpression} = ${result}`,
        success: true
      };
    } catch (error) {
      return {
        type: 'math',
        input: expression,
        output: 'Error evaluating mathematical expression',
        success: false
      };
    }
  }

  private extractMathExpression(text: string): string | null {
    // Remove common phrases and extract the math part
    let cleaned = text
      .replace(/calculate\s+/i, '')
      .replace(/what\s+is\s+/i, '')
      .replace(/solve\s+/i, '')
      .trim();

    // Look for basic math patterns
    const mathPattern = /[\d\.\+\-\*\/\(\)\s]+/;
    const match = cleaned.match(mathPattern);
    
    return match ? match[0].trim() : null;
  }

  private evaluateExpression(expression: string): number {
    // Simple safe evaluation for basic arithmetic
    const sanitized = expression.replace(/[^0-9\+\-\*\/\.\(\)\s]/g, '');
    
    if (!/^[\d\.\+\-\*\/\(\)\s]+$/.test(sanitized)) {
      throw new Error('Invalid expression');
    }

    try {
      return Function('"use strict"; return (' + sanitized + ')')();
    } catch {
      throw new Error('Evaluation error');
    }
  }
}