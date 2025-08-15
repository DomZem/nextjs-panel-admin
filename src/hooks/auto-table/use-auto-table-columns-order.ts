import { useAutoTable } from "~/components/auto-table/providers/auto-table-provider";
import { type ZodObjectSchema } from "~/types/zod";
import { useEffect, useState } from "react";
import {
  type ColumnOrderState,
  type OnChangeFn,
  type ColumnDef,
} from "@tanstack/react-table";
import { type z } from "zod";

export interface AutoTableSetting {
  tableName: string;
  columns: { name: string; hidden: boolean }[];
  columnOrder?: string[];
}

export const useAutoTableColumnsOrder = <TSchema extends ZodObjectSchema>({
  columns,
}: {
  columns: ColumnDef<z.infer<TSchema>>[];
}) => {
  const { technicalTableName } = useAutoTable<TSchema>();

  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    const defaultOrder = columns.map((c) => c.id!);

    const selectIndex = defaultOrder.indexOf("select");
    const idIndex = defaultOrder.indexOf("id");

    // First, ensure select column is always first
    if (selectIndex > 0) {
      defaultOrder.splice(selectIndex, 1);
      defaultOrder.unshift("select");
    }

    // Then, if id column exists and is not already second, move it to second position
    if (idIndex > 1) {
      const currentIdIndex = defaultOrder.indexOf("id");
      defaultOrder.splice(currentIdIndex, 1);
      defaultOrder.splice(1, 0, "id");
    }

    return defaultOrder;
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem("tables-settings");

    if (savedSettings) {
      const settings = JSON.parse(savedSettings) as AutoTableSetting[];

      const tableSetting = settings.find(
        (s) => s.tableName === technicalTableName,
      );

      if (tableSetting?.columnOrder) {
        const missingColumns = columnOrder.filter(
          (c) => !tableSetting.columnOrder?.includes(c),
        );

        setColumnOrder([...tableSetting.columnOrder, ...missingColumns]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleColumnOrderChange: OnChangeFn<ColumnOrderState> = (
    updaterOrValue,
  ) => {
    const newOrder =
      typeof updaterOrValue === "function"
        ? updaterOrValue(columnOrder)
        : updaterOrValue;

    const savedSettings = localStorage.getItem("tables-settings");

    const settings = savedSettings
      ? (JSON.parse(savedSettings) as AutoTableSetting[])
      : [];

    let tableSetting = settings.find((s) => s.tableName === technicalTableName);

    if (!tableSetting) {
      tableSetting = {
        tableName: technicalTableName,
        columns: [],
        columnOrder: newOrder,
      };
      settings.push(tableSetting);
    } else {
      tableSetting.columnOrder = newOrder;
    }

    localStorage.setItem("tables-settings", JSON.stringify(settings));

    setColumnOrder(newOrder);
  };

  return {
    columnOrder,
    handleColumnOrderChange,
  };
};
