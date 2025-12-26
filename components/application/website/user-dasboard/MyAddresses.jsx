"use client";
import React, { useState } from "react";
import { FcHome } from "react-icons/fc";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineWorkOutline } from "react-icons/md";
import { PiBuildingOffice } from "react-icons/pi";
import { CiLocationOn } from "react-icons/ci";
import AddressEditForm from "../shared/AddressEditForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import axios from "axios";
import { showToast } from "@/lib/showToast";

const MyAddresses = ({ addresses }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({});

  const handleAddress = (address) => {
    setOpen(true);
    setSelectedAddress(address);
  };

  const handleUpdateSuccess = () => {
    setOpen(false); // Close the modal
    router.refresh(); // Refresh Server Component data without reloading page
  };

  const handleDeleteAddress = async (address) => {
    try {
      const addressId = address._id;

      const responce = await axios.delete(`/api/address/delete/${addressId}`);
      if (responce?.data?.success) {
        showToast("success", "Address deleted Successfully");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      showToast("error", error.response?.data?.message || error.message);
    }
  };
  return (
    <div>
      <div className="px-4 py-6 border-b border-b-gray-100 flex justify-between items-center">
        <h1 className="text-xl font-semibold">My Addresses</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses?.map((address) => (
          <div key={address?._id} className="w-full  border p-4 ">
            <div className="flex gap-4 items-start">
              <div>
                {address.addressType === "residential" && (
                  <FcHome className="text-3xl" />
                )}
                {address.addressType === "office" && (
                  <PiBuildingOffice className="text-3xl" />
                )}
                {address.addressType === "others" && (
                  <CiLocationOn className="text-3xl" />
                )}
              </div>

              <div>
                <div className="px-2">
                  <div className="flex gap-2">
                    <h1 className="font-medium">{address?.label}</h1>
                    <span>
                      {address?.firstName} ({address?.phoneNumber})
                    </span>
                  </div>

                  {/* <h2>{address?.addressType}</h2> */}
                  <p>{address?.address_line_2}</p>

                  <div className="flex flex-col gap-y-2 mt-2">
                    <div>{(address?.distance / 1000).toFixed(2)}km</div>
                  </div>
                </div>
                <div className="flex gap-2 p-2">
                  <button
                    className="text-orange-400 cursor-pointer font-semibold"
                    onClick={() => handleAddress(address)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-orange-400 cursor-pointer font-semibold"
                    onClick={() => handleDeleteAddress(address)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent
          className="w-full lg:max-w-[70%] xl:max-w-[60%] 2xl:max-w-[50%] h-[calc(100%-100px)] px-6 border-0 shadow-none overflow-y-scroll"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="">
            <DialogHeader className="h-8 border-b">
              <DialogTitle>Edit Address</DialogTitle>
              <DialogDescription className="hidden"></DialogDescription>
            </DialogHeader>
            <div className="h-[calc(100%-10px)] py-2">
              <AddressEditForm
                key={selectedAddress?._id}
                selectedAddress={selectedAddress}
                onUpdateSuccess={handleUpdateSuccess}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyAddresses;
