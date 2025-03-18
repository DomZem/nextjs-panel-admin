import { FormItem, FormLabel } from "~/components/ui/form";
import { Combobox } from "~/components/ui/combobox";
import { api } from "~/trpc/react";
import { useState } from "react";

export const RegionCountryCombobox = ({
  selectedValue,
  onSelect,
}: {
  selectedValue?: string | number;
  onSelect: (value: string) => void;
}) => {
  const [searchValue, setSearchValue] = useState("");

  const getSearchCountries = api.regionCountry.getSearchCountries.useQuery({
    name: searchValue,
  });

  const countryOptions =
    getSearchCountries.data?.map((country) => ({
      value: country.id.toString(),
      label: country.name ?? "",
    })) ?? [];

  return (
    <FormItem>
      <FormLabel>Country</FormLabel>
      <Combobox
        options={countryOptions}
        onInputChange={setSearchValue}
        onSelect={onSelect}
        selectedValue={selectedValue}
        emptyPlaceholder="No country found."
        searchPlaceholder="Search country..."
        selectPlaceholder="Select country..."
      />
    </FormItem>
  );
};
