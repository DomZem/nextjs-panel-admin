"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import React from "react";

export const PageBreadcrumb = () => {
  const pathname = usePathname();

  const splitedPath = pathname.split("/");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {splitedPath.map((path, i) => (
          <React.Fragment key={path}>
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">{path}</BreadcrumbPage>
            </BreadcrumbItem>
            {i !== 0 && i !== splitedPath.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
