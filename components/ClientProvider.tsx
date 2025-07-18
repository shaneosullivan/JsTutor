"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { KeyboardProvider } from "@/components/KeyboardProvider";

export default function ClientProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>{children}</KeyboardProvider>
    </QueryClientProvider>
  );
}
