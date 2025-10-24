import Image from "next/image";
import React from "react";
import Logos from "@/public/assets/images/CakeoClock.jpg";

const Logo = () => {
  return (
    <div>
      <Image src={Logos.src} alt="logo" width={130} height={130} />
    </div>
  );
};

export default Logo;
