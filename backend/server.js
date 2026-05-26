import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import './config/supabase.js'; // Imports and initializes Supabase client
import recordsRouter from './routes/records.js';
import galleryRouter from './routes/gallery.js';

// Resolve directory names for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // In production, replace with specific domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
  next();
});

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// API Routes
app.use('/api/records', recordsRouter);
app.use('/api/gallery', galleryRouter);

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to Virat Kohli RCB Theme Portal API (Supabase Connected)",
    status: "online",
    endpoints: {
      records: "/api/records",
      recordsByFormat: "/api/records/:format",
      gallery: "/api/gallery",
      galleryByCategory: "/api/gallery/category/:category"
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "An internal server error occurred",
    error: process.env.NODE_ENV === 'development' ? err.message : 'Hidden for security'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
