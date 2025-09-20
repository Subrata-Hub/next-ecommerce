import React from "react";
import loading from "@/public/assets/images/loading.svg";
import Image from "next/image";

const Loadings = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-start mt-12">
      <Image src={loading.src} width={80} height={80} alt="loading" />
    </div>
  );
};

export default Loadings;
