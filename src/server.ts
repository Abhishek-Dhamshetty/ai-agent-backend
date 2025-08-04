import dotenv from 'dotenv';

// Load environment variables first, before any other imports
dotenv.config();

import express, { type Request, type Response, type NextFunction } from 'express';
import { agentRouter } from './agent/controller.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    message: 'AI Agent Backend is running!',
    timestamp: new Date().toISOString(),
    features: [
      'Weather information lookup',
      'Mathematical calculations', 
      'Conversational AI with memory',
      'RAG-based knowledge retrieval'
    ]
  });
});

// Agent routes
app.use('/agent', agentRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`AI Agent server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Weather API configured: ${process.env.WEATHER_API_KEY ? 'Yes' : 'No'}`);
});