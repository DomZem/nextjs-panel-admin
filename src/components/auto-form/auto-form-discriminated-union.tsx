"use client";

import { mapDiscriminatedUnionToFormFields } from "~/utils/auto-form";
import { type ZodDiscriminatedObjectSchema } from "~/utils/zod";
import { AutoFormInputField } from "./auto-form-input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Path, useForm } from "react-hook-form";
import { type TypeOf, type z } from "zod";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  type FieldConfig,
  type ZodDiscriminatorKeys,
  type IAutoForm,
} from "./interface";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export const AutoFormDiscriminatedUnion = <
  TSchema extends ZodDiscriminatedObjectSchema,
>({
  schema,
  className,
  onSubmit,
  isSubmitting,
  mapLabel,
  fieldsConfig,
  defaultValues,
}: IAutoForm<TSchema>) => {
  const discriminatedFields = useMemo(() => {
    return mapDiscriminatedUnionToFormFields(schema);
  }, [schema]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const selectedDiscriminator = form.watch(
    schema.discriminator as Path<TypeOf<TSchema>>,
  );

  const selectedFormConfig = discriminatedFields[selectedDiscriminator];

  const clearField = (fieldName: Path<TypeOf<TSchema>>) => {
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
        <FormField
          control={form.control}
          name={schema.discriminator as Path<TypeOf<TSchema>>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{schema.discriminator}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={schema.discriminator} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(discriminatedFields).map(([disKey]) => (
                    <SelectItem value={disKey} key={disKey}>
                      {disKey}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of {schema.discriminator} to display specific
                input fields
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedFormConfig &&
          Object.entries(selectedFormConfig)
            .filter(([fieldName]) => fieldName !== schema.discriminator)
            .map(([fieldName, formField]) => {
              const key = fieldName as Path<TypeOf<TSchema>>;
              const selectedDiscriminatorKey =
                selectedDiscriminator as ZodDiscriminatorKeys<TSchema>;

              const commonFieldConfig = fieldsConfig?.base?.[key];

              const variantFields =
                fieldsConfig?.variants?.[selectedDiscriminatorKey] ?? {};

              const specificFieldConfig = (
                variantFields as Record<
                  string,
                  FieldConfig<TSchema, Path<z.infer<TSchema>>>
                >
              )[fieldName];

              const label =
                specificFieldConfig?.label ??
                commonFieldConfig?.label ??
                mapLabel?.(fieldName) ??
                fieldName;

              if (specificFieldConfig?.hidden || commonFieldConfig?.hidden) {
                return null;
              }

              return (
                <FormField
                  control={form.control}
                  name={key}
                  key={key}
                  render={({ field, fieldState, formState }) => {
                    if (commonFieldConfig?.type === "custom") {
                      return commonFieldConfig.render({
                        field,
                        fieldState,
                        formState,
                      });
                    }

                    if (specificFieldConfig?.type === "custom") {
                      return specificFieldConfig.render({
                        field,
                        fieldState,
                        formState,
                      });
                    }

                    return (
                      <AutoFormInputField
                        defaultField={formField}
                        field={field}
                        label={label}
                        fieldConfig={commonFieldConfig}
                        onClear={() => clearField(key)}
                      />
                    );
                  }}
                />
              );
            })}

        <Button className="w-fit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
