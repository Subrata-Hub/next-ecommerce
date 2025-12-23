"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import { userPanelSidebarMenu } from "@/lib/userPanelSidebarMenu";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { CiLogout } from "react-icons/ci";
import axios from "axios";
import { appStore } from "@/store/appStore";
import { clearCart } from "@/store/slices/cartSlice";
import { updateInitialState } from "@/store/slices/favouriteSlice";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const UserPanelSidebar = ({ tab, userInfo }) => {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleClik = (tab) => {
    navigate.push(`/my-account?tab=${tab}`);
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      const { data: logoutResponse } = await axios.post("/api/auth/logout");
      if (!logoutResponse.success) {
        throw new Error(logoutResponse.message);
      }

      appStore.dispatch(clearCart());
      dispatch(
        updateInitialState({
          publicUserId: "",
          favouriteProducts: [],
        })
      );
      localStorage.removeItem("cartId");
      localStorage.removeItem("publicUserId");
      dispatch(logout());
      navigate.push("/");
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  // 1. Extract the internal sidebar content to reusable component
  // This avoids duplicate code for Mobile vs Desktop
  const SidebarContent = ({ isMobile = false }) => (
    <>
      {/* HEADER */}
      <div className="w-full h-20 p-4 border-b border-gray-200 flex gap-4 items-center">
        <Avatar className="w-12 h-12">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-y-1">
          <p className="font-light text-sm">Hello,</p>
          <h1 className="font-bold text-md truncate">{userInfo?.name}</h1>
        </div>
      </div>

      {/* MENU ITEMS */}
      <div className="flex flex-col gap-y-4 p-4 flex-1 overflow-y-auto">
        {userPanelSidebarMenu.map((menu) => {
          const isActive = tab === menu.tab;
          return (
            <button
              key={menu.title}
              className={`flex gap-2 items-center p-3 rounded-xl transition-all ${
                isActive ? "bg-red-600 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => handleClik(menu.tab)}
            >
              <menu.icon size={20} />
              <span className="font-medium">{menu.title}</span>
            </button>
          );
        })}
      </div>

      {/* LOGOUT */}
      <div
        className={`${
          isMobile ? "absolute bottom-20 left-0 w-full" : "w-full"
        } border-t border-gray-200 p-4`}
      >
        <button
          className="flex items-center gap-2 w-full p-2 hover:bg-gray-200 rounded-xl transition-all text-red-600 font-medium"
          onClick={handleLogout}
        >
          <CiLogout size={22} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* --- DESKTOP VIEW --- */}
      {/* CSS: hidden on mobile, flex on large screens */}
      <div className="hidden lg:flex flex-col w-full min-h-[600px] bg-neutral-100 border border-gray-200 rounded-2xl">
        <SidebarContent isMobile={false} />
      </div>

      {/* --- MOBILE VIEW --- */}
      {/* CSS: visible on mobile, hidden on large screens */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="text-3xl" onClick={() => setOpen(true)}>
              <HiMiniBars3BottomRight />
            </button>
          </SheetTrigger>

          <SheetContent className="flex w-[85%] sm:w-[350px]" side="left">
            <SheetHeader>
              <SheetTitle className="hidden">Menu</SheetTitle>
              <SheetDescription className="hidden">User Menu</SheetDescription>
            </SheetHeader>

            <div className="flex flex-col w-full h-full bg-neutral-100 border border-gray-200 rounded-2xl mt-4 relative overflow-hidden">
              <SidebarContent isMobile={true} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default UserPanelSidebar;
