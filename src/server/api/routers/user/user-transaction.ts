import { userTransactionFormSchema } from "~/common/validations/user/user-transaction";
import { User_transactionScalarSchema } from "~/zod-schemas/models";
import { paginationSchema } from "~/common/validations/pagination";
import { adminProcedure, createTRPCRouter } from "../../trpc";
import { z } from "zod";

export const userTransactionRouter = createTRPCRouter({
  getAll: adminProcedure
    .input(paginationSchema.merge(z.object({ userId: z.string().optional() })))
    .query(async ({ ctx, input }) => {
      const userTransactions = await ctx.db.user_transaction.findMany({
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
        where: {
          user_id: input.userId,
        },
        orderBy: {
          id: "asc",
        },
      });

      const totalUserTransactionsCount = await ctx.db.user_transaction.count({
        where: {
          user_id: input.userId,
        },
      });

      return {
        totalPagesCount: Math.ceil(totalUserTransactionsCount / input.pageSize),
        userTransactions,
      };
    }),
  getOne: adminProcedure
    .input(User_transactionScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user_transaction.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
  createOne: adminProcedure
    .input(userTransactionFormSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user_transaction.create({
        data: input,
      });

      return result;
    }),
  updateOne: adminProcedure
    .input(
      userTransactionFormSchema.required({
        id: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user_transaction.update({
        where: {
          id: input.id,
        },
        data: input,
      });

      return result;
    }),
  deleteOne: adminProcedure
    .input(User_transactionScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user_transaction.delete({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
});
