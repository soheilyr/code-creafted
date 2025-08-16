"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Dashboardlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background flex">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </div>
  );
}
