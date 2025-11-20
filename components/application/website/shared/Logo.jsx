import Image from "next/image";
import React from "react";
import Logos from "@/public/assets/images/CakeoClock.jpg";
import Link from "next/link";
import { WEBSITE_HOME } from "@/routes/WebsiteRoutes";

const Logo = () => {
  return (
    <div>
      <Link href={WEBSITE_HOME}>
        <Image
          src={Logos.src}
          alt="logo"
          width={130}
          height={100}
          className="w-[130px] h-[100px]"
        />
      </Link>
    </div>
  );
};

export default Logo;
