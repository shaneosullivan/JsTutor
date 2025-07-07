// Vercel serverless function entry point
import { createServer } from '../server/index.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let app: any;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set production environment for Vercel
  process.env.NODE_ENV = 'production';
  
  if (!app) {
    app = await createServer();
  }
  return app(req, res);
}