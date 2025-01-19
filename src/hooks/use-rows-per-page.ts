import { parseAsInteger, useQueryState } from "nuqs";

export const useRowsPerPage = (queryBy?: string) => {
  return useQueryState(
    queryBy ?? "rowsPerPage",
    parseAsInteger.withDefault(10),
  );
};
