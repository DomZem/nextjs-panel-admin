import { adminProcedure, createTRPCRouter } from "../trpc";
import { UserScalarSchema } from "~/zod-schemas/models";
import {
  userFormSchema,
  userFormSchemaWithId,
} from "~/common/validations/user";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getAll: adminProcedure
    .input(
      z.object({
        page: z.number(),
        pageSize: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
        orderBy: {
          id: "asc",
        },
      });

      const totalUsersCount = await ctx.db.user.count();

      return {
        totalPagesCount: Math.ceil(totalUsersCount / input.pageSize),
        users,
      };
    }),
  getOne: adminProcedure
    .input(UserScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
  createOne: adminProcedure
    .input(userFormSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user.create({
        data: input,
      });

      return result;
    }),
  updateOne: adminProcedure
    .input(userFormSchemaWithId)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: input,
      });

      return result;
    }),
  deleteOne: adminProcedure
    .input(UserScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user.delete({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
});
