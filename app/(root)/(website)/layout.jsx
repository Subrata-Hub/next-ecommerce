import Footer from "@/components/application/website/shared/Footer";
import Header from "@/components/application/website/shared/Header";
import React from "react";
import { Kumbh_Sans, Readex_Pro } from "next/font/google";
import Categories from "@/components/application/website/shared/Categories";

// const readex_pro = Readex_Pro({
//   subsets: ["latin"], // Or ['latin', 'arabic'] if needed
//   weight: ["400", "500", "600", "700"],
//   display: "swap",
// });

const kumbh = Kumbh_Sans({
  subsets: ["latin"], // Or ['latin', 'arabic'] if needed
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const layout = ({ children }) => {
  return (
    <div className={kumbh.className}>
      <Header />
      <Categories />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default layout;
