"use client";

import { AutoTableSheet } from "~/components/modular-auto-table/variants/auto-table-sheet-no-details";
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
    <div className="flex flex-1 flex-col justify-between gap-4 overflow-hidden">
      <AutoTableSheet
        title="Addresses"
        schema={userAddressSchema}
        rowIdentifierKey="id"
        data={getAllUserAddresses.data}
        omitColumns={{
          user_id: true,
        }}
        onRefetchData={getAllUserAddresses.refetch}
        onDelete={deleteUserAddress.mutateAsync}
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
      />
    </div>
  );
};
