import { User_addressCreateSchema } from "~/zod-schemas/models";
import { z } from "zod";

export const userAddressSchema = User_addressCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
});

const userAddressFormSchema = userAddressSchema
  .omit({
    region_country_id: true,
  })
  .merge(
    z.object({
      region_country_id: z.coerce.number(),
    }),
  );

export const userAddressCreateSchema = userAddressFormSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const userAddressUpdateSchema = userAddressFormSchema.omit({
  created_at: true,
  updated_at: true,
});
