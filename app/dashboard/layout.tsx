import MobileSidebar from "./_components/MobileSidebar";
import SideBar from "./_components/Sidebar";

export default function Dashboardlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background flex">
      <SideBar />
      <MobileSidebar />
      {children}
    </div>
  );
}
