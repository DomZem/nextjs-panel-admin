import React, { useState } from "react";
import {
  type ZodObjectSchemaIdentifierKey,
  type ZodObjectInfer,
  type ZodObjectSchema,
} from "~/utils/zod";

export type ActionType = "CREATE" | "UPDATE" | "DELETE" | "DETAILS" | null;

interface IAutoTableContext<TSchema extends ZodObjectSchema> {
  schema: TSchema;
  technicalTableName: string;
  rowIdentifierKey: ZodObjectSchemaIdentifierKey<TSchema>;
  selectedRow: ZodObjectInfer<TSchema> | null;
  setSelectedRow: (row: ZodObjectInfer<TSchema> | null) => void;
  currentAction: ActionType;
  setCurrentAction: (action: ActionType) => void;
  refetchData: () => Promise<unknown>;
}

const AutoTableContext =
  React.createContext<IAutoTableContext<ZodObjectSchema> | null>(null);

export interface AutoTableImplementationProps<TSchema extends ZodObjectSchema> {
  schema: TSchema;
  technicalTableName: string;
  rowIdentifierKey: ZodObjectSchemaIdentifierKey<TSchema>;
  onRefetchData: () => Promise<unknown>;
}

export const AutoTableProvider = <TSchema extends ZodObjectSchema>({
  schema,
  technicalTableName,
  rowIdentifierKey,
  onRefetchData,
  children,
}: AutoTableImplementationProps<TSchema> & {
  children: React.ReactNode;
}) => {
  const [selectedRow, setSelectedRow] =
    useState<ZodObjectInfer<TSchema> | null>(null);
  const [currentAction, setCurrentAction] = useState<ActionType>(null);

  return (
    <AutoTableContext.Provider
      value={{
        schema,
        technicalTableName,
        selectedRow,
        refetchData: onRefetchData,
        currentAction,
        setCurrentAction: (action) => setCurrentAction(action),
        rowIdentifierKey,
        setSelectedRow: (row) => setSelectedRow(row),
      }}
    >
      {children}
    </AutoTableContext.Provider>
  );
};

export const useAutoTable = <TSchema extends ZodObjectSchema>() => {
  const context = React.useContext(
    AutoTableContext as React.Context<IAutoTableContext<TSchema> | null>,
  );

  if (!context) {
    throw new Error("useAutoTable must be used within an AutoTableProvider");
  }

  return context;
};
