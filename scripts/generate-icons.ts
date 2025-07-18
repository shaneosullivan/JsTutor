#!/usr/bin/env tsx

import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

interface IconSize {
  size: number;
  filename: string;
  description: string;
}

// All the icon sizes we need for comprehensive SEO and device support
const iconSizes: IconSize[] = [
  // Standard favicons
  {
    size: 16,
    filename: "favicon-16x16.png",
    description: "Standard favicon 16x16"
  },
  {
    size: 32,
    filename: "favicon-32x32.png",
    description: "Standard favicon 32x32"
  },
  { size: 48, filename: "favicon-48x48.png", description: "Windows favicon" },

  // Apple Touch Icons
  {
    size: 57,
    filename: "apple-touch-icon-57x57.png",
    description: "iPhone original"
  },
  {
    size: 60,
    filename: "apple-touch-icon-60x60.png",
    description: "iPhone iOS 7+"
  },
  {
    size: 72,
    filename: "apple-touch-icon-72x72.png",
    description: "iPad original"
  },
  {
    size: 76,
    filename: "apple-touch-icon-76x76.png",
    description: "iPad iOS 7+"
  },
  {
    size: 114,
    filename: "apple-touch-icon-114x114.png",
    description: "iPhone Retina"
  },
  {
    size: 120,
    filename: "apple-touch-icon-120x120.png",
    description: "iPhone Retina iOS 7+"
  },
  {
    size: 144,
    filename: "apple-touch-icon-144x144.png",
    description: "iPad Retina"
  },
  {
    size: 152,
    filename: "apple-touch-icon-152x152.png",
    description: "iPad Retina iOS 7+"
  },
  {
    size: 167,
    filename: "apple-touch-icon-167x167.png",
    description: "iPad Pro"
  },
  {
    size: 180,
    filename: "apple-touch-icon-180x180.png",
    description: "iPhone 6 Plus"
  },
  {
    size: 180,
    filename: "apple-touch-icon.png",
    description: "Default Apple Touch Icon"
  },

  // Android Chrome Icons
  {
    size: 36,
    filename: "android-chrome-36x36.png",
    description: "Android Chrome LDPI"
  },
  {
    size: 48,
    filename: "android-chrome-48x48.png",
    description: "Android Chrome MDPI"
  },
  {
    size: 72,
    filename: "android-chrome-72x72.png",
    description: "Android Chrome HDPI"
  },
  {
    size: 96,
    filename: "android-chrome-96x96.png",
    description: "Android Chrome XHDPI"
  },
  {
    size: 144,
    filename: "android-chrome-144x144.png",
    description: "Android Chrome XXHDPI"
  },
  {
    size: 192,
    filename: "android-chrome-192x192.png",
    description: "Android Chrome XXXHDPI"
  },
  {
    size: 256,
    filename: "android-chrome-256x256.png",
    description: "Android Chrome"
  },
  {
    size: 384,
    filename: "android-chrome-384x384.png",
    description: "Android Chrome"
  },
  {
    size: 512,
    filename: "android-chrome-512x512.png",
    description: "Android Chrome"
  },

  // Microsoft Tiles
  {
    size: 70,
    filename: "mstile-70x70.png",
    description: "Windows 8 small tile"
  },
  {
    size: 144,
    filename: "mstile-144x144.png",
    description: "Windows 8 medium tile"
  },
  {
    size: 150,
    filename: "mstile-150x150.png",
    description: "Windows 8.1 small tile"
  },
  {
    size: 310,
    filename: "mstile-310x150.png",
    description: "Windows 8.1 wide tile"
  },
  {
    size: 310,
    filename: "mstile-310x310.png",
    description: "Windows 8.1 large tile"
  },

  // General purpose sizes
  { size: 96, filename: "icon-96x96.png", description: "General 96x96" },
  { size: 128, filename: "icon-128x128.png", description: "General 128x128" },
  { size: 256, filename: "icon-256x256.png", description: "General 256x256" },
  { size: 512, filename: "icon-512x512.png", description: "General 512x512" }
];

async function generateIcons() {
  const inputSvg = path.join(process.cwd(), "client/public/logo.svg");
  const outputDir = path.join(process.cwd(), "client/public/icons");

  // Check if input SVG exists
  try {
    await fs.access(inputSvg);
  } catch (error) {
    console.error(`❌ Input SVG not found: ${inputSvg}`);
    process.exit(1);
  }

  console.log("🎨 Generating icons from SVG...");
  console.log(`📁 Input: ${inputSvg}`);
  console.log(`📁 Output: ${outputDir}`);
  console.log("");

  // Read the SVG file
  const svgBuffer = await fs.readFile(inputSvg);

  let successCount = 0;
  let errorCount = 0;

  // Generate each icon size
  for (const icon of iconSizes) {
    try {
      const outputPath = path.join(outputDir, icon.filename);

      // Special handling for wide tiles (310x150)
      if (icon.filename === "mstile-310x150.png") {
        await sharp(svgBuffer)
          .resize(310, 150, {
            fit: "contain",
            background: { r: 99, g: 102, b: 241, alpha: 1 } // Brand color background
          })
          .png()
          .toFile(outputPath);
      } else {
        await sharp(svgBuffer)
          .resize(icon.size, icon.size, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
          })
          .png()
          .toFile(outputPath);
      }

      console.log(
        `✅ Generated ${icon.filename} (${icon.size}x${icon.size}) - ${icon.description}`
      );
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to generate ${icon.filename}:`, error);
      errorCount++;
    }
  }

  // Generate ICO file for traditional favicon
  try {
    const outputPath = path.join(outputDir, "favicon.ico");
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(outputPath.replace(".ico", ".png"));

    // Note: Sharp doesn't support ICO format directly, but we can use the 32x32 PNG
    console.log(
      `✅ Generated favicon.ico equivalent (favicon.png) - Traditional favicon`
    );
    successCount++;
  } catch (error) {
    console.error(`❌ Failed to generate favicon.ico:`, error);
    errorCount++;
  }

  console.log("");
  console.log(`🎉 Icon generation complete!`);
  console.log(`✅ Successfully generated: ${successCount} icons`);
  if (errorCount > 0) {
    console.log(`❌ Failed to generate: ${errorCount} icons`);
  }
  console.log("");
  console.log("📋 Next steps:");
  console.log("  1. Update your HTML with the appropriate <link> tags");
  console.log("  2. Create a manifest.json file for PWA support");
  console.log("  3. Add meta tags for social media sharing");
}

// Generate manifest.json for PWA support
async function generateManifest() {
  const manifestPath = path.join(process.cwd(), "client/public/manifest.json");

  const manifest = {
    name: "JavaScript Adventure",
    short_name: "JS Adventure",
    description:
      "Learn JavaScript through interactive tutorials and coding challenges",
    start_url: "/",
    display: "standalone",
    background_color: "#6366f1",
    theme_color: "#6366f1",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/android-chrome-36x36.png",
        sizes: "36x36",
        type: "image/png",
        density: "0.75"
      },
      {
        src: "/icons/android-chrome-48x48.png",
        sizes: "48x48",
        type: "image/png",
        density: "1.0"
      },
      {
        src: "/icons/android-chrome-72x72.png",
        sizes: "72x72",
        type: "image/png",
        density: "1.5"
      },
      {
        src: "/icons/android-chrome-96x96.png",
        sizes: "96x96",
        type: "image/png",
        density: "2.0"
      },
      {
        src: "/icons/android-chrome-144x144.png",
        sizes: "144x144",
        type: "image/png",
        density: "3.0"
      },
      {
        src: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "/icons/android-chrome-256x256.png",
        sizes: "256x256",
        type: "image/png"
      },
      {
        src: "/icons/android-chrome-384x384.png",
        sizes: "384x384",
        type: "image/png"
      },
      {
        src: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any"
      }
    ]
  };

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("✅ Generated manifest.json for PWA support");
}

// Generate browserconfig.xml for Microsoft tiles
async function generateBrowserconfig() {
  const browserconfigPath = path.join(
    process.cwd(),
    "client/public/browserconfig.xml"
  );

  const browserconfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square70x70logo src="/icons/mstile-70x70.png"/>
            <square150x150logo src="/icons/mstile-150x150.png"/>
            <wide310x150logo src="/icons/mstile-310x150.png"/>
            <square310x310logo src="/icons/mstile-310x310.png"/>
            <TileColor>#6366f1</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;

  await fs.writeFile(browserconfigPath, browserconfig);
  console.log("✅ Generated browserconfig.xml for Microsoft tiles");
}

// Main execution
async function main() {
  try {
    await generateIcons();
    await generateManifest();
    await generateBrowserconfig();

    console.log("");
    console.log("🚀 All icons and configuration files generated successfully!");
    console.log("");
    console.log("🔗 Add these meta tags to your HTML <head>:");
    console.log("");
    console.log(`<!-- Standard favicons -->
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png">
<link rel="shortcut icon" href="/icons/favicon.ico">

<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">
<link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152x152.png">
<link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-touch-icon-144x144.png">
<link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-touch-icon-120x120.png">
<link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-touch-icon-114x114.png">
<link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-touch-icon-76x76.png">
<link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-touch-icon-72x72.png">
<link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-touch-icon-60x60.png">
<link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-touch-icon-57x57.png">

<!-- Android Chrome Icons -->
<link rel="icon" type="image/png" sizes="192x192" href="/icons/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="96x96" href="/icons/android-chrome-96x96.png">

<!-- Microsoft Tiles -->
<meta name="msapplication-TileColor" content="#6366f1">
<meta name="msapplication-TileImage" content="/icons/mstile-144x144.png">
<meta name="msapplication-config" content="/browserconfig.xml">

<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.json">

<!-- Theme color -->
<meta name="theme-color" content="#6366f1">`);
  } catch (error) {
    console.error("❌ Error generating icons:", error);
    process.exit(1);
  }
}

// Run the script directly
main();
