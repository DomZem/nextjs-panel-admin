"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export const PageBreadcrumb = () => {
  const pathname = usePathname();

  console.log("pathname", pathname);

  const splitedPath = pathname.split("/");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {splitedPath.map((path, i) => (
          <>
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">{path}</BreadcrumbPage>
            </BreadcrumbItem>
            {i !== 0 && i !== splitedPath.length - 1 && <BreadcrumbSeparator />}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
