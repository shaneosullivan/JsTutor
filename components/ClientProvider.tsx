"use client";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { KeyboardProvider } from "@/components/KeyboardProvider";
import { initializeClientId } from "@/lib/client-id";
import { Provider } from "tinybase/ui-react";
import { store } from "@/lib/profile-storage";

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
      <Provider store={store}>
        <KeyboardProvider>{children}</KeyboardProvider>
      </Provider>
    </QueryClientProvider>
  );
}
