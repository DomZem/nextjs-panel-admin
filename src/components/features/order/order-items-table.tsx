"use client";

import { AutoTableBasicActions } from "~/components/auto-table/variants/auto-table-basic-actions";
import { AutoTableDndTable } from "~/components/auto-table/tables/auto-table-dnd-table";
import { AutoTableToolbarHeader } from "~/components/auto-table/auto-table-header";
import { AutoTableContainer } from "~/components/auto-table/auto-table-header";
import { ProductCombobox } from "../product/product-combobox";
import {
  orderItemSchema,
  orderItemFormSchema,
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
    <AutoTableContainer>
      <AutoTableBasicActions
        schema={orderItemSchema}
        rowIdentifierKey="id"
        technicalTableName="order-items"
        omitColumns={{
          order_id: true,
        }}
        data={getAllOrderItems.data}
        onRefetchData={getAllOrderItems.refetch}
        onDelete={async (selectedRow) =>
          await deleteOrderItem.mutateAsync({
            id: selectedRow.id,
          })
        }
        autoForm={{
          formSchema: orderItemFormSchema,
          fieldsConfig: {
            id: {
              hidden: true,
            },
            order_id: {
              hidden: true,
            },
            product_id: {
              type: "custom",
              render: ({ field }) => {
                return (
                  <ProductCombobox
                    selectedValue={field.value}
                    onSelect={field.onChange}
                  />
                );
              },
            },
          },
          create: {
            onCreate: createOrderItem.mutateAsync,
            isSubmitting: createOrderItem.isPending,
            defaultValues: {
              order_id: orderId,
            },
          },
          update: {
            onUpdate: updateOrderItem.mutateAsync,
            isSubmitting: updateOrderItem.isPending,
          },
        }}
      >
        <AutoTableToolbarHeader title="Items" />
        <AutoTableDndTable />
      </AutoTableBasicActions>
    </AutoTableContainer>
  );
};
