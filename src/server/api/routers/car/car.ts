import { adminProcedure, createTRPCRouter } from "../../trpc";
import { CarScalarSchema } from "~/zod-schemas/models";
import {
  carFormSchema,
  carUpdateSchema,
  carVariants,
} from "~/common/validations/car/car";

export const carRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) => {
    const cars = await ctx.db.car.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        delegate_aux_electric_car_variant: true,
        delegate_aux_classic_car_variant: true,
        delegate_aux_sport_car_variant: true,
        delegate_aux_suv_car_variant: true,
      },
    });

    // TODO: There might be some troubles when two variants are gonna have the same fields

    const mappedCars = cars.map((car) => {
      const {
        delegate_aux_electric_car_variant,
        delegate_aux_classic_car_variant,
        delegate_aux_sport_car_variant,
        delegate_aux_suv_car_variant,
        ...rest
      } = car;

      return {
        ...rest,
        ...delegate_aux_electric_car_variant,
        ...delegate_aux_classic_car_variant,
        ...delegate_aux_sport_car_variant,
        ...delegate_aux_suv_car_variant,
        variant: delegate_aux_electric_car_variant
          ? carVariants.electric
          : delegate_aux_suv_car_variant
            ? carVariants.suv
            : delegate_aux_classic_car_variant
              ? carVariants.classic
              : carVariants.sport,
      };
    });

    return mappedCars;
  }),
  getOne: adminProcedure
    .input(CarScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.car.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
  createOne: adminProcedure
    .input(carFormSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.car.create({
        data: {
          name: input.name,
          description: input.description,
          image_src: input.image_src,
          variant: input.variant,
          delegate_aux_electric_car_variant:
            input.variant === "electric_car_variant"
              ? {
                  create: {
                    battery_capacity_kWh: input.battery_capacity_kWh,
                    range_km: input.range_km,
                  },
                }
              : undefined,
          delegate_aux_sport_car_variant:
            input.variant === "sport_car_variant"
              ? {
                  create: {
                    max_speed_kmh: input.max_speed_kmh,
                    horsepower: input.horsepower,
                  },
                }
              : undefined,
          delegate_aux_suv_car_variant:
            input.variant === "suv_car_variant"
              ? {
                  create: {
                    seating_capacity: input.seating_capacity,
                    cargo_space_liters: input.cargo_space_liters,
                  },
                }
              : undefined,
          delegate_aux_classic_car_variant:
            input.variant === "classic_car_variant"
              ? {
                  create: {
                    year_of_manufacture: input.year_of_manufacture,
                    is_vintage: input.is_vintage,
                  },
                }
              : undefined,
        },
      });

      return result;
    }),
  updateOne: adminProcedure
    .input(carUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.car.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          image_src: input.image_src,
          variant: input.variant,
          delegate_aux_electric_car_variant:
            input.variant === "electric_car_variant"
              ? {
                  update: {
                    battery_capacity_kWh: input.battery_capacity_kWh,
                    range_km: input.range_km,
                  },
                }
              : undefined,
          delegate_aux_sport_car_variant:
            input.variant === "sport_car_variant"
              ? {
                  update: {
                    max_speed_kmh: input.max_speed_kmh,
                    horsepower: input.horsepower,
                  },
                }
              : undefined,
          delegate_aux_suv_car_variant:
            input.variant === "suv_car_variant"
              ? {
                  update: {
                    seating_capacity: input.seating_capacity,
                    cargo_space_liters: input.cargo_space_liters,
                  },
                }
              : undefined,
          delegate_aux_classic_car_variant:
            input.variant === "classic_car_variant"
              ? {
                  update: {
                    year_of_manufacture: input.year_of_manufacture,
                    is_vintage: input.is_vintage,
                  },
                }
              : undefined,
        },
      });

      return result;
    }),
  deleteOne: adminProcedure
    .input(CarScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.car.delete({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
});
