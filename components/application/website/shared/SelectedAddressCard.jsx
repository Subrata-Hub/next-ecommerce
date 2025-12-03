import React from "react";

const SelectedAddressCard = ({ address }) => {
  return (
    <div className="w-full border p-4 ">
      <div className="px-2">
        <div className="flex gap-2">
          <h1 className="font-medium">{address?.label}</h1>
          <span>
            {address?.firstName} ({address?.phoneNumber})
          </span>
        </div>

        <h2>{address?.addressType}</h2>
        <p>{address?.address_line_2}</p>

        <div className="flex flex-col gap-y-2 mt-2">
          <div>{(address?.distance / 1000).toFixed(2)}km</div>
        </div>
      </div>
    </div>
  );
};

export default SelectedAddressCard;
