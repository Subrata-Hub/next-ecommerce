"use client";
import React from "react";
import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";
import { RiMenu4Fill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import AdminSearch from "./AdminSearch";
import logoBlack from "@/public/assets/images/logo-black.png";
import logoWhite from "@/public/assets/images/logo-white.png";
import Image from "next/image";
import AdminMobileSearch from "./AdminMobileSearch";

const Topbar = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="fixed border h-14 w-full top-0 left-0 z-30 md:ps-72 md:pe-8 px-5 md:px-0 flex justify-between items-center bg-white dark:bg-card">
      <div className="pl-0 md:pl-72">
        <div className="flex items-center md:hidden">
          <Image
            src={logoBlack.src}
            height={50}
            width={logoBlack.width}
            className="block dark:hidden h-[50px] w-auto"
            alt="logo dark"
          />
          <Image
            src={logoWhite.src}
            height={50}
            width={logoWhite.width}
            className="hidden dark:block h-[50px] w-auto"
            alt="logo white"
          />
        </div>
        <div className="md:block hidden">
          <AdminSearch />
        </div>
      </div>
      <div className="flex items-center gap-2 pr-4">
        <AdminMobileSearch />
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
