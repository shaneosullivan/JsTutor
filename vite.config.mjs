// Minimal config for Vercel production - avoids TypeScript compilation issues
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  root: "./client",
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
  },
};