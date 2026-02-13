import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import syncRoutes from './routes/sync.routes';


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Allow your Vite frontend
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/sync', syncRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Daily Puzzle Game API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});