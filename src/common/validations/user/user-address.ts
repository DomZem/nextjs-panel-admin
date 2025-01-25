import { User_addressCreateSchema } from "~/zod-schemas/models";

export const userAddressSchema = User_addressCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
});

export const userAddressUpdateSchema = userAddressSchema.omit({
  created_at: true,
  updated_at: true,
});

export const userAddressCreateSchema = userAddressUpdateSchema.omit({
  id: true,
});
