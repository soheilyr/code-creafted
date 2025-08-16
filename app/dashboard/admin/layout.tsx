"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MobileSidebar from "./_components/MobileSidebar";
import SideBar from "./_components/Sidebar";

const queryClient = new QueryClient();

export default function Dashboardlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background flex">
      <QueryClientProvider client={queryClient}>
        <SideBar />
        <MobileSidebar />
        {children}
      </QueryClientProvider>
    </div>
  );
}
