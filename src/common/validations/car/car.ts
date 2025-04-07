import {
  CarCreateSchema,
  Electric_car_variantCreateSchema,
  Sport_car_variantCreateSchema,
  Suv_car_variantCreateSchema,
  Classic_car_variantCreateSchema,
} from "~/zod-schemas/models";
import { z } from "zod";

// === car variants ===

export const carVariants = {
  electric: "electric_car_variant",
  sport: "sport_car_variant",
  suv: "suv_car_variant",
  classic: "classic_car_variant",
} as const;

const electricCarVariantSchema = Electric_car_variantCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
}).merge(z.object({ variant: z.literal(carVariants.electric) }));

const sportCarVariantSchema = Sport_car_variantCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
}).merge(z.object({ variant: z.literal(carVariants.sport) }));

const suvCarVariantSchema = Suv_car_variantCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
}).merge(z.object({ variant: z.literal(carVariants.suv) }));

const classicCarVariantSchema = Classic_car_variantCreateSchema.required({
  id: true,
  created_at: true,
  updated_at: true,
}).merge(
  z.object({
    variant: z.literal(carVariants.classic),
  }),
);

// === end ===

export const carSchema = electricCarVariantSchema
  .omit({ variant: true })
  .partial()
  .merge(sportCarVariantSchema.omit({ variant: true }).partial())
  .merge(suvCarVariantSchema.omit({ variant: true }).partial())
  .merge(classicCarVariantSchema.omit({ variant: true }).partial())
  .merge(
    z.object({
      variant: z.union([
        z.literal(carVariants.electric),
        z.literal(carVariants.sport),
        z.literal(carVariants.suv),
        z.literal(carVariants.classic),
      ]),
    }),
  )
  .merge(CarCreateSchema)
  .required({
    id: true,
    updated_at: true,
    created_at: true,
  });

export const carFormSchema = z.discriminatedUnion("variant", [
  electricCarVariantSchema
    .omit({ created_at: true, updated_at: true })
    .partial({ id: true }),
  sportCarVariantSchema
    .omit({ created_at: true, updated_at: true })
    .partial({ id: true }),
  suvCarVariantSchema
    .omit({ created_at: true, updated_at: true })
    .partial({ id: true }),
  classicCarVariantSchema
    .omit({ created_at: true, updated_at: true })
    .partial({ id: true }),
]);

export const carUpdateSchema = z.discriminatedUnion("variant", [
  electricCarVariantSchema.omit({ created_at: true, updated_at: true }),
  sportCarVariantSchema.omit({ created_at: true, updated_at: true }),
  suvCarVariantSchema.omit({ created_at: true, updated_at: true }),
  classicCarVariantSchema.omit({ created_at: true, updated_at: true }),
]);
