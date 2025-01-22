import { useRowsPerPage } from "~/hooks/use-rows-per-page";
import { Pagination } from "../ui/pagination";
import { type ComponentProps } from "react";
import { usePage } from "~/hooks/use-page";
import { cn } from "~/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const defaultPageSizeOptions = [10, 20, 30, 40, 50];

export const AutoTablePagination = ({
  className,
  totalPagesCount,
  pageSizeOptions,
  ...props
}: {
  pageSizeOptions?: number[];
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  ComponentProps<typeof Pagination>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setPage] = usePage();
  const [rowsPerPage, setRowsPerPage] = useRowsPerPage();

  return (
    <div className={cn("flex justify-end", className)} {...props}>
      <div className="flex items-center gap-6">
        <RowsPerPageSelect
          pageSizeOptions={pageSizeOptions ?? defaultPageSizeOptions}
          value={rowsPerPage.toString()}
          onChange={async (v) => {
            await setPage(1);
            await setRowsPerPage(parseInt(v, 10));
          }}
        />
        <Pagination totalPagesCount={totalPagesCount} />
      </div>
    </div>
  );
};

const RowsPerPageSelect = ({
  value,
  onChange,
  pageSizeOptions,
}: {
  value: string;
  onChange: (value: string) => void;
  pageSizeOptions: number[];
}) => {
  return (
    <div className="flex items-center space-x-2">
      <p className="whitespace-nowrap text-sm font-medium">Rows per page</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[4.5rem]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent side="top">
          {pageSizeOptions.map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
