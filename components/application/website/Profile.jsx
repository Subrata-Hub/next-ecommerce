"use client";
import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Login from "../auth/Login";
import { setLoginPopup } from "@/store/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.authStore.auth);
  // const loginPopup = useSelector((state) => state.authStore.loginPopup);
  // const [loginPopup, setLoginPopup] = useState(false);
  return (
    <div>
      {auth ? (
        <FaRegUser className="text-2xl" />
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
