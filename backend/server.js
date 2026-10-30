import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import procurementRoutes from './routes/procurementRoutes.js';
import decisionRoutes from './routes/decisionRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { seedDatabase } from './data/seedData.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === 'production') {
  const requiredProductionVariables = ['MONGO_URI', 'JWT_SECRET', 'FRONTEND_URL'];
  const missingVariables = requiredProductionVariables.filter((name) => !process.env[name]);

  if (missingVariables.length) {
    throw new Error(`Missing required production environment variables: ${missingVariables.join(', ')}`);
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production');
  }
}

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ProcureAI API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/procurements', procurementRoutes);
app.use('/api/decisions', decisionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    if (process.env.NODE_ENV !== 'production' && process.env.SEED_DATABASE !== 'false') {
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
