import Footer from "@/components/application/website/shared/Footer";
import Header from "@/components/application/website/shared/Header";
import React from "react";
import { Kumbh_Sans, Readex_Pro } from "next/font/google";
import Categories from "@/components/application/website/shared/Categories";
import FooterNavbar from "@/components/application/website/shared/FooterNavbar";

// const kumbh = Kumbh_Sans({
//   subsets: ["latin"], // Or ['latin', 'arabic'] if needed
//   weight: ["400", "500", "600", "700", "800"],
//   display: "swap",
// });

const layout = ({ children }) => {
  return (
    <div className={`min-h-screen flex flex-col`}>
      <Header />
      <Categories />
      <main className="flex-1 pt-[70px] md:pt-0 pb-[70px] md:pb-0">
        {children}
      </main>
      <Footer />
      <FooterNavbar />
    </div>
  );
};

export default layout;

// import Footer from "@/components/application/website/shared/Footer";
// import Header from "@/components/application/website/shared/Header";
// import React from "react";
// import { Kumbh_Sans } from "next/font/google";
// import Categories from "@/components/application/website/shared/Categories";
// import FooterNavbar from "@/components/application/website/shared/FooterNavbar";

// const kumbh = Kumbh_Sans({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"],
//   display: "swap",
// });

// const layout = ({ children }) => {
//   return (
//     <div className={`${kumbh.className} min-h-screen flex flex-col`}>
//       {/* --- FIXED TOP SECTION --- */}
//       {/* This wrapper stays fixed at the top for both mobile and desktop */}
//       <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
//         <Header />

//         {/* DESKTOP ONLY: Categories are fixed immediately below Header */}
//         <div className="hidden md:block border-b border-gray-100">
//           <Categories />
//         </div>
//       </div>

//       {/* --- SCROLLABLE CONTENT --- */}
//       {/* Padding Top Calculation:
//           - Mobile: 70px (Header Height)
//           - Desktop: 150px (Header 100px + Categories ~50px).
//             *Adjust 150px if your Categories bar is taller/shorter* */}
//       <div className="flex-1 pt-[70px] md:pt-[150px] pb-[70px] md:pb-0 flex flex-col">
//         {/* MOBILE ONLY: Categories scroll with the page content */}
//         <div className="md:hidden">
//           <Categories />
//         </div>

//         <main className="flex-1">{children}</main>

//         <Footer />
//       </div>

//       {/* Fixed Bottom Nav for Mobile */}
//       <FooterNavbar />
//     </div>
//   );
// };

// export default layout;
