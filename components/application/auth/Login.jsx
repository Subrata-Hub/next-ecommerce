"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { showToast } from "@/lib/showToast";
import {
  login,
  setLoginPopup,
  setPostLoginRedirect,
} from "@/store/slices/authSlice";
import { ADMIN_DASBOARD } from "@/routes/AddminPanelRoutes";
import { USER_DASBOARD } from "@/routes/WebsiteRoutes";
import OTPVerification from "@/components/application/OTPVerification";

// Import the sub-components created above
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { setShowAddressForm } from "@/store/slices/settingSlice";

const Login = () => {
  // State: 'LOGIN' | 'REGISTER' | 'OTP'
  const [view, setView] = useState("LOGIN");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const loginPopup = useSelector((state) => state.authStore.loginPopup);
  const postLoginRedirect = useSelector(
    (state) => state.authStore.postLoginRedirect
  );

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOtpVerification = async (values) => {
    try {
      setOtpLoading(true);
      const { data } = await axios.post("/api/auth/verify-otp", values);
      console.log(data);
      if (!data.success) throw new Error(data.message);

      showToast("success", data.message);
      dispatch(login(data.data));

      // if (!loginPopup) {
      //   dispatch(setShowAddressForm(true));
      // }

      // Redirect logic
      // Priority 1: Check Redux state (set by Cart page)
      if (postLoginRedirect) {
        router.push(postLoginRedirect);
        dispatch(setPostLoginRedirect(null)); // Clear it so it doesn't persist
      } else if (searchParams.has("callback")) {
        // Priority 2: Check URL Callback (e.g. ?callback=/profile)
        router.push(searchParams.get("callback"));
      } else {
        router.push(data.data.role === "admin" ? ADMIN_DASBOARD : "");
      }
      // if (searchParams.has("callback")) {
      //   //   // Priority 2: Check URL Callback (e.g. ?callback=/profile)
      //   router.push(searchParams.get("callback"));
      // } else {
      //   router.push(data.data.role === "admin" ? ADMIN_DASBOARD : "");
      // }

      // dispatch(setShowAddressForm(true));

      // Close modal and clean up

      dispatch(setLoginPopup(false));
      setOtpEmail("");
      setView("LOGIN");
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleLoginSuccess = (email) => {
    setOtpEmail(email);
    setView("OTP");
  };

  const handleErrorMessage = (message) => {
    showToast("error", message);
  };

  const renderContent = () => {
    switch (view) {
      case "REGISTER":
        return (
          <>
            <DialogTitle className="text-center text-2xl font-semibold">
              Create Account
            </DialogTitle>
            <DialogDescription className="text-center">
              Create an account by filling out the form below
            </DialogDescription>
            <RegisterForm
              onSwitchToLogin={() => setView("LOGIN")}
              onRegisterFail={handleErrorMessage}
            />
          </>
        );
      case "OTP":
        return (
          <>
            <DialogTitle className="text-center text-2xl font-semibold">
              Verify OTP
            </DialogTitle>
            <DialogDescription className="text-center">
              Enter the OTP sent to {otpEmail}
            </DialogDescription>
            <OTPVerification
              email={otpEmail}
              onSubmit={handleOtpVerification}
              loading={otpLoading}
            />
          </>
        );
      case "LOGIN":
      default:
        return (
          <>
            <DialogTitle className="text-center text-2xl font-semibold">
              Login Into Account
            </DialogTitle>
            <DialogDescription className="text-center">
              Login into your account by filling out the form below
            </DialogDescription>
            <LoginForm
              onSwitchToRegister={() => setView("REGISTER")}
              onLoginSuccess={handleLoginSuccess}
              onLoginFail={handleErrorMessage}
            />
          </>
        );
    }
  };

  const handleOpenChange = (open) => {
    dispatch(setLoginPopup(open));
  };

  return (
    <Dialog
      open={loginPopup}
      onOpenChange={handleOpenChange}
      className="fixed z-[1200000000]"
    >
      <DialogContent>{renderContent()}</DialogContent>
    </Dialog>
  );
};

export default Login;
