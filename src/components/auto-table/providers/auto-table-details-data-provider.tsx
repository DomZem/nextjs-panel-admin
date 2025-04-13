import { type ZodObjectSchema } from "~/utils/zod";
import React, { useState } from "react";
import { type Awaitable } from "~/types";
import { type z } from "zod";

interface IAutoTableDetailsDataContext<
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
> {
  detailsData: TDetailsData | null;
  renderDetails: (data: TDetailsData) => React.ReactNode;
  getDetailsData: (row: z.infer<TSchema>) => Awaitable<void>;
}

const AutoTableDetailsDataContext =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.createContext<IAutoTableDetailsDataContext<any, any> | null>(null);

export type IAutoTableDetailsDataProvider<
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
> =
  | {
      variant: "lazy";
      renderDetails: (data: TDetailsData) => React.ReactNode;
      onDetails: (selectedRow: z.infer<TSchema>) => Promise<TDetailsData>;
    }
  | {
      variant: "eager";
      renderDetails: (selectedRow: z.infer<TSchema>) => React.ReactNode;
    };

export const AutoTableDetailsDataProvider = <
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
>(
  props: IAutoTableDetailsDataProvider<TSchema, TDetailsData> & {
    children: React.ReactNode;
  },
) => {
  const [detailsData, setDetailsData] = useState<
    TDetailsData | z.infer<TSchema> | null
  >(null);

  return (
    <AutoTableDetailsDataContext.Provider
      value={{
        detailsData,
        renderDetails: props.renderDetails,
        getDetailsData:
          props.variant === "eager"
            ? (row: z.infer<TSchema>) => {
                setDetailsData(row);
              }
            : props.variant === "lazy"
              ? async (row: z.infer<TSchema>) => {
                  const data = await props.onDetails(row);
                  setDetailsData(data);
                }
              : () => {
                  throw new Error(
                    "Invalid variant provided to AutoTableDetailsDataProvider",
                  );

                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
                  const check: never = props.variant;
                },
      }}
    >
      {props.children}
    </AutoTableDetailsDataContext.Provider>
  );
};

export const useAutoTableDetailsData = <
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
>() => {
  const context = React.useContext(
    AutoTableDetailsDataContext as React.Context<IAutoTableDetailsDataContext<
      TSchema,
      TDetailsData
    > | null>,
  );

  if (!context) {
    throw new Error(
      "useAutoTableDetailsData must be used within an AutoTableDetailsDataProvider",
    );
  }

  return context;
};
