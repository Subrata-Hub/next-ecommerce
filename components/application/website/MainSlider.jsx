"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import baner1 from "@/public/assets/images/banar3.webp";
import baner2 from "@/public/assets/images/banner2.webp";
import Image from "next/image";
import { GoChevronRight } from "react-icons/go";
import { GoChevronLeft } from "react-icons/go";

const ArrowNext = (props) => {
  const { onClick } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white right-10"
    >
      <GoChevronRight size={25} className="text-gray-600" />
    </button>
  );
};

const ArrowPrevious = (props) => {
  const { onClick } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white left-10"
    >
      <GoChevronLeft size={25} className="text-gray-600" />
    </button>
  );
};

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const MainSlider = () => {
  const handleOnClick = () => {};
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    nextArrow: <ArrowNext />,
    prevArrow: <ArrowPrevious />,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          dots: false,
          arrow: false,
          nextArrow: "",
          prevArrow: "",
        },
      },
    ],
  };
  return (
    <Slider {...settings}>
      <div className="overflow-y-auto hide-scrollbar">
        <Image
          src={baner1}
          width={baner1.width}
          height={baner1.height}
          alt="banner1"
          loading="lazy"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(
            shimmer(baner1.width, baner1.height)
          )}`}
        />
      </div>
      <div className="relative">
        <Image
          src={baner2}
          width={baner2.width}
          height={baner1.height}
          alt="banner2"
          loading="lazy"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(
            shimmer(baner1.width, baner1.height)
          )}`}
        />
        <button
          type="button"
          onClick={handleOnClick}
          className="absolute bottom-40 left-32 px-8 py-3 bg-amber-400 rounded-2xl cursor-pointer"
        >
          Shop Now
        </button>
      </div>
    </Slider>
  );
};

export default MainSlider;
