import { useDebouncedState } from "~/hooks/use-debounced-state";
import { type ProductCategory } from "@prisma/client";
import { FilterCard } from "~/components/ui/filter";
import { FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const ProductFilters = ({
  productName,
  onProductNameChange,
  productCategory,
  onProductCategoryChange,
}: {
  productName: string;
  onProductNameChange: (orderId: string) => void;
  productCategory?: ProductCategory;
  onProductCategoryChange: (productCategory?: ProductCategory) => void;
}) => {
  const { value, setValue } = useDebouncedState(
    productName,
    1000,
    onProductNameChange,
  );

  return (
    <FilterCard className="">
      <FormItem className="">
        <Label>name</Label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search by product name"
        />
      </FormItem>
      <FormItem>
        <Label>category</Label>
        <Select
          value={productCategory}
          onValueChange={(value) => onProductCategoryChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Search by product category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EARPHONES">earphones</SelectItem>
            <SelectItem value="HEADPHONES">Headphones</SelectItem>
            <SelectItem value="SPEAKERS">Speakers</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>
    </FilterCard>
  );
};
