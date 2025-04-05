"use client";

import { AutoTableBasicActions } from "~/components/auto-table/variants/auto-table-basic-actions";
import { AutoTableDndTable } from "~/components/auto-table/tables/auto-table-dnd-table";
import {
  productAccessoryFormSchema,
  productAccessorySchema,
} from "~/common/validations/product/product-accessory";
import {
  AutoTableContainer,
  AutoTableToolbarHeader,
} from "~/components/auto-table/auto-table-header";
import { LoaderCircle } from "lucide-react";
import { api } from "~/trpc/react";

export const ProductAccessoriesTable = ({
  productId,
}: {
  productId: string;
}) => {
  const getAllProductAccessories = api.productAccessory.getAll.useQuery({
    productId,
  });
  const createProductAccessory = api.productAccessory.createOne.useMutation();
  const updateProductAccessory = api.productAccessory.updateOne.useMutation();
  const deleteProductAccessory = api.productAccessory.deleteOne.useMutation();

  if (!getAllProductAccessories.data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <AutoTableContainer>
      <AutoTableBasicActions
        schema={productAccessorySchema}
        rowIdentifierKey="id"
        technicalTableName="product-accessories"
        data={getAllProductAccessories.data}
        onRefetchData={getAllProductAccessories.refetch}
        omitColumns={{
          product_id: true,
        }}
        onDelete={async (selectedRow) => {
          await deleteProductAccessory.mutateAsync({
            id: selectedRow.id,
          });
        }}
        autoForm={{
          formSchema: productAccessoryFormSchema,
          fieldsConfig: {
            id: {
              hidden: true,
            },
            product_id: {
              hidden: true,
            },
          },
          create: {
            onCreate: createProductAccessory.mutateAsync,
            isSubmitting: createProductAccessory.isPending,
            defaultValues: {
              product_id: productId,
            },
          },
          update: {
            onUpdate: updateProductAccessory.mutateAsync,
            isSubmitting: updateProductAccessory.isPending,
          },
        }}
      >
        <AutoTableToolbarHeader title="Accessories" />
        <AutoTableDndTable />
      </AutoTableBasicActions>
    </AutoTableContainer>
  );
};
