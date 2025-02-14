"use client";

import { AutoTableSheetProvider } from "~/components/modular-auto-table/variants/auto-table-sheet";
import { AutoTablePagination } from "~/components/modular-auto-table/auto-table-pagination";
import { UserTransactionsTable } from "./user-transactions-table";
import { UserAddressesTable } from "./user-addresses-table";
import { useRowsPerPage } from "~/hooks/use-rows-per-page";
import {
  AutoTableToolbarHeader,
  AutoTableWithRowDetails,
} from "~/components/modular-auto-table/auto-table";
import { type UserRole } from "@prisma/client";
import { UserFilters } from "./user-filters";
import { usePage } from "~/hooks/use-page";
import {
  userCreateSchema,
  userUpdateSchema,
  userSchema,
} from "~/common/validations/user/user";
import { api } from "~/trpc/react";
import { useState } from "react";

export const UsersTable = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);

  const [pageSize] = useRowsPerPage();
  const [page] = usePage();

  const getAllUsers = api.user.getAll.useQuery({
    page,
    pageSize,
    filters: {
      userName,
      userEmail,
      userRole,
    },
  });
  const deleteUser = api.user.deleteOne.useMutation();
  const createUser = api.user.createOne.useMutation();
  const updateUser = api.user.updateOne.useMutation();
  const getUserDetails = api.user.getOne.useMutation();

  return (
    <div className="flex flex-1 flex-col justify-between gap-4 overflow-hidden">
      <AutoTableSheetProvider
        schema={userSchema}
        rowIdentifierKey="id"
        data={getAllUsers.data?.users ?? []}
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
      >
        <AutoTableToolbarHeader title="Users" technicalTableName="users" />

        <UserFilters
          userName={userName}
          userEmail={userEmail}
          userRole={userRole}
          onUserNameChange={setUserName}
          onUserEmailChange={setUserEmail}
          onUserRoleChange={setUserRole}
        />

        <AutoTableWithRowDetails />
      </AutoTableSheetProvider>

      {getAllUsers.data && (
        <AutoTablePagination
          totalPagesCount={getAllUsers.data.totalPagesCount}
        />
      )}
    </div>
  );
};
