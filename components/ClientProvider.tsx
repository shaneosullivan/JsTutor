"use client";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { KeyboardProvider } from "@/components/KeyboardProvider";
import { initializeClientId } from "@/lib/client-id";

export default function ClientProvider({
  children
}: {
  children: React.ReactNode;
}) {
  // Initialize clientId on app start
  useEffect(() => {
    initializeClientId();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>{children}</KeyboardProvider>
    </QueryClientProvider>
  );
}
