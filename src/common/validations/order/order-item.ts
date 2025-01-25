import { Order_itemCreateSchema } from "~/zod-schemas/models";

export const orderItemSchema = Order_itemCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
});

export const orderItemUpdateSchema = orderItemSchema.omit({
  created_at: true,
  updated_at: true,
});

export const orderItemCreateSchema = orderItemUpdateSchema.omit({
  id: true,
});
