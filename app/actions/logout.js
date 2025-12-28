"use server";

import { signOut } from "@/auth";
import { cookies } from "next/headers";

export const handleSignOut = async () => {
  // 1. Delete the custom token cookie
  const cookieStore = await cookies();
  cookieStore.delete("access_token");

  // 2. Sign out of NextAuth (Google/Session) & Redirect
  await signOut({ redirectTo: "/" });
};
