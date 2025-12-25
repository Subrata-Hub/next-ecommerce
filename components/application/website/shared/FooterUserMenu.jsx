"use client";

import React, { useEffect, useState } from "react";
import ShoppingCard from "./ShoppingCard";
import Favourite from "./Favourite";
import Profile from "../Profile";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux"; // Added useDispatch
import { setRefetchUser } from "@/store/slices/settingSlice";
import FooterShoppingCart from "./FooterShoppingCart";

const FooterUserMenu = () => {
  const authFromStore = useSelector((store) => store.authStore.auth);
  const refetchUser = useSelector((store) => store.settingStore.refetchUser);
  const dispatch = useDispatch(); // Initialize dispatch

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
  }, [authFromStore?._id, refetchUser]);

  // if (loading) {
  //   // Skeleton: Use grid to match the layout
  //   return (
  //     <div className="grid grid-cols-3 items-center w-full justify-items-center">
  //       <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
  //       <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
  //       <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
  //     </div>
  //   );
  // }

  return (
    // CHANGE: Use grid-cols-3 to fill the remaining 3 parent slots equally
    // justify-items-center ensures icons are centered in their slot
    <div className="grid grid-cols-3 items-center w-full h-full justify-items-center">
      {loading ? (
        <>
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        </>
      ) : (
        <>
          {/* <ShoppingCard cart={userData?.[0]?.cart?.[0]} /> */}
          <FooterShoppingCart cart={userData?.[0]?.cart?.[0]} />

          <Favourite favourites={userData?.[0]?.favourites?.[0]} />

          <Profile user={userData?.[0]} />
        </>
      )}
    </div>
  );
};

export default FooterUserMenu;
