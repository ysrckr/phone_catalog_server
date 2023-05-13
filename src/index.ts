
import dotenv from 'dotenv';
import { startServer } from './setup/server';

// Load environment variables from .env file
dotenv.config();

// Get port from environment and store in Express.
const PORT = Number(process.env.PORT) || 8000;

// Start server
startServer(PORT);


