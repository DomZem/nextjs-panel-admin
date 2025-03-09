import { ProductCategory } from "@prisma/client";
import {
  enumToSelectOptions,
  FilterCardItemSelect,
  FilterCardItemString,
} from "~/components/ui/filter";

export const ProductFilters = ({
  productName,
  setProductName,
  productCategory,
  setProductCategory,
}: {
  productName: string;
  setProductName: (value: string) => void;
  productCategory: ProductCategory | "ALL";
  setProductCategory: (value: ProductCategory | "ALL") => void;
}) => {
  return (
    <>
      <FilterCardItemString
        label="name"
        placeholder="Search by product name"
        value={productName}
        onValueChange={setProductName}
      />
      <FilterCardItemSelect
        label="category"
        placeholder="Search by product category"
        value={productCategory}
        options={enumToSelectOptions(ProductCategory)}
        onValueChange={setProductCategory}
      />
    </>
  );
};
