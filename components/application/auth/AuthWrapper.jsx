"use client";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

const Login = dynamic(() => import("./Login"), { ssr: false });

const AuthWrapper = () => {
  const { loginPopup } = useSelector((state) => state.authStore);

  return loginPopup ? <Login /> : null;
};

export default AuthWrapper;
