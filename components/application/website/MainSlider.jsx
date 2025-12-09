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
        />
      </div>
      <div className="relative">
        <Image
          src={baner2}
          width={baner2.width}
          height={baner1.height}
          alt="banner2"
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
