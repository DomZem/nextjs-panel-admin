"use client";

import { type DefaultValues, type Path, useForm } from "react-hook-form";
import { ImageUpload } from "../ui/image-upload-input";
import { DateTimePicker } from "../ui/datetime-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { WysiwygInput } from "../ui/wysiwyg-input";
import { type ZodObjectSchema } from "~/utils/zod";
import { badgeVariants } from "../ui/badge";
import { type TypeOf, type z } from "zod";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "~/lib/utils";
import {
  getFormFieldsDefaultValues,
  mapSchemaToFormFields,
  type SelectOption,
} from "~/utils/auto-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  type ComponentPropsWithoutRef,
  useMemo,
  type ChangeEvent,
} from "react";

type InputType =
  | "text"
  | "number"
  | "checkbox"
  | "textarea"
  | "select"
  | "password"
  | "image"
  | "custom"
  | "datetime"
  | "wysiwyg";

type BaseFieldConfig = {
  type?: Exclude<InputType, "select" | "custom">;
  label?: string;
  description?: string;
  placeholder?: string;
  hidden?: true;
};

type SelectFieldConfig = {
  type: "select";
  label?: string;
  description?: string;
  placeholder?: string;
  hidden?: true;
  options: SelectOption[];
};

type CustomFieldConfig<
  TSchema extends ZodObjectSchema,
  TKey extends Path<TypeOf<TSchema>>,
> = {
  type: "custom";
  render: (
    props: Parameters<
      ComponentPropsWithoutRef<
        typeof FormField<TypeOf<TSchema>, TKey>
      >["render"]
    >[0],
  ) => JSX.Element;
  hidden?: true;
};

type FieldConfig<
  TSchema extends ZodObjectSchema,
  TKey extends Path<TypeOf<TSchema>>,
> = BaseFieldConfig | SelectFieldConfig | CustomFieldConfig<TSchema, TKey>;

export interface AutoFormProps<TSchema extends ZodObjectSchema> {
  schema: TSchema;
  onSubmit: (data: z.infer<TSchema>) => void;
  className?: string;
  mapLabel?: (fieldName: string) => string;
  fieldsConfig?: {
    [TKey in Path<TypeOf<TSchema>>]?: FieldConfig<TSchema, TKey>;
  };
  defaultValues?: DefaultValues<TypeOf<TSchema>>;
}

export const AutoForm = <TSchema extends ZodObjectSchema>({
  schema,
  onSubmit,
  className,
  mapLabel,
  fieldsConfig,
  defaultValues,
}: AutoFormProps<TSchema>) => {
  const formFields = useMemo(() => {
    return mapSchemaToFormFields(schema);
  }, [schema]);

  const schemaDefaultValues = useMemo(() => {
    return getFormFieldsDefaultValues(formFields);
  }, [formFields]);

  const tsDefaultValues = defaultValues as DefaultValues<TypeOf<TSchema>>;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...schemaDefaultValues,
      ...tsDefaultValues,
    },
  });

  const handleClearField = (fieldName: Path<TypeOf<TSchema>>) => {
    form.setValue(
      fieldName,
      null as unknown as TypeOf<TSchema>[typeof fieldName],
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
        className={cn("flex flex-col gap-8", className)}
      >
        {Object.entries(formFields).map(([fieldName, formField]) => {
          const key = fieldName as Path<TypeOf<TSchema>>;
          const config = fieldsConfig?.[key];

          return (
            <FormField
              control={form.control}
              name={key}
              key={key}
              render={({ field, fieldState, formState }) => {
                if (config?.type === "custom") {
                  return config.render({ field, fieldState, formState });
                }

                const label =
                  config?.label ?? mapLabel?.(fieldName) ?? fieldName;

                const shouldShowClearButton =
                  !formField.isRequired &&
                  formField.type !== "datetime" &&
                  config?.type !== "datetime" &&
                  config?.type !== "image";

                return (
                  <FormItem className={cn("", config?.hidden && "hidden")}>
                    {config?.type === "checkbox" ||
                    formField.type === "boolean" ? (
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
                          <button
                            type="button"
                            className={cn(
                              "cursor-pointer",
                              badgeVariants({
                                variant: "default",
                              }),
                            )}
                            onClick={() => handleClearField(key)}
                            data-testid={`clear-${key}`}
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <FormLabel>{label}</FormLabel>

                          {shouldShowClearButton && (
                            <button
                              type="button"
                              className={cn(
                                "cursor-pointer",
                                badgeVariants({
                                  variant: "default",
                                }),
                              )}
                              onClick={() => handleClearField(key)}
                              data-testid={`clear-${key}`}
                            >
                              Clear
                            </button>
                          )}
                        </div>

                        {formField.type === "select" ? (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={"Select the " + label}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {formField.options.map(({ label, value }) => (
                                <SelectItem
                                  value={value.toString()}
                                  key={value}
                                >
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : config?.type === "select" ? (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={"Select the " + label}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {config.options.map(({ label, value }) => (
                                <SelectItem
                                  value={value.toString()}
                                  key={value}
                                >
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : config?.type === "textarea" ? (
                          <FormControl>
                            <Textarea className="resize-none" {...field} />
                          </FormControl>
                        ) : config?.type === "wysiwyg" ? (
                          <FormControl>
                            <WysiwygInput
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        ) : config?.type === "image" ? (
                          <FormControl>
                            <ImageUpload
                              value={field.value}
                              onUploadComplete={(url) => field.onChange(url)}
                            />
                          </FormControl>
                        ) : config?.type === "datetime" ||
                          formField.type === "datetime" ? (
                          <FormControl>
                            <DateTimePicker
                              modal
                              value={field.value}
                              onChange={field.onChange}
                              clearable
                            />
                          </FormControl>
                        ) : (
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              type={config?.type ?? formField.type}
                              placeholder={config?.placeholder}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const value =
                                  config?.type === "number" ||
                                  formField.type === "number"
                                    ? Number(e.target.value)
                                    : e.target.value;
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                        )}

                        <FormMessage />
                      </>
                    )}

                    {config?.description && (
                      <FormDescription>{config.description}</FormDescription>
                    )}
                  </FormItem>
                );
              }}
            />
          );
        })}

        <Button className="w-fit" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};
