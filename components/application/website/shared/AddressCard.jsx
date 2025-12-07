import React, { useState } from "react";

import { getLocalCartId } from "@/lib/helperFunction";
import axios from "axios";

const AddressCard = ({
  address,
  setSelectedAddress = false,
  setShowSelectedAddress = false,
  refetch,
}) => {
  const selectAddress = async () => {
    const newAddressId = address._id; // Ensure your API returns the created object
    const currentCartId = getLocalCartId();

    if (newAddressId && currentCartId) {
      try {
        await axios.post(`/api/cart/update`, {
          cartId: currentCartId,
          addressId: newAddressId,
        });

        setSelectedAddress(address);
        setShowSelectedAddress(true);

        refetch();
      } catch (cartError) {
        console.error("Background cart update failed:", cartError);
        // Optional: You might want to throw here if cart update is mandatory
      }
    }
  };

  // md:w-[390px] lg:w-full xl:w-[390px]

  return (
    <div className="w-full  border p-4 ">
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
          <button
            className="px-4 py-2 bg-primary text-white"
            onClick={selectAddress}
          >
            DELEVER HERE
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
