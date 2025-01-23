import { Product_accessoryCreateSchema } from "~/zod-schemas/models";

export const productAccessorySchema = Product_accessoryCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
});

export const productAccessoryFormSchemaWithId = productAccessorySchema.omit({});

export const productAccessoryFormSchema = productAccessoryFormSchemaWithId.omit(
  {
    id: true,
  },
);
