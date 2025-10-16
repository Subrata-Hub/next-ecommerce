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
