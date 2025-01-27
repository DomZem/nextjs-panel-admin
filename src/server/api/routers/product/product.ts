import { adminProcedure, createTRPCRouter } from "../../trpc";
import { ProductScalarSchema } from "~/zod-schemas/models";
import {
  productCreateSchema,
  productUpdateSchema,
} from "~/common/validations/product/product";
import { z } from "zod";

export const productRouter = createTRPCRouter({
  getAll: adminProcedure
    .input(
      z.object({
        page: z.number(),
        pageSize: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
        orderBy: {
          id: "asc",
        },
      });

      const totalProductsCount = await ctx.db.product.count();

      return {
        totalPagesCount: Math.ceil(totalProductsCount / input.pageSize),
        products,
      };
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
    .input(productCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.product.create({
        data: input,
      });

      return result;
    }),
  updateOne: adminProcedure
    .input(productUpdateSchema)
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
