import React from "react";

function isDevServer(): boolean {
  const isDev =
    typeof window !== "undefined"
      ? window.location.host.indexOf("localhost:") > -1 ||
        window.location.host.indexOf("192.168.") > -1
      : process.env.NODE_ENV === "development";

  return isDev;
}

export default function Analytics() {
  if (isDevServer()) {
    return null;
  }

  React.useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://scripts.simpleanalyticscdn.com/latest.js";
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <noscript>
      <img
        src="https://queue.simpleanalyticscdn.com/noscript.gif"
        alt=""
        referrerPolicy="no-referrer-when-downgrade"
      />
    </noscript>
  );
}
