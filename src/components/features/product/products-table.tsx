"use client";

import { AutoTableSheet } from "~/components/modular-auto-table/variants/auto-table-sheet";
import { AutoTablePagination } from "~/components/modular-auto-table/auto-table-pagination";
import { ProductAccessoriesTable } from "./product-accessories-table";
import { useRowsPerPage } from "~/hooks/use-rows-per-page";
import {
  productCreateSchema,
  productUpdateSchema,
  productSchema,
} from "~/common/validations/product/product";
import { LoaderCircle } from "lucide-react";
import { usePage } from "~/hooks/use-page";
import { api } from "~/trpc/react";

export const ProductsTable = () => {
  const [rowsPerPage] = useRowsPerPage();
  const [page] = usePage();

  const getAllProducts = api.product.getAll.useQuery({
    page,
    pageSize: rowsPerPage,
  });
  const deleteProduct = api.product.deleteOne.useMutation();
  const createProduct = api.product.createOne.useMutation();
  const updateProduct = api.product.updateOne.useMutation();
  const getProductDetails = api.product.getOne.useMutation();

  if (!getAllProducts.data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-between gap-4 overflow-hidden">
      <AutoTableSheet
        title="Products"
        technicalTableName="products"
        schema={productSchema}
        rowIdentifierKey="id"
        data={getAllProducts.data.products}
        onRefetchData={getAllProducts.refetch}
        onDetails={getProductDetails.mutateAsync}
        onDelete={deleteProduct.mutateAsync}
        renderDetails={(product) => {
          return (
            <div>
              <ProductAccessoriesTable productId={product.id} />
            </div>
          );
        }}
        create={{
          formSchema: productCreateSchema,
          onCreate: createProduct.mutateAsync,
          fieldsConfig: {
            description: {
              type: "textarea",
            },
            card_image_url: {
              type: "image",
            },
          },
        }}
        update={{
          formSchema: productUpdateSchema,
          onUpdate: updateProduct.mutateAsync,
          fieldsConfig: {
            id: {
              hidden: true,
            },
            description: {
              type: "textarea",
            },
            card_image_url: {
              type: "image",
            },
          },
        }}
      />

      <AutoTablePagination
        totalPagesCount={getAllProducts.data.totalPagesCount}
      />
    </div>
  );
};
