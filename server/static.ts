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

  // Serve static files with proper MIME types
  app.use(
    express.static(distPath, {
      setHeaders: (res, path) => {
        if (path.endsWith(".js")) {
          res.setHeader("Content-Type", "application/javascript");
        } else if (path.endsWith(".css")) {
          res.setHeader("Content-Type", "text/css");
        }
      },
    })
  );

  // Only serve index.html for non-file requests (routes without extensions)
  app.use("*", (req, res) => {
    const requestPath = req.path;

    // If the request is for a file (has an extension), return 404
    if (path.extname(requestPath)) {
      return res.status(404).send("File not found");
    }

    // Otherwise, serve index.html for SPA routing
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
