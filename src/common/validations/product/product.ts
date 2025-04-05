import { ProductScalarSchema } from "~/zod-schemas/models";

export const productSchema = ProductScalarSchema;

export const productFormSchema = productSchema
  .omit({
    created_at: true,
    updated_at: true,
  })
  .partial({
    id: true,
  });
