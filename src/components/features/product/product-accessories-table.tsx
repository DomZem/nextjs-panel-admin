"use client";

import { AutoTableSheet } from "~/components/modular-auto-table/variants/auto-table-sheet-no-details";
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
    <div className="flex flex-1 flex-col justify-between gap-4 overflow-hidden">
      <AutoTableSheet
        title="Accessories"
        technicalTableName="product-accessories"
        schema={productAccessorySchema}
        rowIdentifierKey="id"
        data={getAllProductAccessories.data}
        onRefetchData={getAllProductAccessories.refetch}
        omitColumns={{
          product_id: true,
        }}
        onDelete={deleteProductAccessory.mutateAsync}
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
      />
    </div>
  );
};
