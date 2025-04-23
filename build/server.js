import 'dotenv/config';
import express from 'express';
import { connectDatabase } from './config/database.config.js';
import helmet from 'helmet';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
const app = express();
const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI || '';
connectDatabase(DB_URI);
app.use(helmet());
app.use(cors({
    origin: '*'
}));
app.use('/api/user', userRoutes);
app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
});
app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        status: 'error',
        message: err?.message || 'Something went wrong on the server.',
    });
});
