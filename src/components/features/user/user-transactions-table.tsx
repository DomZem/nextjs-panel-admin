"use client";

import { AutoTableSheet } from "~/components/modular-auto-table/variants/auto-table-sheet-no-details";
import { useRowsPerPage } from "~/hooks/use-rows-per-page";
import {
  userTransactionCreateSchema,
  userTransactionSchema,
  userTransactionUpdateSchema,
} from "~/common/validations/user/user-transaction";
import { LoaderCircle } from "lucide-react";
import { usePage } from "~/hooks/use-page";
import { api } from "~/trpc/react";
import { AutoTablePagination } from "~/components/modular-auto-table/auto-table-pagination";

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
        title="Transactions"
        technicalTableName="user-transactions"
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
      />

      <AutoTablePagination
        totalPagesCount={getAllUserTransactions.data.totalPagesCount}
        queryByPage={queryByPage}
        queryByRowsPerPage={rowsPerPageKey}
      />
    </div>
  );
};
