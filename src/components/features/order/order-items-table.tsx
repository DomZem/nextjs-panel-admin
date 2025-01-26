"use client";

import { AutoTableSheet } from "~/components/modular-auto-table/variants/auto-table-sheet-no-details";
import {
  orderItemCreateSchema,
  orderItemSchema,
  orderItemUpdateSchema,
} from "~/common/validations/order/order-item";
import { LoaderCircle } from "lucide-react";
import { api } from "~/trpc/react";

export const OrderItemsTable = ({ orderId }: { orderId: string }) => {
  const getAllOrderItems = api.orderItem.getAll.useQuery({
    orderId,
  });
  const createOrderItem = api.orderItem.createOne.useMutation();
  const updateOrderItem = api.orderItem.updateOne.useMutation();
  const deleteOrderItem = api.orderItem.deleteOne.useMutation();

  if (!getAllOrderItems.data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-between gap-4 overflow-hidden">
      <AutoTableSheet
        title="Items"
        technicalTableName="order-items"
        schema={orderItemSchema}
        rowIdentifierKey="id"
        omitColumns={{
          order_id: true,
        }}
        data={getAllOrderItems.data}
        onRefetchData={getAllOrderItems.refetch}
        onDelete={deleteOrderItem.mutateAsync}
        create={{
          formSchema: orderItemCreateSchema,
          onCreate: createOrderItem.mutateAsync,
          fieldsConfig: {
            order_id: {
              hidden: true,
            },
          },
          defaultValues: {
            order_id: orderId,
          },
        }}
        update={{
          formSchema: orderItemUpdateSchema,
          onUpdate: updateOrderItem.mutateAsync,
          fieldsConfig: {
            id: {
              hidden: true,
            },
            order_id: {
              hidden: true,
            },
          },
        }}
      />
    </div>
  );
};
