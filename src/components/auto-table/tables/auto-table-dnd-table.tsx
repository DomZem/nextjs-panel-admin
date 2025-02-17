"use client";

import {
  type Cell,
  flexRender,
  type Header,
  type Row,
} from "@tanstack/react-table";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { DataTable, useDataTable } from "../../ui/data-table";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";
import { GripVertical } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { type CSSProperties } from "react";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import React from "react";

export const AutoTableDndTable = ({
  extraRow,
}: {
  extraRow?: (row: Row<unknown>) => React.ReactNode;
}) => {
  const { table } = useDataTable();

  const columnOrder = table.getState().columnOrder;
  const columnsLength = table.getAllColumns().length;

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      table.setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <ScrollArea className="flex-1">
        <DataTable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map((header) => (
                    <DraggableTableHeader key={header.id} header={header} />
                  ))}
                </SortableContext>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <SortableContext
                        key={cell.id}
                        items={columnOrder}
                        strategy={horizontalListSortingStrategy}
                      >
                        <DragAlongCell key={cell.id} cell={cell} />
                      </SortableContext>
                    ))}
                  </TableRow>
                  {extraRow?.(row)}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnsLength} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </DataTable>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </DndContext>
  );
};

const DraggableTableHeader = ({
  header,
}: {
  header: Header<unknown, unknown>;
}) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableHead colSpan={header.colSpan} ref={setNodeRef} style={style}>
      <div className="flex items-center gap-2">
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}

        <button {...attributes} {...listeners}>
          <GripVertical size={20} />
        </button>
      </div>
    </TableHead>
  );
};

const DragAlongCell = ({ cell }: { cell: Cell<unknown, unknown> }) => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableCell style={style} ref={setNodeRef}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};
