import { User_addressCreateSchema } from "~/zod-schemas/models";
import { z } from "zod";

export const userAddressSchema = User_addressCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
});

export const userAddressFormSchema = userAddressSchema
  .omit({
    region_country_id: true,
    created_at: true,
    updated_at: true,
  })
  .merge(
    z.object({
      region_country_id: z.coerce.number(),
    }),
  )
  .partial({
    id: true,
  });
