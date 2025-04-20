import { useAutoTable } from "~/components/auto-table/providers/auto-table-provider";
import { type AutoTableSetting } from "./use-auto-table-columns-order";
import { useDataTable } from "~/components/ui/data-table";
import { type ZodObjectSchema } from "~/types/zod";
import { useEffect } from "react";

export const useAutoTableColumnsSelect = <
  TSchema extends ZodObjectSchema,
>() => {
  const { technicalTableName } = useAutoTable<TSchema>();
  const { table } = useDataTable();

  useEffect(() => {
    const savedSettings = localStorage.getItem("tables-settings");

    if (savedSettings) {
      const settings = JSON.parse(savedSettings) as AutoTableSetting[];

      const tableSetting = settings.find(
        (s) => s.tableName === technicalTableName,
      );

      if (tableSetting) {
        tableSetting.columns.forEach((col) => {
          const column = table.getColumn(col.name);

          if (column) {
            column.toggleVisibility(!col.hidden);
          }
        });
      }
    }
  }, [table, technicalTableName]);

  const handleCheckedChange = (columnName: string, value: boolean) => {
    const savedSettings = localStorage.getItem("tables-settings");

    const settings = savedSettings
      ? (JSON.parse(savedSettings) as AutoTableSetting[])
      : [];

    let tableSetting = settings.find((s) => s.tableName === technicalTableName);

    if (!tableSetting) {
      tableSetting = { tableName: technicalTableName, columns: [] };
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

  return {
    table,
    handleCheckedChange,
  };
};
