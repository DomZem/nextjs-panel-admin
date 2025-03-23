"use client";

import { AutoTableBasicActions } from "~/components/auto-table/variants/auto-table-basic-actions";
import { AutoTableDndTable } from "~/components/auto-table/tables/auto-table-dnd-table";
import { AutoTablePagination } from "~/components/auto-table/auto-table-pagination";
import { AutoTableToolbarHeader } from "~/components/auto-table/auto-table-header";
import { AutoTableContainer } from "~/components/auto-table/auto-table";
import { useRowsPerPage } from "~/hooks/use-rows-per-page";
import {
  userTransactionCreateSchema,
  userTransactionSchema,
  userTransactionUpdateSchema,
} from "~/common/validations/user/user-transaction";
import { Badge } from "~/components/ui/badge";
import { LoaderCircle } from "lucide-react";
import { usePage } from "~/hooks/use-page";
import { api } from "~/trpc/react";
import Image from "next/image";

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
    <AutoTableContainer>
      <AutoTableBasicActions
        schema={userTransactionSchema}
        rowIdentifierKey="id"
        technicalTableName="user-transactions"
        data={getAllUserTransactions.data.userTransactions}
        omitColumns={{
          user_id: true,
        }}
        columnsMap={{
          amount_cents: (value) => {
            return `$${(value / 100).toFixed(2)}`;
          },
          method: (value) => {
            return value === "BLIK" ? (
              <Image
                src="/assets/blik.png"
                width={40}
                height={40}
                alt="blik method"
              />
            ) : value === "CREDIT_CARD" ? (
              <Image
                src="/assets/visa.png"
                width={40}
                height={40}
                alt="card method"
              />
            ) : (
              <Image
                src="/assets/pay-pal.png"
                width={36}
                height={36}
                alt="pay pal method"
              />
            );
          },
          status: (value) => {
            return (
              <Badge
                variant={
                  value === "PENDING"
                    ? "outline"
                    : value === "SUCCESS"
                      ? "success"
                      : "destructive"
                }
              >
                {value === "PENDING"
                  ? "Pending"
                  : value === "SUCCESS"
                    ? "Success"
                    : "Failed"}
              </Badge>
            );
          },
        }}
        onRefetchData={getAllUserTransactions.refetch}
        onDelete={async (row) =>
          await deleteUserTransaction.mutateAsync({ id: row.id })
        }
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
        <AutoTableToolbarHeader title="Transactions" />
        <AutoTableDndTable />
      </AutoTableBasicActions>

      <AutoTablePagination
        totalPagesCount={getAllUserTransactions.data.totalPagesCount}
        queryByPage={queryByPage}
        queryByRowsPerPage={rowsPerPageKey}
      />
    </AutoTableContainer>
  );
};
