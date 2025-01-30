"use client";

import { AutoTableSheet } from "~/components/modular-auto-table/variants/auto-table-sheet-no-details";
import { AutoTablePagination } from "~/components/modular-auto-table/auto-table-pagination";
import { useRowsPerPage } from "~/hooks/use-rows-per-page";
import {
  AutoTableToolbarHeader,
  AutoTableWithoutRowDetails,
} from "~/components/modular-auto-table/auto-table";
import {
  userTransactionCreateSchema,
  userTransactionSchema,
  userTransactionUpdateSchema,
} from "~/common/validations/user/user-transaction";
import { LoaderCircle } from "lucide-react";
import { usePage } from "~/hooks/use-page";
import { api } from "~/trpc/react";

const queryByPage = "user-transactions-page";
const rowsPerPageKey = "user-trasactions-rows-per-page";

export const UserTransactionsTable = ({ userId }: { userId: string }) => {
  const [rowsPerPage] = useRowsPerPage(rowsPerPageKey);
  const [page] = usePage(queryByPage);

  const getAllUserTransactions = api.userTransaction.getAll.useQuery({
    userId,
    page,
    pageSize: rowsPerPage,
  });
  const createUserTransaction = api.userTransaction.createOne.useMutation();
  const updateUserTransaction = api.userTransaction.updateOne.useMutation();
  const deleteUserTransaction = api.userTransaction.deleteOne.useMutation();

  if (!getAllUserTransactions.data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-between gap-4 overflow-hidden">
      <AutoTableSheet
        schema={userTransactionSchema}
        rowIdentifierKey="id"
        data={getAllUserTransactions.data.userTransactions}
        omitColumns={{
          user_id: true,
        }}
        onRefetchData={getAllUserTransactions.refetch}
        onDelete={deleteUserTransaction.mutateAsync}
        create={{
          formSchema: userTransactionCreateSchema,
          onCreate: createUserTransaction.mutateAsync,
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
          formSchema: userTransactionUpdateSchema,
          onUpdate: updateUserTransaction.mutateAsync,
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
        <AutoTableToolbarHeader
          title="Transactions"
          technicalTableName="user-transactions"
        />
        <AutoTableWithoutRowDetails />
      </AutoTableSheet>

      <AutoTablePagination
        totalPagesCount={getAllUserTransactions.data.totalPagesCount}
        queryByPage={queryByPage}
        queryByRowsPerPage={rowsPerPageKey}
      />
    </div>
  );
};
