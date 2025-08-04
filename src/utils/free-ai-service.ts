export class FreeAIService {
  async generateResponse(prompt: string): Promise<string> {
    const lowerPrompt = prompt.toLowerCase();
    
    // Weather queries
    if (lowerPrompt.includes('weather')) {
      return "I can help you with weather information! Try asking 'weather in [city name]' to get current conditions for any city.";
    }
    
    // Math queries
    if (lowerPrompt.includes('calculate') || /\d+\s*[\+\-\*\/]\s*\d+/.test(prompt)) {
      return "I can help with calculations! Try asking 'calculate 25 + 17' or any math expression and I'll solve it for you.";
    }
    
    // Greetings
    if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi') || lowerPrompt.includes('hey')) {
      return "Hello! I'm your AI assistant. I can help you with:\n• Weather information (try 'weather in London')\n• Mathematical calculations (try 'calculate 15 * 8')\n• General questions and conversations\n\nWhat would you like to know?";
    }
    
    // Help queries
    if (lowerPrompt.includes('help') || lowerPrompt.includes('what can you do')) {
      return "I can assist you with:\n\n🌤️ **Weather**: Ask 'weather in [city]' for current conditions\n🧮 **Math**: Ask 'calculate [expression]' for mathematical operations\n💬 **Chat**: Ask me general questions and I'll do my best to help\n\nTry asking me something!";
    }
    
    // Thank you
    if (lowerPrompt.includes('thank') || lowerPrompt.includes('thanks')) {
      return "You're welcome! I'm here to help with weather, calculations, or any questions you might have. Feel free to ask me anything else!";
    }
    
    // Goodbye
    if (lowerPrompt.includes('bye') || lowerPrompt.includes('goodbye') || lowerPrompt.includes('see you')) {
      return "Goodbye! It was nice helping you today. Come back anytime if you need weather information, calculations, or just want to chat!";
    }
    
    // How are you
    if (lowerPrompt.includes('how are you') || lowerPrompt.includes('how do you feel')) {
      return "I'm doing great, thank you for asking! I'm here and ready to help you with weather information, calculations, or answer any questions you might have. How can I assist you today?";
    }
    
    // What/Who are you
    if (lowerPrompt.includes('what are you') || lowerPrompt.includes('who are you')) {
      return "I'm your AI assistant! I'm designed to help you with various tasks including:\n• Getting weather information for any city\n• Solving mathematical calculations\n• Answering questions and having conversations\n\nI'm running on a free, efficient system that doesn't require expensive API calls. How can I help you today?";
    }
    
    // Time/Date queries
    if (lowerPrompt.includes('time') || lowerPrompt.includes('date') || lowerPrompt.includes('today')) {
      const now = new Date();
      return `Current date and time: ${now.toLocaleString()}\n\nIs there anything else I can help you with? I can provide weather information or help with calculations!`;
    }
    
    // Default intelligent response
    return `I understand you're asking about: "${prompt}"\n\nWhile I'm running in free mode, I can still help you with:\n• Weather information - try "weather in [city]"\n• Mathematical calculations - try "calculate [expression]"\n• General questions and conversations\n\nFor more advanced AI capabilities, you could set up OpenAI billing, but I'm here to help with the basics! What would you like to know?`;
  }
}