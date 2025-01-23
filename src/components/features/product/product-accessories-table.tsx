"use client";

import { AutoTableSheet } from "~/components/modular-auto-table/variants/auto-table-sheet";
import { DetailsList, DetailsListItem } from "~/components/ui/details-list";
import { LoaderCircle } from "lucide-react";
import { api } from "~/trpc/react";
import {
  productAccessoryFormSchema,
  productAccessoryFormSchemaWithId,
  productAccessorySchema,
} from "~/common/validations/product/product-accessory";

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
  const getProductAccessoryDetails = api.productAccessory.getOne.useMutation();

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
        schema={productAccessorySchema}
        rowIdentifierKey="id"
        data={getAllProductAccessories.data}
        onRefetchData={getAllProductAccessories.refetch}
        onDetails={getProductAccessoryDetails.mutateAsync}
        onDelete={deleteProductAccessory.mutateAsync}
        renderDetails={(product) => {
          return (
            <DetailsList>
              <DetailsListItem name="Name" value={product.name} />
            </DetailsList>
          );
        }}
        create={{
          formSchema: productAccessoryFormSchema,
          onCreate: createProductAccessory.mutateAsync,

          fieldsConfig: {},
        }}
        update={{
          formSchema: productAccessoryFormSchemaWithId,
          onUpdate: updateProductAccessory.mutateAsync,
          fieldsConfig: {
            id: {
              hidden: true,
            },
          },
        }}
      />
    </div>
  );
};
