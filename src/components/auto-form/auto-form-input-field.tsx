import { type ControllerRenderProps, type Path } from "react-hook-form";
import { type FormInputField } from "~/utils/auto-form";
import { ImageUpload } from "../ui/image-upload-input";
import { DateTimePicker } from "../ui/datetime-picker";
import { WysiwygInput } from "../ui/wysiwyg-input";
import { type ZodObjectSchema } from "~/utils/zod";
import { type FieldConfig } from "./interface";
import { badgeVariants } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { type ChangeEvent } from "react";
import { Input } from "../ui/input";
import { type TypeOf } from "zod";
import { cn } from "~/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export const AutoFormInputField = <TSchema extends ZodObjectSchema>({
  field,
  fieldConfig,
  defaultField,
  label,
  onClear,
}: {
  field: ControllerRenderProps<TypeOf<TSchema>, Path<TypeOf<TSchema>>>;
  fieldConfig?: FieldConfig<TSchema, Path<TypeOf<TSchema>>>;
  defaultField: FormInputField;
  label: string;
  onClear: () => void;
}) => {
  const shouldShowClearButton =
    !defaultField.isRequired && fieldConfig?.type !== "image";

  return (
    <FormItem>
      {fieldConfig?.type === "checkbox" || defaultField.type === "boolean" ? (
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>{label}</FormLabel>
            </div>

            {shouldShowClearButton && (
              <ClearButton fieldName={field.name} onClear={onClear} />
            )}
          </div>
          <FormMessage data-testid={`${field.name}-error`} />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>

            {shouldShowClearButton && (
              <ClearButton fieldName={field.name} onClear={onClear} />
            )}
          </div>

          {defaultField.type === "select" ? (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={"Select the " + label} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {defaultField.options.map(({ label, value }) => (
                  <SelectItem value={value.toString()} key={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : fieldConfig?.type === "select" ? (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={"Select the " + label} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {fieldConfig.options.map(({ label, value }) => (
                  <SelectItem value={value.toString()} key={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : fieldConfig?.type === "textarea" ? (
            <FormControl>
              <Textarea className="resize-none" {...field} />
            </FormControl>
          ) : fieldConfig?.type === "wysiwyg" ? (
            <FormControl>
              <WysiwygInput value={field.value} onChange={field.onChange} />
            </FormControl>
          ) : fieldConfig?.type === "image" ? (
            <FormControl>
              <ImageUpload
                value={field.value}
                onUploadComplete={(url) => field.onChange(url)}
              />
            </FormControl>
          ) : fieldConfig?.type === "datetime" ||
            defaultField.type === "datetime" ? (
            <DateTimePicker value={field.value} onChange={field.onChange} />
          ) : (
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                type={fieldConfig?.type ?? defaultField.type}
                placeholder={fieldConfig?.placeholder}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value =
                    fieldConfig?.type === "number" ||
                    defaultField.type === "number"
                      ? Number(e.target.value)
                      : e.target.value;
                  field.onChange(value);
                }}
              />
            </FormControl>
          )}

          <FormMessage data-testid={`${field.name}-error`} />
        </>
      )}

      {fieldConfig?.description && (
        <FormDescription>{fieldConfig.description}</FormDescription>
      )}
    </FormItem>
  );
};

const ClearButton = ({
  fieldName,
  onClear,
}: {
  fieldName: string;
  onClear: () => void;
}) => {
  return (
    <button
      type="button"
      className={cn(
        "cursor-pointer",
        badgeVariants({
          variant: "default",
        }),
      )}
      onClick={onClear}
      data-testid={`clear-${fieldName}`}
    >
      Clear
    </button>
  );
};
