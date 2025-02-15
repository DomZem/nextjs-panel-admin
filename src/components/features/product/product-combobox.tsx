import { FormItem, FormLabel } from "~/components/ui/form";
import { Combobox } from "~/components/ui/combobox";
import { api } from "~/trpc/react";
import { useState } from "react";

export const ProductCombobox = ({
  selectedValue,
  onSelect,
}: {
  selectedValue?: string;
  onSelect: (value: string) => void;
}) => {
  const [searchValue, setSearchValue] = useState("");

  const getSearchProducts = api.product.getSearchProducts.useQuery({
    name: searchValue,
    id: selectedValue,
  });

  const productOptions =
    getSearchProducts.data?.map((product) => ({
      value: product.id,
      label: product.name ?? "",
    })) ?? [];

  return (
    <FormItem>
      <FormLabel>product</FormLabel>
      <Combobox
        options={productOptions}
        onInputChange={setSearchValue}
        onSelect={onSelect}
        selectedValue={selectedValue}
        emptyPlaceholder="No product found."
        searchPlaceholder="Search product..."
        selectPlaceholder="Select product..."
      />
    </FormItem>
  );
};
