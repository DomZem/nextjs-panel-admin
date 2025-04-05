import { orderItemFormSchema } from "~/common/validations/order/order-item";
import { adminProcedure, createTRPCRouter } from "../../trpc";
import { Order_itemScalarSchema } from "~/zod-schemas/models";
import { z } from "zod";

export const orderItemRouter = createTRPCRouter({
  getAll: adminProcedure
    .input(
      z.object({
        orderId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const orderItems = await ctx.db.order_item.findMany({
        where: {
          order_id: input.orderId,
        },
        orderBy: {
          id: "asc",
        },
      });

      return orderItems;
    }),
  getOne: adminProcedure
    .input(Order_itemScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.order_item.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
  createOne: adminProcedure
    .input(orderItemFormSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.order_item.create({
        data: input,
      });

      return result;
    }),
  updateOne: adminProcedure
    .input(orderItemFormSchema.required({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.order_item.update({
        where: {
          id: input.id,
        },
        data: input,
      });

      return result;
    }),
  deleteOne: adminProcedure
    .input(Order_itemScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.order_item.delete({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
});
