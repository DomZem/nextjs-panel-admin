"use client";

import { AutoTablePagination } from "~/components/modular-auto-table/auto-table-pagination";
import { AutoTableSheet } from "~/components/modular-auto-table/variants/auto-table-sheet";
import { UserTransactionsTable } from "./user-transactions-table";
import { UserAddressesTable } from "./user-addresses-table";
import { useRowsPerPage } from "~/hooks/use-rows-per-page";
import { LoaderCircle } from "lucide-react";
import { usePage } from "~/hooks/use-page";
import {
  userCreateSchema,
  userUpdateSchema,
  userSchema,
} from "~/common/validations/user/user";
import { api } from "~/trpc/react";

export const UsersTable = () => {
  const [rowsPerPage] = useRowsPerPage();
  const [page] = usePage();

  const getAllUsers = api.user.getAll.useQuery({
    page,
    pageSize: rowsPerPage,
  });
  const deleteUser = api.user.deleteOne.useMutation();
  const createUser = api.user.createOne.useMutation();
  const updateUser = api.user.updateOne.useMutation();
  const getUserDetails = api.user.getOne.useMutation();

  if (!getAllUsers.data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-between gap-4 overflow-hidden">
      <AutoTableSheet
        title="Users"
        technicalTableName="users"
        schema={userSchema}
        rowIdentifierKey="id"
        data={getAllUsers.data.users}
        onRefetchData={getAllUsers.refetch}
        onDetails={getUserDetails.mutateAsync}
        onDelete={deleteUser.mutateAsync}
        renderDetails={(user) => {
          return (
            <div className="space-y-4">
              <UserAddressesTable userId={user.id} />
              <UserTransactionsTable userId={user.id} />
            </div>
          );
        }}
        create={{
          formSchema: userCreateSchema,
          onCreate: createUser.mutateAsync,
          fieldsConfig: {
            image: {
              type: "image",
            },
          },
        }}
        update={{
          formSchema: userUpdateSchema,
          onUpdate: updateUser.mutateAsync,
          fieldsConfig: {
            id: {
              hidden: true,
            },
            image: {
              type: "image",
            },
          },
        }}
      />

      <AutoTablePagination totalPagesCount={getAllUsers.data.totalPagesCount} />
    </div>
  );
};
