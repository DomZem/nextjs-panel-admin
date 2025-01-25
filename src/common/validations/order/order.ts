import { OrderCreateSchema } from "~/zod-schemas/models";

export const orderSchema = OrderCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
  status: true,
});

export const orderUpdateSchema = orderSchema.omit({
  created_at: true,
  updated_at: true,
});

export const orderCreateSchema = orderUpdateSchema.omit({
  id: true,
});
