import React, { useState } from "react";
import { type z } from "zod";
import {
  type ZodObjectSchema,
  type ZodObjectSchemaIdentifierKey,
} from "~/types/zod";

export type ActionType = "CREATE" | "UPDATE" | "DELETE" | "DETAILS" | null;

interface IAutoTableContext<TSchema extends ZodObjectSchema> {
  schema: TSchema;
  technicalTableName: string;
  rowIdentifierKey: ZodObjectSchemaIdentifierKey<TSchema>;
  selectedRow: z.infer<TSchema> | null;
  setSelectedRow: (row: z.infer<TSchema> | null) => void;
  selectedRows: z.infer<TSchema>[];
  setSelectedRows: (rows: z.infer<TSchema>[]) => void;
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
  const [selectedRow, setSelectedRow] = useState<z.infer<TSchema> | null>(null);
  const [selectedRows, setSelectedRows] = useState<z.infer<TSchema>[]>([]);
  const [currentAction, setCurrentAction] = useState<ActionType>(null);

  return (
    <AutoTableContext.Provider
      value={{
        schema,
        technicalTableName,
        selectedRow,
        refetchData: onRefetchData,
        currentAction,
        setCurrentAction,
        rowIdentifierKey,
        setSelectedRow,
        selectedRows,
        setSelectedRows,
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
