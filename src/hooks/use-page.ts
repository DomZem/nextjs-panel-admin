import { parseAsInteger, useQueryState } from "nuqs";

export const usePage = (queryBy?: string) => {
  return useQueryState(queryBy ?? "page", parseAsInteger.withDefault(1));
};
