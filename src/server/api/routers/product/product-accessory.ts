import { productAccessoryFormSchema } from "~/common/validations/product/product-accessory";
import { Product_accessoryScalarSchema } from "~/zod-schemas/models";
import { adminProcedure, createTRPCRouter } from "../../trpc";
import { z } from "zod";

export const productAccessoryRouter = createTRPCRouter({
  getAll: adminProcedure
    .input(
      z.object({
        productId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const productAccessories = await ctx.db.product_accessory.findMany({
        where: {
          product_id: input.productId,
        },
        orderBy: {
          id: "asc",
        },
      });

      return productAccessories;
    }),
  getOne: adminProcedure
    .input(Product_accessoryScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.product_accessory.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
  createOne: adminProcedure
    .input(productAccessoryFormSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.product_accessory.create({
        data: input,
      });

      return result;
    }),
  updateOne: adminProcedure
    .input(
      productAccessoryFormSchema.required({
        id: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.product_accessory.update({
        where: {
          id: input.id,
        },
        data: input,
      });

      return result;
    }),
  deleteOne: adminProcedure
    .input(Product_accessoryScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.product_accessory.delete({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
});
