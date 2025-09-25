"use client";
import React from "react";
import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";
import { RiMenu4Fill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

const Topbar = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="fixed border h-14 w-full top-0 left-0 z-30 md:ps-72 md:pe-8 px-5 md:px-0 flex justify-between items-center bg-white dark:bg-card">
      <div className="pl-0 md:pl-72">Search component</div>
      <div className="flex items-center gap-2 pr-4">
        <ThemeSwitch />
        <UserDropdown />
        <Button
          type="button"
          onClick={toggleSidebar}
          size="icon"
          className="mt-2 md:hidden"
        >
          <RiMenu4Fill />
        </Button>
      </div>
    </div>
  );
};

export default Topbar;
