"use client";

import { AutoTableDndTable } from "~/components/auto-table/tables/auto-table-dnd-table";
import { AutoTablePrimary } from "~/components/auto-table/variants/auto-table-primary";
import { AutoTablePagination } from "~/components/auto-table/auto-table-pagination";
import { AutoTableToolbarHeader } from "~/components/auto-table/auto-table-header";
import { AutoTableDetailsRow } from "~/components/auto-table/auto-table";
import { useRowsPerPage } from "~/hooks/use-rows-per-page";
import { OrderItemsTable } from "./order-items-table";
import { UserCombobox } from "../user/user-combobox";
import { type OrderStatus } from "@prisma/client";
import { OrderFilters } from "./order-filters";
import { usePage } from "~/hooks/use-page";
import {
  orderCreateSchema,
  orderUpdateSchema,
  orderSchema,
} from "~/common/validations/order/order";
import { api } from "~/trpc/react";
import { useState } from "react";

export const OrdersTable = () => {
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | undefined>(
    undefined,
  );

  const [pageSize] = useRowsPerPage();
  const [page] = usePage();

  const getAllOrders = api.order.getAll.useQuery({
    page,
    pageSize,
    filters: {
      orderId,
      orderStatus,
    },
  });
  const createOrder = api.order.createOne.useMutation();
  const deleteOrder = api.order.deleteOne.useMutation();
  const updateOrder = api.order.updateOne.useMutation();
  const getOrderDetails = api.order.getOne.useMutation();

  return (
    <div className="flex flex-1 flex-col justify-between gap-4 overflow-hidden">
      <AutoTablePrimary
        schema={orderSchema}
        rowIdentifierKey="id"
        omitColumns={{
          user_id: true,
        }}
        columnsMap={{
          total_cents: (value) => {
            return `$${value / 100}`;
          },
        }}
        data={getAllOrders.data?.orders ?? []}
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
          fieldsConfig: {
            user_id: {
              type: "custom",
              render: ({ field }) => {
                return (
                  <UserCombobox
                    selectedValue={field.value}
                    onSelect={field.onChange}
                  />
                );
              },
            },
          },
        }}
        update={{
          formSchema: orderUpdateSchema,
          onUpdate: updateOrder.mutateAsync,
          fieldsConfig: {
            id: {
              hidden: true,
            },
            user_id: {
              type: "custom",
              render: ({ field }) => {
                return (
                  <UserCombobox
                    selectedValue={field.value}
                    onSelect={field.onChange}
                  />
                );
              },
            },
          },
        }}
      >
        <AutoTableToolbarHeader title="Orders" technicalTableName="orders" />

        <OrderFilters
          orderId={orderId}
          onOrderIdChange={setOrderId}
          orderStatus={orderStatus}
          onOrderStatusChange={setOrderStatus}
        />

        <AutoTableDndTable
          extraRow={(row) => <AutoTableDetailsRow rowId={row.id} />}
        />
      </AutoTablePrimary>

      {getAllOrders.data && (
        <AutoTablePagination
          totalPagesCount={getAllOrders.data.totalPagesCount}
        />
      )}
    </div>
  );
};
