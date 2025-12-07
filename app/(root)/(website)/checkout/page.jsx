import Checkout from "@/components/application/website/Checkout";
import axios from "axios";

const page = () => {
  return (
    <div className="px-4 md:px-4 lg:px-6 xl:px-15 2xl:px-40 mt-6">
      <Checkout />
    </div>
  );
};

export default page;
