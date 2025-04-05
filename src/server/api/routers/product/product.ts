import { productFormSchema } from "~/common/validations/product/product";
import { paginationSchema } from "~/common/validations/pagination";
import { adminProcedure, createTRPCRouter } from "../../trpc";
import { ProductScalarSchema } from "~/zod-schemas/models";
import { ProductCategory } from "@prisma/client";
import { z } from "zod";

export const productRouter = createTRPCRouter({
  getAll: adminProcedure
    .input(
      paginationSchema.merge(
        z.object({
          filters: z.object({
            productName: z.string().optional(),
            productCategory: z.nativeEnum(ProductCategory).optional(),
          }),
        }),
      ),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        name: input.filters.productName
          ? {
              contains: input.filters.productName,
            }
          : undefined,
        category: input.filters.productCategory,
      };

      const products = await ctx.db.product.findMany({
        where,
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
        orderBy: {
          id: "asc",
        },
      });

      const totalProductsCount = await ctx.db.product.count({
        where,
      });

      return {
        totalPagesCount: Math.ceil(totalProductsCount / input.pageSize),
        products,
      };
    }),
  getSearchProducts: adminProcedure
    .input(
      z.object({
        name: z.string().optional(),
        id: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.name) {
        const products = await ctx.db.product.findMany({
          take: 5,
          orderBy: {
            id: "asc",
          },
          select: {
            id: true,
            name: true,
          },
        });

        return products;
      }

      const filteredProducts = await ctx.db.product.findMany({
        where: {
          name: {
            contains: input.name,
          },
        },
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      });

      return filteredProducts;
    }),
  getAllFiltered: adminProcedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          name: {
            contains: input.name,
          },
        },
      });

      return products;
    }),
  getOne: adminProcedure
    .input(ProductScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.product.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
  createOne: adminProcedure
    .input(productFormSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.product.create({
        data: input,
      });

      return result;
    }),
  updateOne: adminProcedure
    .input(productFormSchema.required({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.product.update({
        where: {
          id: input.id,
        },
        data: input,
      });

      return result;
    }),
  deleteOne: adminProcedure
    .input(ProductScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.product.delete({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
});
