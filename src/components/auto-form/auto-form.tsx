"use client";

import { type DefaultValues, type Path, useForm } from "react-hook-form";
import { AutoFormInputField } from "./auto-form-input-field";
import { type IAutoForm } from "../../types/auto-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ZodObjectSchema } from "~/utils/zod";
import { Form, FormField } from "../ui/form";
import { type TypeOf, type z } from "zod";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { useMemo } from "react";
import {
  getFormFieldsDefaultValues,
  mapSchemaToFormFields,
} from "~/utils/auto-form";

export const AutoForm = <TSchema extends ZodObjectSchema>({
  schema,
  onSubmit,
  className,
  mapLabel,
  fieldsConfig,
  isSubmitting,
  defaultValues,
}: IAutoForm<TSchema>) => {
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
        {Object.entries(formFields).map(([fName, formField]) => {
          const fieldName = fName as Path<TypeOf<TSchema>>;
          const config = fieldsConfig?.[fieldName];

          if (config?.hidden) {
            return null;
          }

          return (
            <FormField
              control={form.control}
              name={fieldName}
              key={fieldName}
              render={({ field, fieldState, formState }) => {
                if (config?.type === "custom") {
                  return config.render({ field, fieldState, formState });
                }

                const label =
                  config?.label ?? mapLabel?.(fieldName) ?? fieldName;

                return (
                  <AutoFormInputField
                    label={label}
                    field={field}
                    defaultField={formField}
                    fieldConfig={config}
                    onClear={() => clearField(field.name)}
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
