"use client";

import { Table, TableHead, TableHeader, TableRow } from "./table";
import React, { useContext, useEffect } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "./button";
import {
  flexRender,
  type TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";

interface IDataTableContext<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
}

type TableSetting = {
  tableName: string;
  columns: { name: string; hidden: boolean }[];
};

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

export const DataTableSelectColumns = ({
  tableName,
  mapColumnName,
}: {
  tableName: string;
  mapColumnName?: (name: string) => string;
}) => {
  const { table } = useDataTable();

  useEffect(() => {
    const savedSettings = localStorage.getItem("tables-settings");

    if (savedSettings) {
      const settings = JSON.parse(savedSettings) as TableSetting[];

      const tableSetting = settings.find((s) => s.tableName === tableName);

      if (tableSetting) {
        tableSetting.columns.forEach((col) => {
          const column = table.getColumn(col.name);

          if (column) {
            column.toggleVisibility(!col.hidden);
          }
        });
      }
    }
  }, [table, tableName]);

  const handleCheckedChange = (columnName: string, value: boolean) => {
    const savedSettings = localStorage.getItem("tables-settings");

    const settings = savedSettings
      ? (JSON.parse(savedSettings) as TableSetting[])
      : [];

    let tableSetting = settings.find((s) => s.tableName === tableName);

    if (!tableSetting) {
      tableSetting = { tableName, columns: [] };
      settings.push(tableSetting);
    }

    const columnSetting = tableSetting.columns.find(
      (col) => col.name === columnName,
    );

    if (columnSetting) {
      columnSetting.hidden = !value;
    } else {
      tableSetting.columns.push({ name: columnName, hidden: !value });
    }

    localStorage.setItem("tables-settings", JSON.stringify(settings));

    const column = table.getColumn(columnName);

    if (column) {
      column.toggleVisibility(value);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) =>
                  handleCheckedChange(column.id, value)
                }
              >
                {mapColumnName ? mapColumnName(column.id) : column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const DataTableHeader = () => {
  const { table } = useDataTable();

  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
};
