import { ProductScalarSchema } from "~/zod-schemas/models";

export const productSchema = ProductScalarSchema;

export const productFormSchemaWithId = productSchema.omit({
  created_at: true,
  updated_at: true,
});

export const productFormSchema = productFormSchemaWithId.omit({
  id: true,
});
