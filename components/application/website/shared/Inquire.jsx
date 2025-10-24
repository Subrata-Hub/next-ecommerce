import Link from "next/link";
import React from "react";

const Inquire = () => {
  return (
    <nav>
      <ul className="flex justify-between items-center gap-6">
        <li>
          <Link href="">What's in the store</Link>
        </li>
        <li>
          <Link href="">About us</Link>
        </li>
        <li>
          <Link href="">Contact us</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Inquire;
