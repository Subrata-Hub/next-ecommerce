"use client";
import React, { useEffect, useState } from "react";
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
import { USER_DASBOARD, WEBSITE_HOME } from "@/routes/WebsiteRoutes";
import OTPVerification from "@/components/application/OTPVerification";

// Import the sub-components created above
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import {
  setRefetchUser,
  setShowAddressForm,
} from "@/store/slices/settingSlice";
import { getLocalCartId } from "@/lib/helperFunction";
import ResetPasswordForm from "./ResetPasswordForm";
import UpdatePasswordForm from "./UpdatePasswordForm";

const Login = () => {
  // State: 'LOGIN' | 'REGISTER' | 'OTP'
  const [view, setView] = useState("LOGIN");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [isPasswordResetVarification, setIsPasswordResetVarification] =
    useState(false);
  const loginPopup = useSelector((state) => state.authStore.loginPopup);
  const postLoginRedirect = useSelector(
    (state) => state.authStore.postLoginRedirect
  );

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartId = getLocalCartId();

  const handleOtpVerification = async (values) => {
    try {
      setOtpLoading(true);
      const { data } = await axios.post("/api/auth/verify-otp", values);
      console.log(data);
      if (!data.success) throw new Error(data.message);

      showToast("success", data.message);
      dispatch(login(data.data));
      const id = crypto.randomUUID();
      localStorage.setItem("publicUserId", id);

      // if (!loginPopup) {
      //   dispatch(setShowAddressForm(true));
      // }

      // updating guest carts

      if (cartId && data.success && data.data.role !== "admin") {
        const { response } = await axios.post("/api/cart/update-user", {
          cartId,
        });

        // console.log(response);
      }

      // Redirect logic
      // Priority 1: Check Redux state (set by Cart page)
      if (postLoginRedirect) {
        router.push(postLoginRedirect);
        dispatch(setPostLoginRedirect(null)); // Clear it so it doesn't persist
      } else if (searchParams.has("callback")) {
        // Priority 2: Check URL Callback (e.g. ?callback=/profile)
        router.push(searchParams.get("callback"));
      } else {
        router.push(data.data.role === "admin" ? ADMIN_DASBOARD : WEBSITE_HOME);
      }
      // if (searchParams.has("callback")) {
      //   //   // Priority 2: Check URL Callback (e.g. ?callback=/profile)
      //   router.push(searchParams.get("callback"));
      // } else {
      //   router.push(data.data.role === "admin" ? ADMIN_DASBOARD : "");
      // }

      // dispatch(setShowAddressForm(true));

      // Close modal and clean up
      dispatch(setRefetchUser(true));

      dispatch(setLoginPopup(false));
      setOtpEmail("");
      setView("LOGIN");
    } catch (error) {
      // showToast("error", error.message);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      handleErrorMessage(errorMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpVerificationForResetPassword = async (values) => {
    try {
      setOtpLoading(true);
      const { data: otpResponse } = await axios.post(
        "/api/auth/reset-password/verify-otp",
        values
      );
      if (!otpResponse.success) {
        throw new Error(otpResponse.message);
      }

      showToast("success", otpResponse.message);
      // setIsOtpVerified(true);
      setIsPasswordResetVarification(false);

      setView("UPDATE-PASSWORD");
    } catch (error) {
      // showToast("error", error.message);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      handleErrorMessage(errorMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleLoginSuccess = (email) => {
    setOtpEmail(email);
    setView("OTP");
  };

  const handleEmailVerificationSuccess = () => {
    // setOtpEmail(email);
    setIsPasswordResetVarification(true);
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
              onSubmit={
                !isPasswordResetVarification
                  ? handleOtpVerification
                  : handleOtpVerificationForResetPassword
              }
              loading={otpLoading}
              // onOtpVerificationFail={handleErrorMessage}
            />
          </>
        );
      case "RESET-PASSWORD":
        return (
          <>
            <DialogTitle className="text-center text-2xl font-semibold">
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-center">
              Enter your email for password reset
            </DialogDescription>
            <ResetPasswordForm
              onSwitchToLogin={() => setView("LOGIN")}
              handleEmailVerificationSuccess={handleEmailVerificationSuccess}
              setOtpEmail={setOtpEmail}
              onResetPasswordFail={handleErrorMessage}
            />
          </>
        );

      case "UPDATE-PASSWORD":
        return (
          <>
            <DialogTitle className="text-center text-2xl font-semibold">
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-center">
              Enter your email for password reset
            </DialogDescription>

            <UpdatePasswordForm
              email={otpEmail}
              onPasswordUpdateSuccess={() => setView("LOGIN")}
              onUpdatePasswordFail={handleErrorMessage}
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
              onSwitchToResetPassword={() => setView("RESET-PASSWORD")}
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
