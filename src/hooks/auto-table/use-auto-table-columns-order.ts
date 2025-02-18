import { useAutoTable } from "~/components/auto-table/providers/auto-table-provider";
import { type ZodObjectInfer, type ZodObjectSchema } from "~/utils/zod";
import { useEffect, useState } from "react";
import {
  type ColumnOrderState,
  type OnChangeFn,
  type ColumnDef,
} from "@tanstack/react-table";

export interface AutoTableSetting {
  tableName: string;
  columns: { name: string; hidden: boolean }[];
  columnOrder?: string[];
}

export const useAutoTableColumnsOrder = <TSchema extends ZodObjectSchema>({
  columns,
}: {
  columns: ColumnDef<ZodObjectInfer<TSchema>>[];
}) => {
  const { technicalTableName } = useAutoTable<TSchema>();

  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    const defaultOrder = columns.map((c) => c.id!);
    const idIndex = defaultOrder.indexOf("id");
    if (idIndex > 0) {
      defaultOrder.splice(idIndex, 1);
      defaultOrder.unshift("id");
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
        setColumnOrder(tableSetting.columnOrder);
      }
    }
  }, [technicalTableName]);

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
