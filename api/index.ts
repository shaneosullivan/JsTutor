// Vercel serverless function entry point
import { createServer } from '../server/index.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let app: any;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!app) {
    app = await createServer();
  }
  return app(req, res);
}