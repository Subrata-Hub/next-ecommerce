import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductDetails from "./ProductDetails";

const ProductDetailModal = ({ open, setOpen, product }) => {
  return (
    // FIX 1: Ensure onOpenChange uses the direct value
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        // FIX 2: Refined onInteractOutside to specifically allow popovers like Selects
        onInteractOutside={(e) => {
          const target = e.target;
          // This check is the standard way to prevent a dialog from closing
          // when interacting with a popover (like SelectContent or TooltipContent)
          if (target.closest("[data-radix-popper-content]")) {
            e.preventDefault();
          }
        }}
        className="sm:max-w-[90%] 2xl:max-w-[80%]  h-[calc(100vh-12rem)] mt-36 md:mt-8 md:h-auto 
          md:max-h-[90vh]  overflow-y-scroll px-0  py-15 bg-white border-0 shadow-none z-[50]"
      >
        <DialogDescription className="hidden"></DialogDescription>
        <DialogHeader className="h-1 border-b">
          <DialogTitle className="text-black"></DialogTitle>
        </DialogHeader>
        <ProductDetails
          product={product}
          isQuickView={true}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
