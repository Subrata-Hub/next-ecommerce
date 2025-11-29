import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const weightsData = [
  { label: "100gm", value: 100 },
  { label: "200gm", value: 200 },
  { label: "300gm", value: 300 },
  { label: "400gm", value: 400 },
  { label: "500gm", value: 500 },
  { label: "600gm", value: 600 },
  { label: "700gm", value: 700 },
  { label: "800gm", value: 800 },
  { label: "900gm", value: 900 },
  { label: "1kg", value: 1000 },
  { label: "1.5kg", value: 1500 },
  { label: "2kg", value: 2000 },
  { label: "2.5kg", value: 2500 },
  { label: "3kg", value: 3000 },
  { label: "3.5kg", value: 3500 },
  { label: "4kg", value: 4000 },
  { label: "4.5kg", value: 4500 },
  { label: "5kg", value: 5000 },
];

export const creams = [
  { label: "Butter", value: "butter" },
  { label: "Fresh", value: "fresh" },
  { label: "Exotic", value: "exotic" },
];

export const flavours = [
  { label: "Butterscotch", value: "butterscotch" },
  { label: "Vanila", value: "vanila" },
  { label: "Chocolate", value: "chocolate" },
  { label: "Strawberry", value: "strawberry" },
  { label: "Coffee Caramel", value: "coffee caramel" },
];

export const dietarys = [
  { label: "Eggles", value: "eggles" },
  { label: "Regular", value: "regular" },
];

export const sortings = [
  { label: "Default Sorting", value: "default_sorting" },
  { label: "Ascending Order", value: "asc" },
  { label: "Descending Order", value: "desc" },
  { label: "Price: Low To High", value: "price_low_high" },
  { label: "Price: High To Low", value: "price_high_low" },
];

export const defaultVariant = [
  { label: "True", value: true },
  { label: "False", value: false },
];

export const coreInfo = [
  {
    header: "Delivery Information",
    info: [
      "Design and icing of cake may vary from the image shown here since each chef has his/her own way of baking and designing a cake.",
      "Your cake will arrive beautifully fresh for your occasion. We recommend that the cake(s) are stored in a cool dry place",
      "We have developed a special Mio Amore packaging so that it reaches you in perfect condition",
      "The chosen delivery time is an estimate and depends on the availability of the product and the destination to which you want the product to be pick up/delivered.",
      "Since cakes are perishable in nature, we attempt delivery of your order only once.",
      "The delivery/pick up cannot be redirected to any other address.",
    ],
  },
  {
    header: "Care Instructions",
    info: [
      "Design and icing of cake may vary from the image shown here since each chef has his/her own way of baking and designing a cake.",
      "Your cake will arrive beautifully fresh for your occasion. We recommend that the cake(s) are stored in a cool dry place",
      "We have developed a special Mio Amore packaging so that it reaches you in perfect condition",
      "The chosen delivery time is an estimate and depends on the availability of the product and the destination to which you want the product to be pick up/delivered.",
      "Since cakes are perishable in nature, we attempt delivery of your order only once.",
      "The delivery/pick up cannot be redirected to any other address.",
    ],
  },
  {
    header: "Manufacture Details",
    info: [
      "Design and icing of cake may vary from the image shown here since each chef has his/her own way of baking and designing a cake.",
      "Your cake will arrive beautifully fresh for your occasion. We recommend that the cake(s) are stored in a cool dry place",
      "We have developed a special Mio Amore packaging so that it reaches you in perfect condition",
      "The chosen delivery time is an estimate and depends on the availability of the product and the destination to which you want the product to be pick up/delivered.",
      "Since cakes are perishable in nature, we attempt delivery of your order only once.",
      "The delivery/pick up cannot be redirected to any other address.",
    ],
  },
];

/// For Address Form

export const addressTtpes = [
  { label: "Residential", value: "residential" },
  { label: "Office", value: "office" },
  { label: "Others", value: "others" },
];

export const orign = [88.37056724, 22.52046694];
