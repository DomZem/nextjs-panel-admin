import { regionFormSchema } from "~/common/validations/region/region";
import { adminProcedure, createTRPCRouter } from "../../trpc";
import { RegionScalarSchema } from "~/zod-schemas/models";

export const regionRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) => {
    const regions = await ctx.db.region.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return regions;
  }),
  getOne: adminProcedure
    .input(RegionScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.region.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
  createOne: adminProcedure
    .input(regionFormSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.region.create({
        data: input,
      });

      return result;
    }),
  updateOne: adminProcedure
    .input(regionFormSchema.required({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.region.update({
        where: {
          id: input.id,
        },
        data: input,
      });

      return result;
    }),
  deleteOne: adminProcedure
    .input(RegionScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.region.delete({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
});
