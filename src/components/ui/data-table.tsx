"use client";

import { type TableOptions, useReactTable } from "@tanstack/react-table";
import React, { useContext } from "react";
import { Table } from "./table";

interface IDataTableContext<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
}

export const DataTableContext =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.createContext<IDataTableContext<any> | null>(null);

interface DataTableProviderProps<TData> {
  tableOptions: TableOptions<TData>;
  children: React.ReactNode;
}

export function DataTableProvider<TData>({
  tableOptions,
  children,
}: DataTableProviderProps<TData>) {
  const table = useReactTable(tableOptions);

  return (
    <DataTableContext.Provider
      value={{
        table,
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
}

export const useDataTable = () => {
  const dataTableContext = useContext(DataTableContext);

  if (!dataTableContext) {
    throw new Error("useDataTable has to be used within <DataTableProvider>");
  }

  return dataTableContext;
};

export const DataTable = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="overflow-auto">
      <div className="rounded-md border bg-background">
        <Table>{children}</Table>
      </div>
    </div>
  );
};
