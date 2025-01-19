"use client";

import { CirclePlus, CopyX, RotateCw } from "lucide-react";
import { useAutoTable } from "./auto-table-context";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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
  const { handleRefetchData } = useAutoTable();

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
              await handleRefetchData();
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
