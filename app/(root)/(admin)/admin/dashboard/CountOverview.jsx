"use client";
import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_CUSTOMER_SHOW,
  ADMIN_PRODUCT_SHOW,
} from "@/routes/AddminPanelRoutes";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { MdOutlineShoppingBag } from "react-icons/md";
import Link from "next/link";

import useFetch from "@/hooks/useFetch";
import { colorClasses } from "@/lib/dashboardColor";

const CountOverview = () => {
  const { data: countData } = useFetch("/api/dashboard/admin/count");
  const Dashborditems = [
    {
      category: "Total Categories",
      url: ADMIN_CATEGORY_SHOW,
      count: countData?.data?.category,
      icon: <BiCategory />,
      color: "green",
    },
    {
      category: "Total Products",
      url: ADMIN_PRODUCT_SHOW,
      count: countData?.data?.product,
      icon: <IoShirtOutline />,
      color: "blue",
    },
    {
      category: "Total Customers",
      url: ADMIN_CUSTOMER_SHOW,
      count: countData?.data?.customer,
      icon: <LuUserRound />,
      color: "yellow",
    },
    {
      category: "Total Orders",
      count: 10,
      icon: <MdOutlineShoppingBag />,
      color: "cyan",
    },
  ];

  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-10 gap-5">
      {Dashborditems.map((item, index) => {
        const color = colorClasses[item.color];
        return (
          <Link href={`${item?.url}`} key={index}>
            <div
              className={`flex items-center justify-between p-3 rounded-lg border shadow border-gray-200 dark:border-gray-800 ${color.border} bg-white dark:bg-card`}
            >
              <div>
                <h4 className="font-medium text-gray-500 dark:text-gray-200">
                  {item.category}
                </h4>
                <span className="text-xl font-bold">{item.count}</span>
              </div>
              <div>
                <span
                  className={`w-12 h-12 border flex justify-center items-center rounded-full ${color.bg} text-white`}
                >
                  {item.icon}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CountOverview;
