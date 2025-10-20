import AppSidebar from "@/components/application/admin/AppSidebar";
import Topbar from "@/components/application/admin/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import React from "react";

const layout = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <main className="md:w-[calc(100vw-16rem)] w-full">
          <div className="mt-[70px] md:px-8 px-5 min-h-[calc(100vh-40px)] pb-10">
            <Topbar />
            {children}
          </div>
          <div className="border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm">
            @ 2025 Subrata Guchhait.All Right Reserved
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default layout;
