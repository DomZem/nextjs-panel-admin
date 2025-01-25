import { adminProcedure, createTRPCRouter } from "../../trpc";
import { OrderScalarSchema } from "~/zod-schemas/models";
import {
  orderUpdateSchema,
  orderCreateSchema,
} from "~/common/validations/order/order";
import { z } from "zod";

export const orderRouter = createTRPCRouter({
  getAll: adminProcedure
    .input(
      z.object({
        page: z.number(),
        pageSize: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const orders = await ctx.db.order.findMany({
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
        orderBy: {
          id: "asc",
        },
      });

      const totalOrdersCount = await ctx.db.order.count();

      return {
        totalPagesCount: Math.ceil(totalOrdersCount / input.pageSize),
        orders,
      };
    }),
  getOne: adminProcedure
    .input(OrderScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.order.findFirstOrThrow({
        where: {
          id: input.id,
        },
        select: {
          id: true,
        },
      });

      return result;
    }),
  createOne: adminProcedure
    .input(orderCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.order.create({
        data: input,
      });

      return result;
    }),
  updateOne: adminProcedure
    .input(orderUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.order.update({
        where: {
          id: input.id,
        },
        data: input,
      });

      return result;
    }),
  deleteOne: adminProcedure
    .input(OrderScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.order.delete({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
});
