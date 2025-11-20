import React from "react";
import loading from "@/public/assets/images/loading.svg";
import Image from "next/image";

const UpdateLoading = ({
  className = "h-screen w-screen flex justify-center items-center", // Centering the entire loader
}) => {
  return (
    <div className={className}>
           {" "}
      {/* This is the inner container that gets the glassy style.
        We center the image inside this container.
      */}
           {" "}
      <div
        className="
        h-screen w-screen 
        //  p-4 sm:p-8
          // rounded-xl 
          shadow-xl 
          // bg-white/20 
          backdrop-blur-xs 
          // border border-white/20 
          flex  items-center justify-center
        "
      >
        <Image src={loading.src} width={80} height={80} alt="loading" />
        {/* Optional: Add text for better UX */}
        <p className="mt-4 text-lg  font-medium text-orange-500">Updating...</p>
      </div>
         {" "}
    </div>
  );
};

export default UpdateLoading;
