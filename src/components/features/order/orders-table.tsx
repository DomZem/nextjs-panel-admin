"use client";

import { AutoTableDndTable } from "~/components/auto-table/tables/auto-table-dnd-table";
import { AutoTableFullActions } from "~/components/auto-table/variants/auto-table-full-actions";
import { AutoTablePagination } from "~/components/auto-table/auto-table-pagination";
import { orderFormSchema, orderSchema } from "~/common/validations/order/order";
import { AutoTableDetailsRow } from "~/components/auto-table/auto-table-row";
import { useRowsPerPage } from "~/hooks/pagination/use-rows-per-page";
import { OrderItemsTable } from "./order-items-table";
import { UserCombobox } from "../user/user-combobox";
import { mapDashedFieldName } from "~/utils/mappers";
import {
  AutoTableCloseDetailsButton,
  AutoTableContainer,
  AutoTableCreateButton,
  AutoTableDialogFilters,
  AutoTableHeader,
  AutoTableHeaderContent,
  AutoTableHeaderTitle,
  AutoTableRefreshButton,
  AutoTableSelectColumns,
} from "~/components/auto-table/auto-table-header";
import { type OrderStatus } from "@prisma/client";
import { OrderFilters } from "./order-filters";
import { usePage } from "~/hooks/pagination/use-page";
import { api } from "~/trpc/react";
import { useState } from "react";
import {
  FilterCard,
  FilterCardContent,
  FilterCardTitle,
} from "~/components/ui/filter";

export const OrdersTable = () => {
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "ALL">("ALL");

  const [pageSize] = useRowsPerPage();
  const [page] = usePage();

  const getAllOrders = api.order.getAll.useQuery({
    page,
    pageSize,
    filters: {
      orderId,
      orderStatus: orderStatus === "ALL" ? undefined : orderStatus,
    },
  });
  const createOrder = api.order.createOne.useMutation();
  const deleteOrder = api.order.deleteOne.useMutation();
  const updateOrder = api.order.updateOne.useMutation();

  return (
    <AutoTableContainer>
      <AutoTableFullActions
        schema={orderSchema}
        rowIdentifierKey="id"
        technicalTableName="orders"
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
        onDelete={async (selectedRow) =>
          await deleteOrder.mutateAsync({
            id: selectedRow.id,
          })
        }
        details={{
          variant: "eager",
          renderDetails: (order) => {
            return (
              <div>
                <OrderItemsTable orderId={order.id} />
              </div>
            );
          },
        }}
        autoForm={{
          formSchema: orderFormSchema,
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
          create: {
            onCreate: createOrder.mutateAsync,
            isSubmitting: createOrder.isPending,
          },
          update: {
            onUpdate: updateOrder.mutateAsync,
            isSubmitting: updateOrder.isPending,
          },
        }}
      >
        <AutoTableHeader>
          <AutoTableHeaderTitle>Orders</AutoTableHeaderTitle>
          <AutoTableHeaderContent>
            <AutoTableRefreshButton />
            <AutoTableDialogFilters>
              <OrderFilters
                orderId={orderId}
                setOrderId={setOrderId}
                orderStatus={orderStatus}
                setOrderStatus={setOrderStatus}
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
            <OrderFilters
              orderId={orderId}
              setOrderId={setOrderId}
              orderStatus={orderStatus}
              setOrderStatus={setOrderStatus}
            />
          </FilterCardContent>
        </FilterCard>

        <AutoTableDndTable
          extraRow={(row) => <AutoTableDetailsRow rowId={row.id} />}
        />
      </AutoTableFullActions>

      {getAllOrders.data && (
        <AutoTablePagination
          totalPagesCount={getAllOrders.data.totalPagesCount}
        />
      )}
    </AutoTableContainer>
  );
};
