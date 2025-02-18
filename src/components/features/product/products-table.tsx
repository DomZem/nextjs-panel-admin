"use client";

import { AutoTableDndTable } from "~/components/auto-table/tables/auto-table-dnd-table";
import { AutoTablePrimary } from "~/components/auto-table/variants/auto-table-primary";
import { AutoTablePagination } from "~/components/auto-table/auto-table-pagination";
import { AutoTableToolbarHeader } from "~/components/auto-table/auto-table-header";
import { AutoTableDetailsRow } from "~/components/auto-table/auto-table";
import { ProductAccessoriesTable } from "./product-accessories-table";
import { useRowsPerPage } from "~/hooks/use-rows-per-page";
import { type ProductCategory } from "@prisma/client";
import { ProductFilters } from "./product-filters";
import {
  productCreateSchema,
  productUpdateSchema,
  productSchema,
} from "~/common/validations/product/product";
import { usePage } from "~/hooks/use-page";
import { api } from "~/trpc/react";
import { useState } from "react";

export const ProductsTable = () => {
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState<
    ProductCategory | undefined
  >(undefined);

  const [pageSize] = useRowsPerPage();
  const [page] = usePage();

  const getAllProducts = api.product.getAll.useQuery({
    page,
    pageSize,
    filters: {
      productName,
      productCategory,
    },
  });
  const deleteProduct = api.product.deleteOne.useMutation();
  const createProduct = api.product.createOne.useMutation();
  const updateProduct = api.product.updateOne.useMutation();
  const getProductDetails = api.product.getOne.useMutation();

  return (
    <div className="flex flex-1 flex-col justify-between gap-4 overflow-hidden">
      <AutoTablePrimary
        schema={productSchema}
        rowIdentifierKey="id"
        technicalTableName="products"
        columnsMap={{
          price_cents: (value) => {
            return `$${(value / 100).toFixed(2)}`;
          },
          vat_percentage: (value) => {
            return `${value}%`;
          },
        }}
        data={getAllProducts.data?.products ?? []}
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
      >
        <AutoTableToolbarHeader title="Products" />

        <ProductFilters
          productName={productName}
          onProductNameChange={setProductName}
          productCategory={productCategory}
          onProductCategoryChange={setProductCategory}
        />

        <AutoTableDndTable
          extraRow={(row) => <AutoTableDetailsRow rowId={row.id} />}
        />
      </AutoTablePrimary>

      {getAllProducts.data && (
        <AutoTablePagination
          totalPagesCount={getAllProducts.data.totalPagesCount}
        />
      )}
    </div>
  );
};
