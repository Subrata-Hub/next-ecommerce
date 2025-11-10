import { Chip } from "@mui/material";
import dayjs from "dayjs";
import userIcon from "@/public/assets/images/user.png";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export const DT_CATEGORY_COLUMN = [
  {
    accessorKey: "name",
    header: "Category Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
];

export const DT_PRODUCT_COLUMN = [
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "category",
    header: "Category",
    Cell: ({ cell }) => {
      const categories = cell.getValue();
      if (Array.isArray(categories)) {
        return categories.join(", ");
      }
      return categories;
    },
  },
  {
    accessorKey: "mrp",
    header: "MRP",
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount Percentage",
  },
];

export const DT_PRODUCT_VARIANT_COLUMN = [
  {
    accessorKey: "product",
    header: "Product Name",
  },
  {
    accessorKey: "isDefaultVariant",
    header: "IsDefaultVariant",
    Cell: ({ cell }) => {
      const isDefaultVariants = cell.getValue();
      const isDefaultVariant = String(isDefaultVariants);
      return isDefaultVariant;
    },
  },
  {
    accessorKey: "weight",
    header: "Weight",
    Cell: ({ cell }) => {
      const weights = cell.getValue();

      const formatWeight = (w) => {
        const weight = Number(w);
        if (isNaN(weight)) return w; // fallback if invalid
        return weight >= 1000
          ? `${(weight / 1000).toFixed(2)} kg`
          : `${weight} gm`;
      };

      return Array.isArray(weights)
        ? weights.map(formatWeight).join(", ")
        : formatWeight(weights);
    },
  },
  {
    accessorKey: "cream",
    header: "Cream",
    Cell: ({ cell }) => {
      const creams = cell.getValue();
      if (Array.isArray(creams)) {
        return creams.join(", ");
      }
      return creams;
    },
  },
  {
    accessorKey: "flavour",
    header: "Flavour",
    Cell: ({ cell }) => {
      const flavours = cell.getValue();
      if (Array.isArray(flavours)) {
        return flavours.join(", ");
      }
      return flavours;
    },
  },
  {
    accessorKey: "dietary",
    header: "Dietary",
    Cell: ({ cell }) => {
      const dietarys = cell.getValue();
      if (Array.isArray(dietarys)) {
        return dietarys.join(", ");
      }

      return dietarys;
    },
  },
  {
    accessorKey: "mrp",
    header: "MRP",
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount Percentage",
  },
];

export const DT_COUPON_COLUMN = [
  {
    accessorKey: "code",
    header: "Code Name",
  },

  {
    accessorKey: "minShoppingAmount",
    header: "Min Shopping Amount",
  },
  {
    accessorKey: "discountPercentage",
    header: "discount Percentage",
  },

  {
    accessorKey: "validity",
    header: "Validity",
    Cell: ({ renderedCellValue }) =>
      new Date() > new Date(renderedCellValue) ? (
        <Chip
          color="error"
          label={dayjs(renderedCellValue).format("DD/MM/YY")}
        />
      ) : (
        <Chip
          color="success"
          label={dayjs(renderedCellValue).format("DD/MM/YY")}
        />
      ),
  },
];

export const DT_CUSTOMERS_COLUMN = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    Cell: ({ renderedCellValue }) => (
      <Avatar>
        <AvatarImage src={renderedCellValue?.url || userIcon.src} />
      </Avatar>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "isEmailVerified",
    header: "Is Verified",
    Cell: ({ renderedCellValue }) =>
      renderedCellValue ? (
        <Chip color="success" label="Verified" />
      ) : (
        <Chip color="error" label="Not Verified" />
      ),
  },
];

export const DT_REVIEW_COLUMN = [
  {
    accessorKey: "product",
    header: "Product",
  },

  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "review",
    header: "Review",
  },
];
