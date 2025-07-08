import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export function serveStatic(app: Express) {
  // In Vercel, try multiple possible paths for the static files
  const possiblePaths = [
    path.resolve(__dirname, "public"),
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "public"),
    path.resolve(__dirname, "..", "public"),
    path.resolve(__dirname, "..", "dist", "public"),
  ];

  let distPath = "";
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      distPath = possiblePath;
      break;
    }
  }

  if (!distPath) {
    // Log available paths for debugging
    console.log("Available directories:");
    console.log("__dirname:", __dirname);
    console.log("process.cwd():", process.cwd());
    console.log("Checked paths:", possiblePaths);

    throw new Error(
      `Could not find the build directory in any of: ${possiblePaths.join(
        ", "
      )}`
    );
  }

  console.log(`[Static] Serving static files from: ${distPath}`);

  // Serve static files with proper configuration for ES modules
  app.use(
    express.static(distPath, {
      index: false, // Don't automatically serve index.html for directories
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".js")) {
          res.setHeader(
            "Content-Type",
            "application/javascript; charset=utf-8"
          );
        } else if (filePath.endsWith(".mjs")) {
          res.setHeader(
            "Content-Type",
            "application/javascript; charset=utf-8"
          );
        } else if (filePath.endsWith(".css")) {
          res.setHeader("Content-Type", "text/css; charset=utf-8");
        }
      },
    })
  );

  // Handle SPA routing - only serve index.html for routes (no file extension)
  app.get("*", (req, res) => {
    // Don't serve index.html for requests that look like files
    if (path.extname(req.path)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Serve index.html for all other routes (SPA routing)
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
