import { RegionScalarSchema } from "~/zod-schemas/models";

export const regionSchema = RegionScalarSchema;

export const regionFormSchema = regionSchema
  .omit({
    created_at: true,
    updated_at: true,
  })
  .partial({
    id: true,
  });
