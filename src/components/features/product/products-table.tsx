"use client";

import { AutoTableDndTable } from "~/components/auto-table/tables/auto-table-dnd-table";
import { AutoTableFullActions } from "~/components/auto-table/variants/auto-table-full-actions";
import { AutoTablePagination } from "~/components/auto-table/auto-table-pagination";
import { AutoTableDetailsRow } from "~/components/auto-table/auto-table-row";
import { ProductAccessoriesTable } from "./product-accessories-table";
import { useRowsPerPage } from "~/hooks/use-rows-per-page";
import { type ProductCategory } from "@prisma/client";
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
import { ProductFilters } from "./product-filters";
import {
  productCreateSchema,
  productUpdateSchema,
  productSchema,
} from "~/common/validations/product/product";
import { usePage } from "~/hooks/use-page";
import { api } from "~/trpc/react";
import { useState } from "react";
import {
  FilterCard,
  FilterCardContent,
  FilterCardTitle,
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
    <AutoTableContainer>
      <AutoTableFullActions
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
        <AutoTableHeader>
          <AutoTableHeaderTitle>Products</AutoTableHeaderTitle>
          <AutoTableHeaderContent>
            <AutoTableRefreshButton />
            <AutoTableDialogFilters>
              <ProductFilters
                productName={productName}
                setProductName={setProductName}
                productCategory={productCategory}
                setProductCategory={setProductCategory}
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
            <ProductFilters
              productName={productName}
              setProductName={setProductName}
              productCategory={productCategory}
              setProductCategory={setProductCategory}
            />
          </FilterCardContent>
        </FilterCard>

        <AutoTableDndTable
          extraRow={(row) => <AutoTableDetailsRow rowId={row.id} />}
        />
      </AutoTableFullActions>

      {getAllProducts.data && (
        <AutoTablePagination
          totalPagesCount={getAllProducts.data.totalPagesCount}
        />
      )}
    </AutoTableContainer>
  );
};
