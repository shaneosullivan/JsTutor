// Adds the BUILD_ID variable to the config/buildId.ts file and exports it.

import { writeFileSync } from "fs";
import { join } from "path";

const BUILD_ID = Date.now() + "";
const buildIdPath = join(process.cwd(), "config", "buildId.ts");
const buildIdContent = `// This file is auto-generated. Do not edit manually.
export const BUILD_ID = "${BUILD_ID}";
`;
writeFileSync(buildIdPath, buildIdContent, "utf8");

// Also put it in the public directory for easy access
const publicBuildIdPath = join(process.cwd(), "public", "buildId.json");
writeFileSync(publicBuildIdPath, JSON.stringify({ BUILD_ID }), "utf8");
