"use client";

import { AutoTablePagination } from "~/components/auto-table/auto-table-pagination";
import { AutoTableProvider } from "~/components/auto-table/auto-table-context";
import { userFormSchema, userSchema } from "~/common/validations/user";
import {
  DataTable,
  DataTableHeader,
  DataTableSelectColumns,
} from "~/components/ui/data-table";
import { useRowsPerPage } from "~/hooks/use-rows-per-page";
import { mapDashedFieldName } from "~/utils/mappers";
import {
  AutoTableCloseDetailsButton,
  AutoTableCreateButton,
  AutoTableHeader,
  AutoTableHeaderTitle,
  AutoTableRefreshButton,
} from "~/components/auto-table/auto-table-header";
import { LoaderCircle } from "lucide-react";
import { usePage } from "~/hooks/use-page";
import { api } from "~/trpc/react";
import {
  AutoTableActionsColumn,
  AutoTableBody,
  AutoTableDetailsRow,
  AutoTableSortDataProvider,
} from "~/components/auto-table/auto-table";
import { AutoTableDeleteDialog } from "~/components/auto-table/auto-table-delete-dialog";
import { AutoTableSheetForms } from "~/components/auto-table/auto-table-form";
import { DetailsList, DetailsListItem } from "~/components/ui/details-list";
import { ScrollArea } from "~/components/ui/scroll-area";

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
      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        <AutoTableProvider
          schema={userSchema}
          rowIdentifierKey="id"
          formSchema={userFormSchema}
          onRefetchData={getAllUsers.refetch}
          onDelete={deleteUser.mutateAsync}
          onCreate={createUser.mutateAsync}
          onUpdate={updateUser.mutateAsync}
          onDetails={getUserDetails.mutateAsync}
          detailsContent={(user) => {
            return (
              <DetailsList>
                <DetailsListItem name="Name" value={user.name} />
                <DetailsListItem name="Email" value={user.email} />
              </DetailsList>
            );
          }}
        >
          <AutoTableSortDataProvider
            schema={userSchema}
            data={getAllUsers.data.users}
            omitColumns={{
              image: true,
            }}
            extraColumns={[
              {
                header: "actions",
                cell: ({ row }) => (
                  <AutoTableActionsColumn row={row.original} />
                ),
              },
            ]}
          >
            <AutoTableHeader>
              <AutoTableHeaderTitle>Users</AutoTableHeaderTitle>
              <div className="inline-flex items-center gap-3">
                <AutoTableRefreshButton />
                <DataTableSelectColumns mapColumnName={mapDashedFieldName} />
                <AutoTableCloseDetailsButton />
                <AutoTableCreateButton />
              </div>
            </AutoTableHeader>

            <ScrollArea className="flex-1">
              <DataTable>
                <DataTableHeader />
                <AutoTableBody
                  extraRow={(row) => (
                    <AutoTableDetailsRow rowId={row.original.id} />
                  )}
                />
              </DataTable>
            </ScrollArea>
          </AutoTableSortDataProvider>

          <AutoTableSheetForms<typeof userSchema>
            fieldsConfig={{
              image: {
                type: "image",
              },
            }}
          />
          <AutoTableDeleteDialog />
        </AutoTableProvider>
      </div>

      <AutoTablePagination totalPagesCount={getAllUsers.data.totalPagesCount} />
    </div>
  );
};
