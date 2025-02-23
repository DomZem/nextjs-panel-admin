import { RegionScalarSchema } from "~/zod-schemas/models";

export const regionSchema = RegionScalarSchema;

export const regionUpdateSchema = regionSchema.omit({
  created_at: true,
  updated_at: true,
});

export const regionCreateSchema = regionUpdateSchema.omit({
  id: true,
});
