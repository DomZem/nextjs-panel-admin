"use client";

import { AutoTableSecondary } from "~/components/auto-table/variants/auto-table-secondary";
import { AutoTableDndTable } from "~/components/auto-table/tables/auto-table-dnd-table";
import { AutoTableToolbarHeader } from "~/components/auto-table/auto-table-header";
import { AutoTableContainer } from "~/components/auto-table/auto-table";
import {
  userAddressCreateSchema,
  userAddressSchema,
  userAddressUpdateSchema,
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
      <AutoTableSecondary
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
        create={{
          formSchema: userAddressCreateSchema,
          onCreate: createUserAddress.mutateAsync,
          fieldsConfig: {
            user_id: {
              hidden: true,
            },
          },
          defaultValues: {
            user_id: userId,
          },
        }}
        update={{
          formSchema: userAddressUpdateSchema,
          onUpdate: updateUserAddress.mutateAsync,
          fieldsConfig: {
            id: {
              hidden: true,
            },
            user_id: {
              hidden: true,
            },
          },
        }}
      >
        <AutoTableToolbarHeader title="Addresses" />

        <AutoTableDndTable />
      </AutoTableSecondary>
    </AutoTableContainer>
  );
};
