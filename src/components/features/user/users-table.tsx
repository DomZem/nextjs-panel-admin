"use client";

import { AutoTableRedirectDetails } from "~/components/auto-table/variants/auto-table-redirect-details";
import { AutoTableDndTable } from "~/components/auto-table/tables/auto-table-dnd-table";
import { AutoTablePagination } from "~/components/auto-table/auto-table-pagination";
import { useRowsPerPage } from "~/hooks/use-rows-per-page";
import { mapDashedFieldName } from "~/utils/mappers";
import {
  AutoTableCloseDetailsButton,
  AutoTableCreateButton,
  AutoTableDialogFilters,
  AutoTableHeader,
  AutoTableHeaderContent,
  AutoTableHeaderTitle,
  AutoTableRefreshButton,
  AutoTableSelectColumns,
} from "~/components/auto-table/auto-table-header";
import { type UserRole } from "@prisma/client";
import { Badge } from "~/components/ui/badge";
import { UserFilters } from "./user-filters";
import { AutoTableContainer } from "~/components/auto-table/auto-table";
import { usePage } from "~/hooks/use-page";
import {
  userCreateSchema,
  userUpdateSchema,
  userSchema,
} from "~/common/validations/user/user";
import { api } from "~/trpc/react";
import { useState } from "react";
import {
  FilterCard,
  FilterCardTitle,
  FilterCardContent,
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

  return (
    <AutoTableContainer>
      <AutoTableRedirectDetails
        detailsHref={(row) => `users/${row.id}`}
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
        onDelete={async (row) => await deleteUser.mutateAsync({ id: row.id })}
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
        <AutoTableHeader>
          <AutoTableHeaderTitle>Users</AutoTableHeaderTitle>
          <AutoTableHeaderContent>
            <AutoTableRefreshButton />
            <AutoTableDialogFilters>
              <UserFilters
                userName={userName}
                setUserName={setUserName}
                userEmail={userEmail}
                setUserEmail={setUserEmail}
                userRole={userRole}
                setUserRole={setUserRole}
              />
            </AutoTableDialogFilters>
            <AutoTableSelectColumns mapColumnName={mapDashedFieldName} />
            <AutoTableCloseDetailsButton />
            <AutoTableCreateButton />
          </AutoTableHeaderContent>
        </AutoTableHeader>

        <FilterCard className="hidden lg:grid">
          <FilterCardTitle />
          <FilterCardContent>
            <UserFilters
              userName={userName}
              setUserName={setUserName}
              userEmail={userEmail}
              setUserEmail={setUserEmail}
              userRole={userRole}
              setUserRole={setUserRole}
            />
          </FilterCardContent>
        </FilterCard>

        <AutoTableDndTable />
      </AutoTableRedirectDetails>

      {getAllUsers.data && (
        <AutoTablePagination
          totalPagesCount={getAllUsers.data.totalPagesCount}
        />
      )}
    </AutoTableContainer>
  );
};
