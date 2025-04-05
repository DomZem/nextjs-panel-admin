import { userAddressFormSchema } from "~/common/validations/user/user-address";
import { User_addressScalarSchema } from "~/zod-schemas/models";
import { adminProcedure, createTRPCRouter } from "../../trpc";
import { z } from "zod";

export const userAddressRouter = createTRPCRouter({
  getAll: adminProcedure
    .input(
      z.object({
        userId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userAddresses = await ctx.db.user_address.findMany({
        where: {
          user_id: input.userId,
        },
        orderBy: {
          id: "asc",
        },
      });

      return userAddresses;
    }),
  getOne: adminProcedure
    .input(User_addressScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user_address.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
  createOne: adminProcedure
    .input(userAddressFormSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user_address.create({
        data: input,
      });

      return result;
    }),
  updateOne: adminProcedure
    .input(userAddressFormSchema.required({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user_address.update({
        where: {
          id: input.id,
        },
        data: input,
      });

      return result;
    }),
  deleteOne: adminProcedure
    .input(User_addressScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user_address.delete({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
});
