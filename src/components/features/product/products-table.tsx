"use client";

import { AutoTableDndTable } from "~/components/auto-table/tables/auto-table-dnd-table";
import { AutoTablePrimary } from "~/components/auto-table/variants/auto-table-primary";
import { AutoTablePagination } from "~/components/auto-table/auto-table-pagination";
import { AutoTableToolbarHeader } from "~/components/auto-table/auto-table-header";
import { AutoTableDetailsRow } from "~/components/auto-table/auto-table";
import { ProductAccessoriesTable } from "./product-accessories-table";
import { useRowsPerPage } from "~/hooks/use-rows-per-page";
import { ProductCategory } from "@prisma/client";
import {
  productCreateSchema,
  productUpdateSchema,
  productSchema,
} from "~/common/validations/product/product";
import { usePage } from "~/hooks/use-page";
import { api } from "~/trpc/react";
import { useState } from "react";
import {
  enumToSelectOptions,
  FilterCard,
  FilterCardItemSelect,
  FilterCardItemString,
} from "~/components/ui/filter";

export const ProductsTable = () => {
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState<
    ProductCategory | "ALL"
  >("ALL");

  const [pageSize] = useRowsPerPage();
  const [page] = usePage();

  const getAllProducts = api.product.getAll.useQuery({
    page,
    pageSize,
    filters: {
      productName,
      productCategory: productCategory === "ALL" ? undefined : productCategory,
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
        onDetails={async (selectedRow) =>
          await getProductDetails.mutateAsync({
            id: selectedRow.id,
          })
        }
        onDelete={async (selectedRow) =>
          await deleteProduct.mutateAsync({
            id: selectedRow.id,
          })
        }
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
            features_content: {
              type: "wysiwyg",
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
            features_content: {
              type: "wysiwyg",
            },
          },
        }}
      >
        <AutoTableToolbarHeader title="Products" />

        <FilterCard>
          <FilterCardItemString
            label="name"
            placeholder="Search by product name"
            value={productName}
            onValueChange={setProductName}
          />
          <FilterCardItemSelect
            label="category"
            placeholder="Search by product category"
            value={productCategory}
            options={enumToSelectOptions(ProductCategory)}
            onValueChange={setProductCategory}
          />
        </FilterCard>

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
