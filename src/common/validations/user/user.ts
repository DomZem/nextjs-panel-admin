import { UserScalarSchema } from "~/zod-schemas/models";

export const userSchema = UserScalarSchema;

export const userFormSchema = userSchema.omit({}).partial({
  id: true,
});
