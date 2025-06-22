import { useAutoTableDetailsData } from "./providers/auto-table-details-data-provider";
import { useAutoTable } from "./providers/auto-table-provider";
import { TableCell, TableRow } from "../ui/table";
import { useDataTable } from "../ui/data-table";
import { LoaderCircle } from "lucide-react";
import React, { useMemo } from "react";

export const AutoTableDetailsRow = ({ rowId }: { rowId: string | number }) => {
  const { detailsData, renderDetails } = useAutoTableDetailsData();
  const { selectedRow, currentAction } = useAutoTable();
  const { table } = useDataTable();

  const columnsLength = useMemo(() => table.getAllColumns().length, [table]);

  if (!selectedRow || currentAction !== "DETAILS") {
    return null;
  }

  if (selectedRow.id !== rowId) {
    return null;
  }

  return (
    <TableRow className="relative w-screen" data-state="selected">
      <TableCell className="py-4" colSpan={columnsLength}>
        {!detailsData ? (
          <div className="flex h-96 items-center justify-center">
            <LoaderCircle className="animate-spin" />
          </div>
        ) : (
          renderDetails(detailsData)
        )}
      </TableCell>
    </TableRow>
  );
};
