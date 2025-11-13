import { ReactNode } from "react";
import AviationNavbar from "./_components/aviation-navbar";
import AviationSidebar from "./_components/aviation-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden w-full">
      <AviationSidebar />
      <AviationNavbar>{children}</AviationNavbar>
    </div>
  );
}
