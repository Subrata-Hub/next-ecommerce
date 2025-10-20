"use client";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import SearchModal from "./SearchModal";

const AdminSearch = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:w-[356px]">
      <div className="flex justify-between items-center relative">
        <Input
          readOnly
          className="rounded-full cursor-pointer"
          placeholder="Search...."
          onClick={() => setOpen(true)}
        />
        <button
          type="button"
          className="absolute right-3 cursor-default"
        ></button>
      </div>
      <SearchModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default AdminSearch;
