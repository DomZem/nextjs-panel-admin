import { Region_countryScalarSchema } from "~/zod-schemas/models";
import { adminProcedure, createTRPCRouter } from "../../trpc";
import {
  regionCountryCreateSchema,
  regionCountryUpdateSchema,
} from "~/common/validations/region/region-country";
import { z } from "zod";

export const regionCountryRouter = createTRPCRouter({
  getAll: adminProcedure
    .input(
      z.object({
        regionId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const regionCountries = await ctx.db.region_country.findMany({
        where: {
          region_id: input.regionId,
        },
        orderBy: {
          id: "asc",
        },
      });

      return regionCountries;
    }),
  getOne: adminProcedure
    .input(Region_countryScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.region_country.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
  createOne: adminProcedure
    .input(regionCountryCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.region_country.create({
        data: input,
      });

      return result;
    }),
  updateOne: adminProcedure
    .input(regionCountryUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.region_country.update({
        where: {
          id: input.id,
        },
        data: input,
      });

      return result;
    }),
  deleteOne: adminProcedure
    .input(Region_countryScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.region_country.delete({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
});
