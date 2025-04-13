"use client";

import { AutoTableFullActions } from "~/components/auto-table/variants/auto-table-full-actions";
import { AutoTableDndTable } from "~/components/auto-table/tables/auto-table-dnd-table";
import { AutoTableDetailsRow } from "~/components/auto-table/auto-table-row";
import { carFormSchema, carSchema } from "~/common/validations/car/car";
import { Car, Gauge, Truck, Zap } from "lucide-react";
import {
  AutoTableContainer,
  AutoTableToolbarHeader,
} from "~/components/auto-table/auto-table-header";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";

const ICON_SIZE = 16;

export const CarsTable = () => {
  const getAllCars = api.car.getAll.useQuery();
  const deleteCar = api.car.deleteOne.useMutation();
  const createCar = api.car.createOne.useMutation();
  const updateCar = api.car.updateOne.useMutation();

  return (
    <AutoTableContainer>
      <AutoTableFullActions
        technicalTableName="cars"
        schema={carSchema}
        rowIdentifierKey="id"
        columnsMap={{
          variant: (v) => {
            return (
              <Badge>
                {v === "electric_car_variant" && <Zap size={ICON_SIZE} />}
                {v === "sport_car_variant" && <Gauge size={ICON_SIZE} />}
                {v === "suv_car_variant" && <Truck size={ICON_SIZE} />}
                {v === "classic_car_variant" && <Car size={ICON_SIZE} />}
                <span className="ml-1">
                  {v === "electric_car_variant" && "Electric"}
                  {v === "sport_car_variant" && "Sport"}
                  {v === "suv_car_variant" && "SUV"}
                  {v === "classic_car_variant" && "Classic"}
                </span>
              </Badge>
            );
          },
        }}
        data={getAllCars.data ?? []}
        onRefetchData={getAllCars.refetch}
        details={{
          variant: "eager",
          renderDetails: (car) => {
            return <div className="space-y-4">{JSON.stringify(car)}</div>;
          },
        }}
        onDelete={async (row) => await deleteCar.mutateAsync({ id: row.id })}
        autoForm={{
          formSchema: carFormSchema,
          fieldsConfig: {
            base: {
              id: {
                hidden: true,
              },
              image_src: {
                type: "image",
              },
              description: {
                type: "textarea",
              },
            },
          },
          create: {
            onCreate: createCar.mutateAsync,
            isSubmitting: createCar.isPending,
          },
          update: {
            onUpdate: updateCar.mutateAsync,
            isSubmitting: updateCar.isPending,
          },
        }}
      >
        <AutoTableToolbarHeader title="Cars" />

        <AutoTableDndTable
          extraRow={(row) => <AutoTableDetailsRow rowId={row.id} />}
        />
      </AutoTableFullActions>
    </AutoTableContainer>
  );
};
