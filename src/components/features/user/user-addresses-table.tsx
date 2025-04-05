"use client";

import { AutoTableBasicActions } from "~/components/auto-table/variants/auto-table-basic-actions";
import { AutoTableDndTable } from "~/components/auto-table/tables/auto-table-dnd-table";
import { RegionCountryCombobox } from "../region/region-country-combobox";
import {
  AutoTableContainer,
  AutoTableToolbarHeader,
} from "~/components/auto-table/auto-table-header";
import {
  userAddressFormSchema,
  userAddressSchema,
} from "~/common/validations/user/user-address";
import { LoaderCircle } from "lucide-react";
import { api } from "~/trpc/react";

export const UserAddressesTable = ({ userId }: { userId: string }) => {
  const getAllUserAddresses = api.userAddress.getAll.useQuery({
    userId,
  });
  const createUserAddress = api.userAddress.createOne.useMutation();
  const updateUserAddress = api.userAddress.updateOne.useMutation();
  const deleteUserAddress = api.userAddress.deleteOne.useMutation();

  if (!getAllUserAddresses.data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <AutoTableContainer>
      <AutoTableBasicActions
        technicalTableName="user-addresses"
        schema={userAddressSchema}
        rowIdentifierKey="id"
        data={getAllUserAddresses.data}
        omitColumns={{
          user_id: true,
        }}
        onRefetchData={getAllUserAddresses.refetch}
        onDelete={async (selectedRow) =>
          await deleteUserAddress.mutateAsync({
            id: selectedRow.id,
          })
        }
        autoForm={{
          formSchema: userAddressFormSchema,
          fieldsConfig: {
            id: {
              hidden: true,
            },
            user_id: {
              hidden: true,
            },
            region_country_id: {
              type: "custom",
              render: ({ field }) => {
                return (
                  <RegionCountryCombobox
                    selectedValue={field.value}
                    onSelect={field.onChange}
                  />
                );
              },
            },
          },
          create: {
            onCreate: createUserAddress.mutateAsync,
            isSubmitting: createUserAddress.isPending,
            defaultValues: {
              user_id: userId,
            },
          },
          update: {
            onUpdate: updateUserAddress.mutateAsync,
            isSubmitting: updateUserAddress.isPending,
          },
        }}
      >
        <AutoTableToolbarHeader title="Addresses" />

        <AutoTableDndTable />
      </AutoTableBasicActions>
    </AutoTableContainer>
  );
};
