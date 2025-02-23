import { Region_countryCreateSchema } from "~/zod-schemas/models";

export const regionCountrySchema = Region_countryCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
});

export const regionCountryUpdateSchema = regionCountrySchema.omit({
  created_at: true,
  updated_at: true,
});

export const regionCountryCreateSchema = regionCountryUpdateSchema.omit({
  id: true,
});
