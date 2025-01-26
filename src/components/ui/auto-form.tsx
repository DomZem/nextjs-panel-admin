"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type TypeOf, type z } from "zod";
import { cn } from "~/lib/utils";
import { type DefaultValues, type Path, useForm } from "react-hook-form";
import {
  type ComponentPropsWithoutRef,
  useMemo,
  type ChangeEvent,
} from "react";
import { type ZodObjectSchema } from "~/utils/zod";
import {
  getFormFieldsDefaultValues,
  mapSchemaToFormFields,
  type SelectOption,
} from "~/utils/auto-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Textarea } from "./textarea";
import { Input } from "./input";
import { Button } from "./button";
import { ImageUpload } from "./image-upload-input";
import { Checkbox } from "./checkbox";
import { DateTimePicker } from "./datetime-picker";

type InputType =
  | "text"
  | "number"
  | "checkbox"
  | "textarea"
  | "select"
  | "password"
  | "image"
  | "custom"
  | "datetime";

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

interface CustomFieldConfig {
  type: "custom";
  render: ComponentPropsWithoutRef<typeof FormField>["render"];
  hidden?: true;
}

type FieldConfig = BaseFieldConfig | SelectFieldConfig | CustomFieldConfig;

export interface AutoFormProps<TSchema extends ZodObjectSchema> {
  schema: TSchema;
  onSubmit: (data: z.infer<TSchema>) => void;
  className?: string;
  mapLabel?: (fieldName: string) => string;
  fieldsConfig?: Partial<Record<keyof z.infer<TSchema>, FieldConfig>>;
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-8", className)}
      >
        {Object.entries(formFields).map(([fieldName, formField]) => {
          const config = fieldsConfig?.[fieldName];

          return (
            <FormField
              control={form.control}
              name={fieldName as Path<TypeOf<TSchema>>}
              key={fieldName}
              render={({ field, fieldState, formState }) => {
                if (config?.type === "custom") {
                  return config.render({ field, fieldState, formState });
                }

                const label =
                  config?.label ?? mapLabel?.(fieldName) ?? fieldName;

                return (
                  <FormItem className={cn("", config?.hidden && "hidden")}>
                    {config?.type === "checkbox" ||
                    formField.type === "boolean" ? (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>{label}</FormLabel>
                      </div>
                    ) : (
                      <>
                        <FormLabel>{label}</FormLabel>

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
                        ) : config?.type === "image" ? (
                          <FormControl>
                            {/* TODO: ADD default value */}
                            <ImageUpload
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
                              type={config?.type ?? formField.type}
                              placeholder={config?.placeholder}
                              {...field}
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
