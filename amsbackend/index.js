// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dashBoardRoutes from './routes/Dashboard.js';
import authRoutes from './routes/authRoutes.js';
import assetRoutes from './routes/assets.js';
import pool from './models/db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/assets', assetRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashBoardRoutes);
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch((err) => console.error('❌ Database connection error:', err));

app.listen(process.env.PORT || 5000, () =>
  console.log(`Backend running on port ${process.env.PORT || 5000}`)
);

export default app;