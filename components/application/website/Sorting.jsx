import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortings } from "@/lib/utils";

import { IoFilterOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";

const Sorting = ({
  sorting,
  setSorting,
  categoryData,
  mobileFilterOpen,
  setMobileFilterOpen,
  productLength,
}) => {
  return (
    <div className="flex justify-between flex-wrap lg:flex-nowrap">
      <div className="lg:hidden">
        <Button
          type="button"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
        >
          <IoFilterOutline /> Filter
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">{categoryData?.name}</h1>
        {productLength && (
          <span className="text-gray-500 font-semibold">{`(${productLength} Items)`}</span>
        )}
      </div>

      <div className="md:w-[200px] bg-white flex justify-center items-center text-nowrap">
        <div>Sort By:</div>
        <Select value={sorting} onValueChange={(value) => setSorting(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Default Sorting" />
          </SelectTrigger>
          <SelectContent>
            {sortings?.map((sort) => (
              <SelectItem key={sort.value} value={sort.value}>
                {sort.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Sorting;
