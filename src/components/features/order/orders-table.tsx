"use client";

import { AutoTableSheet } from "~/components/modular-auto-table/variants/auto-table-sheet";
import { AutoTablePagination } from "~/components/modular-auto-table/auto-table-pagination";
import { useRowsPerPage } from "~/hooks/use-rows-per-page";
import { OrderItemsTable } from "./order-items-table";
import { LoaderCircle } from "lucide-react";
import { usePage } from "~/hooks/use-page";
import {
  orderCreateSchema,
  orderUpdateSchema,
  orderSchema,
} from "~/common/validations/order/order";
import { api } from "~/trpc/react";

export const OrdersTable = () => {
  const [rowsPerPage] = useRowsPerPage();
  const [page] = usePage();

  const getAllOrders = api.order.getAll.useQuery({
    page,
    pageSize: rowsPerPage,
  });
  const createOrder = api.order.createOne.useMutation();
  const deleteOrder = api.order.deleteOne.useMutation();
  const updateOrder = api.order.updateOne.useMutation();
  const getOrderDetails = api.order.getOne.useMutation();

  if (!getAllOrders.data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-between gap-4 overflow-hidden">
      <AutoTableSheet
        title="Orders"
        technicalTableName="orders"
        schema={orderSchema}
        rowIdentifierKey="id"
        data={getAllOrders.data.orders}
        onRefetchData={getAllOrders.refetch}
        onDetails={getOrderDetails.mutateAsync}
        onDelete={deleteOrder.mutateAsync}
        renderDetails={(order) => {
          return (
            <div>
              <OrderItemsTable orderId={order.id} />
            </div>
          );
        }}
        create={{
          formSchema: orderCreateSchema,
          onCreate: createOrder.mutateAsync,
          fieldsConfig: {},
        }}
        update={{
          formSchema: orderUpdateSchema,
          onUpdate: updateOrder.mutateAsync,
          fieldsConfig: {
            id: {
              hidden: true,
            },
          },
        }}
      />

      <AutoTablePagination
        totalPagesCount={getAllOrders.data.totalPagesCount}
      />
    </div>
  );
};
