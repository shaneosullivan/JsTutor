import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ClientProvider from "@/components/ClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JsTutor - Interactive JavaScript Learning Platform",
  description:
    "Learn JavaScript through interactive tutorials, code examples, and real-time practice. Master JavaScript fundamentals with hands-on exercises.",
  keywords: [
    "JavaScript",
    "tutorial",
    "learning",
    "programming",
    "coding",
    "education",
    "web development",
    "ES6",
    "interactive",
    "hands-on",
  ],
  authors: [{ name: "JsTutor Team" }],
  creator: "JsTutor",
  publisher: "JsTutor",
  category: "education",
  classification: "Educational Technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://jstutor.com"),
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/icons/icon-256x256.png", sizes: "256x256", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icons/favicon.png",
    apple: [
      {
        url: "/icons/apple-touch-icon-57x57.png",
        sizes: "57x57",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-60x60.png",
        sizes: "60x60",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-76x76.png",
        sizes: "76x76",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-114x114.png",
        sizes: "114x114",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-120x120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-167x167.png",
        sizes: "167x167",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [{ rel: "mask-icon", url: "/icons/favicon.png" }],
  },
  appleWebApp: {
    capable: true,
    title: "JavaScript Adventure",
    statusBarStyle: "default",
    startupImage: [
      {
        url: "/icons/apple-touch-icon-180x180.png",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/icons/apple-touch-icon-180x180.png",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/icons/apple-touch-icon-180x180.png",
        media:
          "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },
  applicationName: "JavaScript Adventure",
  referrer: "origin-when-cross-origin",
  colorScheme: "light",
  themeColor: "#6366f1",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  openGraph: {
    title: "JsTutor - Interactive JavaScript Learning Platform",
    description:
      "Learn JavaScript through interactive tutorials, code examples, and real-time practice. Master programming fundamentals with hands-on exercises and real-time feedback.",
    url: "https://jstutor.com",
    siteName: "JsTutor",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "JsTutor - Interactive JavaScript Learning Platform",
      },
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "JsTutor Logo",
      },
    ],
    locale: "en_US",
    type: "website",
    countryName: "United States",
  },
  twitter: {
    card: "summary_large_image",
    title: "JsTutor - Interactive JavaScript Learning Platform",
    description:
      "Learn JavaScript through interactive tutorials, code examples, and real-time practice. Master programming fundamentals with hands-on exercises.",
    images: ["/icons/icon-512x512.png"],
    creator: "@jstutor",
    site: "@jstutor",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://jstutor.com",
  },
  other: {
    "msapplication-TileColor": "#6366f1",
    "msapplication-TileImage": "/icons/mstile-144x144.png",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "JsTutor - Interactive JavaScript Learning Platform",
    description:
      "Learn JavaScript through interactive tutorials, code examples, and real-time practice. Master programming fundamentals with hands-on exercises.",
    url: "https://jstutor.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://jstutor.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    author: {
      "@type": "Organization",
      name: "JsTutor Team",
    },
    publisher: {
      "@type": "Organization",
      name: "JsTutor",
      logo: {
        "@type": "ImageObject",
        url: "https://jstutor.com/logo.svg",
      },
    },
    educationalAlignment: {
      "@type": "AlignmentObject",
      alignmentType: "teaches",
      educationalFramework: "JavaScript Programming",
      targetName: "JavaScript Fundamentals",
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
    genre: "Education",
    keywords:
      "JavaScript, tutorial, learning, programming, coding, education, web development, ES6, interactive, hands-on",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={inter.className}>
        <ClientProvider>
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
