import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import promptRoutes from './routes/promptRoutes.js';
import { createDatabaseIfNotExists, initializeTables } from './db.js';
import { setupSwagger } from './swagger.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.static('public'));

setupSwagger(app);

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/prompts', promptRoutes);

const startServer = async () => {
    try {
        await createDatabaseIfNotExists();
        await initializeTables();
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
