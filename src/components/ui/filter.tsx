import { useDebouncedState } from "~/hooks/use-debounced-state";
import { FormItem } from "./form";
import { cn } from "~/lib/utils";
import { Label } from "./label";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

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

export const FilterCardItemString = ({
  label,
  placeholder,
  value,
  onValueChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (userName: string) => void;
}) => {
  const { value: userNameValue, setValue: setUserNameValue } =
    useDebouncedState(value, 1000, onValueChange);

  return (
    <FormItem>
      <Label>{label}</Label>
      <Input
        value={userNameValue}
        onChange={(e) => setUserNameValue(e.target.value)}
        placeholder={placeholder}
      />
    </FormItem>
  );
};

// TODO: Test this fn
export const enumToSelectOptions = <T extends string>(
  e: Record<string, T>,
): { label: string; value: T }[] => {
  return Object.entries(e).map(([label, value]) => ({
    label,
    value,
  }));
};

export const FilterCardItemSelect = <T extends string>({
  label,
  placeholder,
  value,
  options,
  onValueChange,
}: {
  label: string;
  placeholder: string;
  value?: T;
  options: {
    label: string;
    value: T;
  }[];
  onValueChange: (value: T) => void;
}) => {
  console.log("FilterCardItemSelect", value, options);
  return (
    <FormItem>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ label, value }) => (
            <SelectItem value={value} key={value}>
              {label}
            </SelectItem>
          ))}
          <SelectItem value="ALL">ALL</SelectItem>
        </SelectContent>
      </Select>
    </FormItem>
  );
};
