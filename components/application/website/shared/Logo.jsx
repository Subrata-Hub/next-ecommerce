import Image from "next/image";
import React from "react";
import Logos from "@/public/assets/images/CakeoClock.jpg";
import Link from "next/link";
import { WEBSITE_HOME } from "@/routes/WebsiteRoutes";

const Logo = () => {
  return (
    <div>
      <Link href={WEBSITE_HOME}>
        <div className="w-[70px] md:w-[130px] h-[60px] md:h-[100px]">
          <Image
            src={Logos.src}
            alt="logo"
            width={130}
            height={100}
            className="w-full h-full object-center"
          />
        </div>
      </Link>
    </div>
  );
};

export default Logo;
