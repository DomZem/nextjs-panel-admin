import { Order_itemCreateSchema } from "~/zod-schemas/models";

export const orderItemSchema = Order_itemCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
});

export const orderItemFormSchema = orderItemSchema
  .omit({
    created_at: true,
    updated_at: true,
  })
  .partial({
    id: true,
  });
