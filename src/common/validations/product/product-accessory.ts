import { Product_accessoryCreateSchema } from "~/zod-schemas/models";

export const productAccessorySchema = Product_accessoryCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
});

export const productAccessoryUpdateSchema = productAccessorySchema.omit({
  created_at: true,
  updated_at: true,
});

export const productAccessoryCreateSchema = productAccessoryUpdateSchema.omit({
  id: true,
});
