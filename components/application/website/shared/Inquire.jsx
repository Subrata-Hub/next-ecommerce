import Link from "next/link";
import React from "react";

const Inquire = () => {
  return (
    <nav>
      <ul className="hidden xl:flex justify-between items-center gap-6">
        <li className="text-nowrap">
          <Link href="">What's in the store</Link>
        </li>
        <li className="text-nowrap">
          <Link href="">About us</Link>
        </li>
        <li className="text-nowrap">
          <Link href="">Contact us</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Inquire;
