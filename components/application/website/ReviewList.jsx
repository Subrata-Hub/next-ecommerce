"";
import Image from "next/image";
import React from "react";
import userIcon from "@/public/assets/images/user.png";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IoStar } from "react-icons/io5";
dayjs.extend(relativeTime);

const ReviewList = ({ review }) => {
  console.log(review);
  return (
    <div className="flex gap-5">
      <div className="w-[60px]">
        <Image
          src={review?.avatar?.url || userIcon.src}
          width={55}
          height={55}
          alt="user icon"
          className="rounded-lg"
        />
      </div>
      <div className="w-[calc(100%-100px)]">
        <div>
          <div className="flex gap-3 items-center">
            <h2 className="text-xl font-semibold">{review.title}</h2>
            <div className="flex gap-1">
              {new Array(review?.rating).fill(0).map((star, index) => (
                <IoStar key={index} className="text-yellow-500" />
              ))}
            </div>
          </div>

          {/* <span className="flex items-center">
          
           
          </span> */}
          <p className="flex gap-2 text-[18px] font-medium">
            <span className="">{review?.reviewedBy}</span>-
            <span className=" text-gray-500">
              {dayjs(review?.createdAt).fromNow()}
            </span>
          </p>
          <p className="mt-2 text-gray-600">{review?.review}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
