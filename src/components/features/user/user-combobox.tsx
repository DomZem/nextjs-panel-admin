import { FormItem, FormLabel } from "~/components/ui/form";
import { Combobox } from "~/components/ui/combobox";
import { api } from "~/trpc/react";
import { useState } from "react";

export const UserCombobox = ({
  selectedValue,
  onSelect,
}: {
  selectedValue?: string;
  onSelect: (value: string) => void;
}) => {
  const [searchValue, setSearchValue] = useState("");

  const getSearchUsers = api.user.getSearchUsers.useQuery({
    name: searchValue,
  });

  const userOptions =
    getSearchUsers.data?.map((user) => ({
      value: user.id,
      label: user.name ?? "",
    })) ?? [];

  return (
    <FormItem>
      <FormLabel>user</FormLabel>
      <Combobox
        options={userOptions}
        onInputChange={setSearchValue}
        onSelect={onSelect}
        selectedValue={selectedValue}
        emptyPlaceholder="No user found."
        searchPlaceholder="Search user..."
        selectPlaceholder="Select user..."
      />
    </FormItem>
  );
};
