import { paginationSchema } from "~/common/validations/pagination";
import { orderFormSchema } from "~/common/validations/order/order";
import { adminProcedure, createTRPCRouter } from "../../trpc";
import { OrderScalarSchema } from "~/zod-schemas/models";
import { OrderStatus } from "@prisma/client";
import { z } from "zod";

export const orderRouter = createTRPCRouter({
  getAll: adminProcedure
    .input(
      paginationSchema.merge(
        z.object({
          filters: z.object({
            orderId: z.string().optional(),
            orderStatus: z.nativeEnum(OrderStatus).optional(),
          }),
        }),
      ),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        id: input.filters.orderId
          ? {
              contains: input.filters.orderId,
            }
          : undefined,
        status: input.filters.orderStatus,
      };

      const orders = await ctx.db.order.findMany({
        where,
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
        orderBy: {
          id: "asc",
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      const totalOrdersCount = await ctx.db.order.count({
        where,
      });

      const mappedOrders = orders.map(({ user, ...rest }) => ({
        ...rest,
        username: user.name!,
      }));

      return {
        totalPagesCount: Math.ceil(totalOrdersCount / input.pageSize),
        orders: mappedOrders,
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
    .input(orderFormSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.order.create({
        data: input,
      });

      return result;
    }),
  updateOne: adminProcedure
    .input(orderFormSchema.required({ id: true }))
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
