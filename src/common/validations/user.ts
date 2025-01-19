import { UserScalarSchema } from "~/zod-schemas/models";

export const userSchema = UserScalarSchema;

export const userFormSchemaWithId = userSchema.omit({});

export const userFormSchema = userFormSchemaWithId.omit({
  id: true,
});
