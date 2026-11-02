"use client";

import React from "react";

function isDevServer(): boolean {
  const isDev =
    typeof window !== "undefined"
      ? window.location.host.indexOf("localhost:") > -1 ||
        window.location.host.indexOf("192.168.") > -1
      : process.env.NODE_ENV === "development";

  return isDev;
}

// Self-hosted Umami analytics (https://chofterstats.com)
export default function Analytics() {
  if (isDevServer()) {
    return null;
  }

  React.useEffect(() => {
    const script = document.createElement("script");
    script.defer = true;
    script.src = "https://chofterstats.com/cs.js";
    script.setAttribute(
      "data-website-id",
      "6d3b780e-b9cf-490e-a198-d3c8a0c59f8f"
    );
    script.setAttribute("data-domains", "js-tutor.com");
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
