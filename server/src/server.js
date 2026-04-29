import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import recipeRoutes from './routes/recipes.js';
import userRoutes from './routes/users.js';
import collectionRoutes from './routes/collections.js';
import adminResetRoutes from './routes/adminReset.js';

dotenv.config();

const app = express();
app.use(helmet());
const allowedOrigins = process.env.ALLOW_ORIGIN
    ? process.env.ALLOW_ORIGIN.split(',').map(o => o.trim()).filter(Boolean)
    : [];
app.use(cors({
    origin: allowedOrigins.length ? allowedOrigins : false,
    credentials: true
}));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: Date.now() }));
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/admin-reset', adminResetRoutes);

const port = process.env.PORT || 8787;

if (process.env.NODE_ENV !== 'production') {
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            console.log(`Route: ${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
        } else if (middleware.name === 'router') {
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    console.log(`Route: ${Object.keys(handler.route.methods)} ${handler.route.path}`);
                }
            });
        }
    });
}

// Global error handler — must be defined after all routes
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`API listening on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Database connected: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
});
