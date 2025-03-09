"use client";

import { useAutoTableColumnsSelect } from "~/hooks/auto-table/use-auto-table-columns-select";
import { type DetailedHTMLProps, type HTMLAttributes, useState } from "react";
import {
  CirclePlus,
  CopyX,
  ListFilter,
  RotateCw,
  Settings2,
} from "lucide-react";
import { useAutoTable } from "./providers/auto-table-provider";
import { mapDashedFieldName } from "~/utils/mappers";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export const AutoTableHeader = ({
  className,
  children,
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => {
  return (
    <header
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </header>
  );
};

export const AutoTableHeaderTitle = ({
  className,
  children,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>) => {
  return (
    <h2 className={cn("text-lg font-semibold", className)} {...props}>
      {children}
    </h2>
  );
};

export const AutoTableCreateButton = () => {
  const { setCurrentAction } = useAutoTable();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            onClick={() => setCurrentAction("CREATE")}
          >
            <CirclePlus />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create data</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const AutoTableCloseDetailsButton = () => {
  const { currentAction, setCurrentAction, setSelectedRow } = useAutoTable();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            onClick={() => {
              setCurrentAction(null);
              setSelectedRow(null);
            }}
            variant="outline"
            className={
              currentAction === "DETAILS"
                ? "bg-accent text-accent-foreground"
                : ""
            }
          >
            <CopyX />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Close selected row details</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const AutoTableRefreshButton = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refetchData } = useAutoTable();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            disabled={isRefreshing}
            onClick={async () => {
              setIsRefreshing(true);
              await refetchData();
              setIsRefreshing(false);
            }}
          >
            <RotateCw className={cn("", isRefreshing ? "animate-spin" : "")} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Refresh data</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const AutoTableSelectColumns = ({
  mapColumnName,
}: {
  mapColumnName?: (name: string) => string;
}) => {
  const { table, handleCheckedChange } = useAutoTableColumnsSelect();

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

export const AutoTableDialogFilters = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger className="lg:hidden" asChild>
        <Button variant="outline" size="icon">
          <ListFilter />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left">Filters</DialogTitle>
          <DialogDescription className="sr-only">Filters</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export const AutoTableHeaderContent = ({
  className,
  children,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div className={cn("inline-flex items-center gap-3", className)} {...props}>
      {children}
    </div>
  );
};

export const AutoTableToolbarHeader = ({ title }: { title: string }) => {
  return (
    <AutoTableHeader>
      <AutoTableHeaderTitle>{title}</AutoTableHeaderTitle>
      <AutoTableHeaderContent>
        <AutoTableRefreshButton />
        <AutoTableSelectColumns mapColumnName={mapDashedFieldName} />
        <AutoTableCloseDetailsButton />
        <AutoTableCreateButton />
      </AutoTableHeaderContent>
    </AutoTableHeader>
  );
};
