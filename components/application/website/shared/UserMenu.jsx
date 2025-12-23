"use client";

import React, { useEffect, useState } from "react";
import ShoppingCard from "./ShoppingCard";
import Favourite from "./Favourite";
import Profile from "../Profile";

import axios from "axios";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { setRefetchUser } from "@/store/slices/settingSlice";

const UserMenu = () => {
  const pathname = usePathname();
  const authFromStore = useSelector((store) => store.authStore.auth);
  const refetchUser = useSelector((store) => store.settingStore.refetchUser);

  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);

  const getUserData = async () => {
    if (!authFromStore) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/users/me`);
      if (response.data.success) {
        setUserData(response?.data?.data);
      }

      if (refetchUser) dispatch(setRefetchUser(false));

      console.log(response);

      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authFromStore || refetchUser) {
      getUserData();
    }

    // if (pathname === "/") getUserData();
  }, [authFromStore?._id, refetchUser]);

  if (loading) {
    return (
      <div className="hidden md:flex justify-between items-center gap-3">
        <div className="w-10 h-10 flex rounded-full bg-gray-200"></div>
        <div className="w-10 h-10 flex rounded-full bg-gray-200"></div>
        <div className="w-10 h-10 flex rounded-full bg-gray-200"></div>
      </div>
    );
  }
  return (
    <div className="hidden md:flex justify-between items-center gap-8">
      <ShoppingCard cart={userData?.[0]?.cart?.[0]} />

      <Favourite favourites={userData?.[0]?.favourites?.[0]} />

      <Profile user={userData?.[0]} />
    </div>
  );
};

export default UserMenu;
