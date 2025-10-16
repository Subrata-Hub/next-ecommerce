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
