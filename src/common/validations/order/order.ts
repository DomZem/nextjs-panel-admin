import { OrderCreateSchema } from "~/zod-schemas/models";
import { z } from "zod";

const orderRawSchema = OrderCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
  status: true,
});

export const orderSchema = orderRawSchema.merge(
  z.object({
    username: z.string(),
  }),
);

export const orderUpdateSchema = orderRawSchema.omit({
  created_at: true,
  updated_at: true,
});

export const orderCreateSchema = orderUpdateSchema.omit({
  id: true,
});
