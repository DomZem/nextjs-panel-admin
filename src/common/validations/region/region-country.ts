import { Region_countryCreateSchema } from "~/zod-schemas/models";

export const regionCountrySchema = Region_countryCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
});

export const regionCountryFormSchema = regionCountrySchema
  .omit({
    created_at: true,
    updated_at: true,
  })
  .partial({
    id: true,
  });
