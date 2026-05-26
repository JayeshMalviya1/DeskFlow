import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import ticketRoutes from './routes/ticket.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: 'DeskFlow API',
      docs: 'Use /health and /tickets — the React UI is deployed separately on Vercel.',
    },
  });
});

app.use('/tickets', ticketRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
