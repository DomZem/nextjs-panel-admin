import { RegionScalarSchema } from "~/zod-schemas/models";
import { adminProcedure, createTRPCRouter } from "../../trpc";
import {
  regionCreateSchema,
  regionUpdateSchema,
} from "~/common/validations/region/region";

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
    .input(regionCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.region.create({
        data: input,
      });

      return result;
    }),
  updateOne: adminProcedure
    .input(regionUpdateSchema)
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
