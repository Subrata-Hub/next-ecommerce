import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { cookies } from "next/headers";

export const POST = async (request) => {
  try {
    await connectDB();
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    return response(true, 200, "logout successfull");
  } catch (error) {
    catchError();
  }
};
