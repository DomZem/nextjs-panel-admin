import { RegionScalarSchema } from "~/zod-schemas/models";

export const regionSchema = RegionScalarSchema;

export const regionUpdateSchema = regionSchema.omit({});

export const regionCreateSchema = regionUpdateSchema.omit({
  id: true,
});
