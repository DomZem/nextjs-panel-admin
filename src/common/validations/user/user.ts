import { UserScalarSchema } from "~/zod-schemas/models";

export const userSchema = UserScalarSchema;

export const userUpdateSchema = userSchema.omit({});

export const userCreateSchema = userUpdateSchema.omit({
  id: true,
});
