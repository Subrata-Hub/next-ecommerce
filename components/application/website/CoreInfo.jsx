"use client";
import { Button } from "@/components/ui/button";
import { coreInfo } from "@/lib/utils";
import React, { useState } from "react";

const CoreInfo = () => {
  // Show first item by default
  const [content, showContent] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleShowContent = (index) => {
    showContent(true);
    setActiveIndex(index);
  };

  return (
    <div className="mb-20 pl-8 h-auto relative">
      <div className="shadow rounded border p-10 h-auto">
        <div className="flex gap-10 flex-wrap">
          {coreInfo?.map((item, index) => (
            <React.Fragment key={index}>
              <Button
                type="button"
                className={`px-6 py-6 rounded-4xl border-2 ${
                  activeIndex === index ? "border-blue-500" : "border-gray-500"
                }`}
                onClick={() => handleShowContent(index)}
              >
                {item.header}
              </Button>
            </React.Fragment>
          ))}
        </div>

        {/* content area below buttons */}
        <div className="mt-10 transition-all duration-300">
          {content && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {coreInfo[activeIndex]?.header}
              </h2>
              <ul className="list-disc ml-6 space-y-2">
                {coreInfo[activeIndex]?.info?.map((con, idx) => (
                  <li key={idx}>{con}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoreInfo;
