import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import recipeRoutes from './routes/recipes.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.ALLOW_ORIGIN?.split(',') || '*',
    credentials: true
}));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: Date.now() }));
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);

const port = process.env.PORT || 8787;
app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
