import { type DetailedHTMLProps, type HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

export const DetailsList = ({
  className,
  children,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDListElement>, HTMLDListElement>) => {
  return (
    <dl
      className={cn("divide-card-foreground/20 divide-y", className)}
      {...props}
    >
      {children}
    </dl>
  );
};

export const DetailsListItem = ({
  name,
  value,
}: {
  name: string;
  value?: string | number | boolean | null;
}) => {
  return (
    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm/6 font-medium">{name}</dt>
      <dd className="text-sm/6 sm:col-span-2">{value ?? "N/A"}</dd>
    </div>
  );
};
