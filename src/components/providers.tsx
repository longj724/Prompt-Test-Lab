"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
