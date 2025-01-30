import { cn } from "~/lib/utils";

export const FilterCard = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative rounded-md border p-3">
      <div className="absolute left-3 top-0 -translate-y-1/2 bg-background px-1">
        <p className="text-xs font-medium">Filters</p>
      </div>
      <div className={cn("grid gap-4 md:grid-cols-3", className)}>
        {children}
      </div>
    </div>
  );
};
