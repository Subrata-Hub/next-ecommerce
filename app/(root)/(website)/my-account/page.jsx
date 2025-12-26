import UserPanelSidebar from "@/components/application/website/shared/UserPanelSidebar";
import MyAddresses from "@/components/application/website/user-dasboard/MyAddresses";
import MyOrders from "@/components/application/website/user-dasboard/MyOrders";
import UserProfile from "@/components/application/website/user-dasboard/UserProfile";
import Wishlist from "@/components/application/website/user-dasboard/Wishlist";

import axios from "axios";
import { cookies } from "next/headers";

// import { useSearchParams } from "next/navigation";
import React from "react";

const MyAccount = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams.tab;

  let user = null;

  // const user = await getCachedUser();
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("access_token");
    const token = tokenCookie?.value; // This is the actual JWT string

    if (token) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
        {
          // 👈 3. Manually forward the cookies to the API
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        user = response?.data?.data;
      }
    }
  } catch (error) {
    // ✅ FIX: Ignore the expected "prerender" error during build
    if (error.message.includes("prerender")) {
      user = null; // Treat as guest during build
    } else if (error.response && error.response.status === 403) {
      // user is just not logged in, do nothing
    } else {
      console.error("Error fetching user:", error.message);
    }

    // if (!user) return;
  }

  const addresses = user?.[0]?.address;
  const favouriteProducts = user?.[0]?.favourites;

  const userInfo = {
    _id: user?.[0]._id,
    name: user?.[0].name,
    email: user?.[0].email,
    phoneNumber: user?.[0]?.phoneNumber,
    date_of_brith: user?.[0]?.date_of_brith,
    date_of_anniversary: user?.[0]?.date_of_anniversary,
  };

  return (
    <div className="px-4 md:px-4 lg:px-6 xl:px-15 2xl:px-40 pt-15">
      <div className="flex flex-col lg:flex-row  gap-8 w-full 2xl:px-8">
        <div className="w-full lg:w-[25%]">
          <UserPanelSidebar tab={tab} userInfo={userInfo} />
        </div>
        <div className="w-full lg:w-[75%]">
          {tab === "profile" && <UserProfile user={userInfo} />}

          {tab === "orders" && <MyOrders />}

          {tab === "favourites" && (
            <Wishlist favouriteProducts={favouriteProducts} />
          )}

          {tab === "addresses" && <MyAddresses addresses={addresses} />}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
