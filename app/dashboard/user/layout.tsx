"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "./_components/Sidebar";
import MobileSidebar from "./_components/MobileSidebar";

const queryClient = new QueryClient();

export default function Dashboardlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background flex">
      <QueryClientProvider client={queryClient}>
        <Sidebar />
        {/* <MobileSidebar /> */}
        {children}
      </QueryClientProvider>
    </div>
  );
}
