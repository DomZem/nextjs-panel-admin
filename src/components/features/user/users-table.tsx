"use client";

import { AutoTableSheet } from "~/components/modular-auto-table/variants/auto-table-sheet";
import { AutoTablePagination } from "~/components/modular-auto-table/auto-table-pagination";
import { DetailsList, DetailsListItem } from "~/components/ui/details-list";
import { useRowsPerPage } from "~/hooks/use-rows-per-page";
import { LoaderCircle } from "lucide-react";
import { usePage } from "~/hooks/use-page";
import {
  userFormSchema,
  userFormSchemaWithId,
  userSchema,
} from "~/common/validations/user";
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
        schema={userSchema}
        rowIdentifierKey="id"
        data={getAllUsers.data.users}
        onRefetchData={getAllUsers.refetch}
        onDetails={getUserDetails.mutateAsync}
        onDelete={deleteUser.mutateAsync}
        renderDetails={(user) => {
          return (
            <DetailsList>
              <DetailsListItem name="Name" value={user.name} />
              <DetailsListItem name="Name" value={user.name} />
              <DetailsListItem name="Name" value={user.name} />
              <DetailsListItem name="Name" value={user.name} />
              <DetailsListItem name="Name" value={user.name} />
              <DetailsListItem name="Name" value={user.name} />
              <DetailsListItem name="Name" value={user.name} />
            </DetailsList>
          );
        }}
        create={{
          formSchema: userFormSchema,
          onCreate: createUser.mutateAsync,
          fieldsConfig: {
            image: {
              type: "image",
            },
          },
        }}
        update={{
          formSchema: userFormSchemaWithId,
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
