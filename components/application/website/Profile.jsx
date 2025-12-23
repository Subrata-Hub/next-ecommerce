"use client";
import React, { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Login from "../auth/Login";
import { login, setLoginPopup } from "@/store/slices/authSlice";
import Link from "next/link";

const Profile = ({ user }) => {
  const dispatch = useDispatch();
  const authFromStore = useSelector((store) => store.authStore.auth);

  const loggedinuserData = {
    _id: user?._id,
    role: user?.role,
    name: user?.name,
    avater: user?.avater,
  };

  useEffect(() => {
    if (user) {
      dispatch(login(loggedinuserData));
    }
  }, []);
  return (
    <div className="mb-1">
      {authFromStore?.name ? (
        <Link href="/my-account?tab=profile">
          <FaRegUser className="text-[23px]" />
        </Link>
      ) : (
        <button
          className="px-4 py-2 border rounded-2xl"
          // onClick={() => setLoginPopup(true)}
          onClick={() => dispatch(setLoginPopup(true))}
        >
          Login
        </button>
      )}
      {/* {loginPopup && (
        <Login loginPopup={loginPopup} setLoginPopup={setLoginPopup} />
      )} */}
    </div>
  );
};

export default Profile;
