"use client";

import { AutoTableBasicActions } from "~/components/auto-table/variants/auto-table-basic-actions";
import { AutoTableDndTable } from "~/components/auto-table/tables/auto-table-dnd-table";
import { AutoTableToolbarHeader } from "~/components/auto-table/auto-table-header";
import { AutoTableContainer } from "~/components/auto-table/auto-table";
import {
  productAccessoryCreateSchema,
  productAccessoryUpdateSchema,
  productAccessorySchema,
} from "~/common/validations/product/product-accessory";
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
        create={{
          formSchema: productAccessoryCreateSchema,
          onCreate: createProductAccessory.mutateAsync,
          defaultValues: {
            product_id: productId,
          },
          fieldsConfig: {
            product_id: {
              hidden: true,
            },
          },
        }}
        update={{
          formSchema: productAccessoryUpdateSchema,
          onUpdate: updateProductAccessory.mutateAsync,
          fieldsConfig: {
            id: {
              hidden: true,
            },
            product_id: {
              hidden: true,
            },
          },
        }}
      >
        <AutoTableToolbarHeader title="Accessories" />
        <AutoTableDndTable />
      </AutoTableBasicActions>
    </AutoTableContainer>
  );
};
