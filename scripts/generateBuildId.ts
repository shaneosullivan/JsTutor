// Adds the BUILD_ID variable to the config/buildId.ts file and exports it.

import { cpSync, existsSync, writeFileSync } from "fs";
import { join } from "path";
import { mkdirSync } from "fs";

const BUILD_ID = Date.now() + "";
const buildIdPath = join(process.cwd(), "config", "buildId.ts");
const buildIdContent = `// This file is auto-generated. Do not edit manually.
export const BUILD_ID = "${BUILD_ID}";
`;

// create the config directory if it doesn't exist
const configDir = join(process.cwd(), "config");
if (!existsSync(configDir)) {
  mkdirSync(configDir, { recursive: true });
}

writeFileSync(buildIdPath, buildIdContent, "utf8");

// Also put it in the public directory for easy access
const publicBuildIdPath = join(process.cwd(), "public", "buildId.json");
writeFileSync(publicBuildIdPath, JSON.stringify({ BUILD_ID }), "utf8");

// Check for the existence of the FIREBASE_KEY environment variable
// If it exists, write it to to the config/firebase.json file
if (process.env.FIREBASE_KEY) {
  const firebaseConfigPath = join(process.cwd(), "config", "firebase.json");
  const firebaseConfigContent = JSON.stringify(
    { FIREBASE_KEY: process.env.FIREBASE_KEY },
    null,
    2,
  );

  writeFileSync(firebaseConfigPath, firebaseConfigContent, "utf8");
} else if (existsSync(join(process.cwd(), "firebase.json"))) {
  // In development
  cpSync(
    join(process.cwd(), "firebase.json"),
    join(process.cwd(), "config", "firebase.json"),
    { force: true },
  );
}
