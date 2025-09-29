import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const payload = await request.json();
    const { paramsToSign } = payload;
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_SECRET_KEY
    );
    return NextResponse.json({ signature });
  } catch (error) {}
};
