import { ProductScalarSchema } from "~/zod-schemas/models";

export const productSchema = ProductScalarSchema;

export const productUpdateSchema = productSchema.omit({
  created_at: true,
  updated_at: true,
});

export const productCreateSchema = productUpdateSchema.omit({
  id: true,
});
