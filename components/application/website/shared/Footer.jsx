import React from "react";
import Logo from "./Logo";
import { FaPhone } from "react-icons/fa6";
import { BsWhatsapp } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { IoLogoLinkedin } from "react-icons/io5";
import { IoLogoYoutube } from "react-icons/io";
import { RiTwitterXFill } from "react-icons/ri";
import Image from "next/image";
import fassaiLogo from "@/public/assets/images/fssaiLogo.webp";
import { WEBSITE_HOME } from "@/routes/WebsiteRoutes";
import Logos from "@/public/assets/images/CakeoClock.jpg";
import Link from "next/link";
import FeatureSection from "../FeatureSection";

const Footer = () => {
  return (
    <div className="px-36 py-20">
      <div className="pl-6">
        <FeatureSection />
      </div>
      <div className="py-10">
        <div className="w-full flex">
          <div className="md:w-[40%] flex flex-col">
            {/* <div>
            <Logo />
          </div> */}
            <div>
              <Link href={WEBSITE_HOME}>
                <Image
                  src={Logos.src}
                  alt="logo"
                  width={160}
                  height={130}
                  className="w-[160px] h-[130px]"
                />
              </Link>
            </div>
            <div className="flex flex-col gap-y-6 px-8 mt-3">
              <div className="flex gap-2 items-center">
                <FaPhone />
                <div className="flex flex-col">
                  <span>Telephone</span>
                  <span>+91-33-35438688 (9AM-9PM)</span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <BsWhatsapp />
                <div className="flex flex-col items-center">
                  <span>WhatsApp chat support</span>
                  <span>9836034567 (9AM-9PM)</span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <MdOutlineEmail />
                <div className="flex flex-col">
                  <span>Email</span>
                  <span>Cake o Clock</span>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-[60%] flex gap-4">
            <div className="flex flex-col w-[50%]">
              <h1 className="text-xl font-bold">Know Us</h1>
              <div className="w-full h-[0.5px] bg-gray-500"></div>
              <div className="flex gap-32">
                <ul className="py-4 flex flex-col gap-y-5">
                  <li>Home</li>
                  <li>Contact Us</li>
                  <li>Blogs</li>
                </ul>
                <ul className="py-4 flex flex-col gap-y-5">
                  <li>About</li>
                  <li className="text-nowrap">Locate Us</li>
                  <li>Careers</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col  w-[50%]">
              <h1 className="text-xl font-bold">Need Help</h1>
              <div className="w-full h-[0.5px] bg-gray-500"></div>
              <div className="flex gap-32">
                <ul className="py-4 flex flex-col gap-y-5">
                  <li>Privacy</li>
                  <li>FAQ’s</li>
                  <li className="text-nowrap">Refund & Return</li>
                </ul>
                <ul className="py-4 flex flex-col gap-y-5">
                  <li>Terms of Use</li>
                  <li>CSR</li>
                  <li className="text-nowrap">Shipping Policy</li>
                </ul>
              </div>
              <div className="flex ">
                <div className="w-32">
                  <Image src={fassaiLogo} alt="faasi" className="w-full" />
                  <span className="text-nowrap">
                    License No : 10014031001248
                  </span>
                </div>
                <div className="flex gap-2 mt-8">
                  <FaInstagram className="text-2xl" />
                  <FaFacebook className="text-2xl" />
                  <IoLogoLinkedin className="text-2xl" />
                  <RiTwitterXFill className="text-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
