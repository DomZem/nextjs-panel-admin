import { usePage } from "~/hooks/pagination/use-page";
import { Button } from "./button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export const Pagination = ({
  totalPagesCount,
  queryByPage,
}: {
  totalPagesCount: number;
  queryByPage?: string;
}) => {
  const [page, setPage] = usePage(queryByPage);

  const isPreviousPageDisabled = page === 1;
  const isNextPageDisabled = page >= totalPagesCount;

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm font-medium">
        Page {page} of {totalPagesCount}
      </p>

      <div className="flex items-center gap-2">
        <Button
          aria-label="Go to first page"
          variant="outline"
          size="icon"
          disabled={isPreviousPageDisabled}
          onClick={() => setPage(1)}
        >
          <ChevronsLeft aria-hidden="true" />
        </Button>
        <Button
          aria-label="Go to previous page"
          variant="outline"
          size="icon"
          disabled={isPreviousPageDisabled}
          onClick={() => setPage((prev) => prev - 1)}
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button
          aria-label="Go to next page"
          variant="outline"
          size="icon"
          disabled={isNextPageDisabled}
          onClick={() => setPage((prev) => prev + 1)}
        >
          <ChevronRight aria-hidden="true" />
        </Button>
        <Button
          aria-label="Go to last page"
          variant="outline"
          size="icon"
          disabled={isNextPageDisabled}
          onClick={() => setPage(totalPagesCount)}
        >
          <ChevronsRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
