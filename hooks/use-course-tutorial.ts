"use client";

import { useState } from "react";

export function useTutorial() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userCode, setUserCode] = useState("");

  return {
    sidebarCollapsed,
    setSidebarCollapsed,
    userCode,
    setUserCode
  };
}
