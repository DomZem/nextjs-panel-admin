"use client";

import { useToast } from "~/hooks/use-toast";
import React, { useState } from "react";
import {
  type StringOrNumberKeyOnly,
  type ZodObjectInfer,
  type ZodObjectSchema,
} from "~/utils/zod";

export type ActionType = "CREATE" | "UPDATE" | "DELETE" | "DETAILS" | null;

interface AutoTableContext<
  TSchema extends ZodObjectSchema,
  TFormSchema extends ZodObjectSchema,
  TDetailsData extends Record<string, unknown>,
> {
  schema: TSchema;
  rowIdentifierKey: StringOrNumberKeyOnly<ZodObjectInfer<TSchema>>;
  selectedRow: ZodObjectInfer<TSchema> | null;
  setSelectedRow: (row: ZodObjectInfer<TSchema> | null) => void;
  currentAction: ActionType;
  setCurrentAction: (action: ActionType) => void;
  handleRefetchData: () => Promise<unknown>;
  handleDelete: () => Promise<unknown>;
  formSchema: TFormSchema;
  handleCreate: (data: ZodObjectInfer<TFormSchema>) => Promise<unknown>;
  handleUpdate: (data: ZodObjectInfer<TFormSchema>) => Promise<unknown>;
  detailsData: TDetailsData | null;
  handleGetDetailsData: (
    rowId: ZodObjectInfer<TSchema>[StringOrNumberKeyOnly<
      ZodObjectInfer<TSchema>
    >],
  ) => Promise<void>;
  detailsContent: (data: TDetailsData) => React.ReactNode;
}

const AutoTableContext = React.createContext<AutoTableContext<
  ZodObjectSchema,
  ZodObjectSchema,
  Record<string, unknown>
> | null>(null);

export const AutoTableProvider = <
  TSchema extends ZodObjectSchema,
  TFormSchema extends ZodObjectSchema,
  TRowIdentifierKey extends Extract<
    StringOrNumberKeyOnly<ZodObjectInfer<TSchema>>,
    string
  >,
  TRowIdentifierKeyType extends ZodObjectInfer<TSchema>[TRowIdentifierKey],
  TDetailsData extends Record<string, unknown>,
>({
  schema,
  rowIdentifierKey,
  onRefetchData,
  children,
  onDelete,
  formSchema,
  onCreate,
  onUpdate,
  onDetails,
  detailsContent,
}: {
  schema: TSchema;
  rowIdentifierKey: TRowIdentifierKey;
  formSchema: TFormSchema;
  children: React.ReactNode;
  onRefetchData: () => Promise<unknown>;
  onDelete: (args: { id: TRowIdentifierKeyType }) => Promise<unknown>;
  onCreate: (data: ZodObjectInfer<TFormSchema>) => Promise<unknown>;
  onUpdate: (
    data: {
      id: TRowIdentifierKeyType;
    } & ZodObjectInfer<TFormSchema>,
  ) => Promise<unknown>;
  onDetails: (args: { id: TRowIdentifierKeyType }) => Promise<TDetailsData>;
  detailsContent: (data: TDetailsData) => React.ReactNode;
}) => {
  const [selectedRow, setSelectedRow] =
    useState<ZodObjectInfer<TSchema> | null>(null);
  const [currentAction, setCurrentAction] = useState<ActionType>(null);
  const [detailsData, setDetailsData] = useState<TDetailsData | null>(null);

  const { toast } = useToast();

  const handleDelete = async () => {
    if (!selectedRow) {
      throw new Error("No selected row to delete");
    }

    try {
      const id = selectedRow[rowIdentifierKey];
      await onDelete({ id });
      await onRefetchData();

      toast({
        title: "Success",
        description: "The data has been deleted successfully",
      });
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setCurrentAction(null);
    }
  };

  const handleSubmitData = async (callback: () => Promise<unknown>) => {
    try {
      await callback();
      await onRefetchData();

      toast({
        title: "Success",
        description: `The data has been ${currentAction === "CREATE" ? "created" : "updated"} successfully`,
      });

      setCurrentAction(null);
    } catch (e) {
      console.error(e);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  const handleGetDetailsData = async (rowId: TRowIdentifierKeyType) => {
    setDetailsData(null);
    const data = await onDetails({ id: rowId });
    setDetailsData(data);
  };

  return (
    <AutoTableContext.Provider
      value={{
        schema,
        rowIdentifierKey,
        currentAction,
        setCurrentAction: (action: ActionType) => setCurrentAction(action),
        selectedRow,
        setSelectedRow: (row: ZodObjectInfer<typeof schema> | null) =>
          setSelectedRow(row),
        handleRefetchData: onRefetchData,
        handleDelete,
        formSchema,
        handleCreate: async (data) => {
          await handleSubmitData(async () => {
            await onCreate(data);
          });
        },
        handleUpdate: async (data) => {
          if (!selectedRow) {
            throw new Error("No selected row to update");
          }

          await handleSubmitData(async () => {
            await onUpdate({
              ...data,
              id: selectedRow[rowIdentifierKey],
            });
          });
        },
        detailsData,
        handleGetDetailsData,
        detailsContent,
      }}
    >
      {children}
    </AutoTableContext.Provider>
  );
};

export const useAutoTable = () => {
  const context = React.useContext(AutoTableContext);

  if (!context) {
    throw new Error("useAutoTable must be used within an AutoTableProvider");
  }

  return context;
};
