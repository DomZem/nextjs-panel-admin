import { User_transactionCreateSchema } from "~/zod-schemas/models";

export const userTransactionSchema = User_transactionCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
  status: true,
});

export const userTransactionUpdateSchema = userTransactionSchema.omit({
  created_at: true,
  updated_at: true,
});

export const userTransactionCreateSchema = userTransactionUpdateSchema.omit({
  id: true,
});
