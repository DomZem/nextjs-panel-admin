import { Product_accessoryCreateSchema } from "~/zod-schemas/models";

export const productAccessorySchema = Product_accessoryCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
});

export const productAccessoryFormSchema = productAccessorySchema
  .omit({
    created_at: true,
    updated_at: true,
  })
  .partial({
    id: true,
  });
