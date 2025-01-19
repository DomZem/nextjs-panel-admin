import { type DetailedHTMLProps, type HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

export const MainWrapper = ({
  children,
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => {
  return (
    <main
      className={cn(
        "flex flex-1 flex-col gap-4 overflow-hidden p-4",
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
};
