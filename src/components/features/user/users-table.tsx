"use client";

import { AutoTableDndTable } from "~/components/auto-table/tables/auto-table-dnd-table";
import { AutoTablePrimary } from "~/components/auto-table/variants/auto-table-primary";
import { AutoTablePagination } from "~/components/auto-table/auto-table-pagination";
import { AutoTableToolbarHeader } from "~/components/auto-table/auto-table-header";
import { AutoTableDetailsRow } from "~/components/auto-table/auto-table";
import { UserTransactionsTable } from "./user-transactions-table";
import { UserAddressesTable } from "./user-addresses-table";
import { useRowsPerPage } from "~/hooks/use-rows-per-page";
import { Badge } from "~/components/ui/badge";
import { usePage } from "~/hooks/use-page";
import { UserRole } from "@prisma/client";
import {
  userCreateSchema,
  userUpdateSchema,
  userSchema,
} from "~/common/validations/user/user";
import { api } from "~/trpc/react";
import { useState } from "react";
import {
  enumToSelectOptions,
  FilterCard,
  FilterCardItemString,
  FilterCardItemSelect,
} from "~/components/ui/filter";
import Image from "next/image";

export const UsersTable = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<UserRole | "ALL">("ALL");

  const [pageSize] = useRowsPerPage();
  const [page] = usePage();

  const getAllUsers = api.user.getAll.useQuery({
    page,
    pageSize,
    filters: {
      userName,
      userEmail,
      userRole: userRole === "ALL" ? undefined : userRole,
    },
  });
  const deleteUser = api.user.deleteOne.useMutation();
  const createUser = api.user.createOne.useMutation();
  const updateUser = api.user.updateOne.useMutation();
  const getUserDetails = api.user.getOne.useMutation();

  return (
    <div className="flex flex-1 flex-col justify-between gap-4 overflow-hidden">
      <AutoTablePrimary
        technicalTableName="users"
        schema={userSchema}
        rowIdentifierKey="id"
        columnsMap={{
          image: (value) => {
            if (!value) return "no image";
            return (
              <Image
                className="rounded-full"
                src={value}
                width={32}
                height={32}
                alt="user profile"
              />
            );
          },
          emailVerified: (value) => {
            return (
              <Badge variant={value ? "success" : "destructive"}>
                {value ? "Verified" : "Not verified"}
              </Badge>
            );
          },
        }}
        data={getAllUsers.data?.users ?? []}
        onRefetchData={getAllUsers.refetch}
        onDetails={async (row) =>
          await getUserDetails.mutateAsync({
            id: row.id,
          })
        }
        onDelete={async (row) => await deleteUser.mutateAsync({ id: row.id })}
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
        <AutoTableToolbarHeader title="Users" />

        <FilterCard>
          <FilterCardItemString
            label="name"
            placeholder="Search by user name"
            value={userName}
            onValueChange={setUserName}
          />
          <FilterCardItemString
            label="email"
            placeholder="Search by user email"
            value={userEmail}
            onValueChange={setUserEmail}
          />
          <FilterCardItemSelect
            label="role"
            placeholder="Search by user role"
            value={userRole}
            options={enumToSelectOptions(UserRole)}
            onValueChange={setUserRole}
          />
        </FilterCard>

        <AutoTableDndTable
          extraRow={(row) => <AutoTableDetailsRow rowId={row.id} />}
        />
      </AutoTablePrimary>

      {getAllUsers.data && (
        <AutoTablePagination
          totalPagesCount={getAllUsers.data.totalPagesCount}
        />
      )}
    </div>
  );
};
