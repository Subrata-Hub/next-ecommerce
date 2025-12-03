import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { setShowAddressForm } from "@/store/slices/settingSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AddressForm from "./AddressForm";

const AddressModal = ({
  showAddressForm,
  setRefetchAddres,
  setSelectedAddress,
  setShowSelectedAddress,
  refetch,
}) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.authStore.auth);

  // if (addressLoading) {
  //   // showToast("error", "Please wait, loading your details...");
  //   return;
  // }
  return (
    <div className="">
      <Dialog
        open={showAddressForm}
        onOpenChange={() => dispatch(setShowAddressForm(false))}
      >
        <DialogContent className="sm:max-w-[45%] h-screen mt-10 px-6 border-0 shadow-none overflow-visible">
          <div className="h-[90vh]">
            <DialogHeader className="h-8 border-b">
              <DialogTitle>Add Address</DialogTitle>
              <DialogDescription className="hidden"></DialogDescription>
            </DialogHeader>
            <div className="h-[calc(100%-10px)] py-2">
              <AddressForm
                setRefetchAddres={setRefetchAddres}
                setSelectedAddress={setSelectedAddress}
                setShowSelectedAddress={setShowSelectedAddress}
                refetch={refetch}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressModal;
