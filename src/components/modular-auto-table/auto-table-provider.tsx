import { userSchema } from "~/common/validations/user";
import React, { useState } from "react";
import {
  type ZodObjectSchemaIdentifierKey,
  type ZodObjectInfer,
  type ZodObjectSchema,
} from "~/utils/zod";

type ActionType = "CREATE" | "UPDATE" | "DELETE" | "DETAILS" | null;

interface IAutoTableContext<
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
> {
  schema: TSchema;
  rowIdentifierKey: ZodObjectSchemaIdentifierKey<TSchema>;
  selectedRow: ZodObjectInfer<TSchema> | null;
  setSelectedRow: (row: ZodObjectInfer<TSchema> | null) => void;
  currentAction: ActionType;
  setCurrentAction: (action: ActionType) => void;
  detailsData: TDetailsData | null;
  setDetailsData: (data: TDetailsData | null) => void;
  refetchData: () => Promise<unknown>;
}

const AutoTableContext = React.createContext<IAutoTableContext<
  ZodObjectSchema,
  Record<string, unknown>
> | null>(null);

export interface AutoTableImplementationProps<TSchema extends ZodObjectSchema> {
  schema: TSchema;
  rowIdentifierKey: ZodObjectSchemaIdentifierKey<TSchema>;
  onRefetchData: () => Promise<unknown>;
}

export const AutoTableProvider = <
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
>({
  schema,
  rowIdentifierKey,
  onRefetchData,
  children,
}: {
  schema: TSchema;
  rowIdentifierKey: ZodObjectSchemaIdentifierKey<TSchema>;
  onRefetchData: () => Promise<unknown>;
  children: React.ReactNode;
}) => {
  const [selectedRow, setSelectedRow] =
    useState<ZodObjectInfer<TSchema> | null>(null);
  const [currentAction, setCurrentAction] = useState<ActionType>(null);
  const [detailsData, setDetailsData] = useState<TDetailsData | null>(null);

  return (
    <AutoTableContext.Provider
      value={{
        schema,
        selectedRow,
        refetchData: onRefetchData,
        currentAction,
        setCurrentAction: (action) => setCurrentAction(action),
        rowIdentifierKey,
        setSelectedRow: (row: ZodObjectInfer<TSchema> | null) =>
          setSelectedRow(row),
        detailsData,
        setDetailsData: (data) => setDetailsData(data as TDetailsData),
      }}
    >
      {children}
    </AutoTableContext.Provider>
  );
};

export const useAutoTable = <
  TSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
>() => {
  const context = React.useContext(
    AutoTableContext as React.Context<IAutoTableContext<
      TSchema,
      TDetailsData
    > | null>,
  );

  if (!context) {
    throw new Error("useAutoTable must be used within an AutoTableProvider");
  }

  return context;
};

const B = () => {
  return (
    <AutoTableProvider
      schema={userSchema}
      rowIdentifierKey="id"
      onRefetchData={() => Promise.resolve()}
    >
      asda
    </AutoTableProvider>
  );
};
