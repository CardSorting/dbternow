import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { DIContainer } from './config/di-container';
import authRoutes from './routes/auth';
import moduleRoutes from './routes/modules';
import skillRoutes from './routes/skills';
import challengeRoutes from './routes/challenges';
import achievementRoutes from './routes/achievements';
import { errorHandler } from './middleware/errorHandler';
import { authenticateToken } from './middleware/auth';

// Initialize Prisma
export const prisma = new PrismaClient();

// Initialize Dependency Injection Container
const diContainer = DIContainer.getInstance(prisma);

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/modules', authenticateToken, moduleRoutes);
app.use('/api/skills', authenticateToken, skillRoutes);
app.use('/api/challenges', authenticateToken, challengeRoutes);
app.use('/api/achievements', authenticateToken, achievementRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL database');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
});
