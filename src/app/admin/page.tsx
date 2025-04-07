"use client";

import { AutoFormDiscriminatedUnion } from "~/components/auto-form/auto-form-discriminated-union";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { MainWrapper } from "~/components/ui/main-wrapper";
import { mapDashedFieldName } from "~/utils/mappers";
import { z } from "zod";

const animalSchema = z.discriminatedUnion("variant", [
  z.object({
    variant: z.literal("lion"),
    name: z.string(),
    age: z.number(),
    image: z.string(),
    pride_size: z.number(),
    mane_color: z.enum(["golden", "dark", "reddish"]),
  }),
  z.object({
    variant: z.literal("monkey"),
    name: z.string(),
    age: z.number(),
    image: z.string(),
    species: z.enum(["capuchin", "macaque", "howler", "tamarin"]),
    can_use_tools: z.boolean(),
  }),
]);

export default function DashboardPage() {
  return (
    <MainWrapper>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="capitalize">create animal</CardTitle>
          </CardHeader>
          <CardContent>
            <AutoFormDiscriminatedUnion
              schema={animalSchema}
              onSubmit={(data) => {
                console.log("form submitted with data:", data);
              }}
              mapLabel={mapDashedFieldName}
              fieldsConfig={{
                base: {
                  image: {
                    type: "image",
                  },
                },
                variants: {
                  lion: {
                    name: {
                      label: "Lion name",
                      description: "The name of the lion",
                    },
                  },
                  monkey: {
                    name: {
                      label: "Monkey name",
                      description: "The name of the monkey",
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </MainWrapper>
  );
}
