"use client";

import { mapDiscriminatedUnionToFormFields } from "~/utils/auto-form";
import { type ZodDiscriminatedObjectSchema } from "~/utils/zod";
import { AutoFormInputField } from "./auto-form-input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Path, useForm } from "react-hook-form";
import { type IAutoForm } from "./interface";
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
  const mappedSchema = useMemo(() => {
    return mapDiscriminatedUnionToFormFields(schema);
  }, [schema]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const selectedVariant = form.watch(
    mappedSchema.discriminator as Path<TypeOf<TSchema>>,
  );

  const mappedFormVariant = mappedSchema.variants.find(
    (v) => v.key === selectedVariant,
  );

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
              <FormLabel>{mappedSchema.discriminator}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={mappedSchema.discriminator} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mappedSchema.variants.map(({ key }) => (
                    <SelectItem value={key} key={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of {mappedSchema.discriminator} to display
                specific input fields
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {mappedFormVariant &&
          Object.entries(mappedFormVariant.fields)
            .filter(([fieldName]) => fieldName !== schema.discriminator)
            .map(([fieldName, formField]) => {
              const key = fieldName as Path<TypeOf<TSchema>>;

              const overallConfig =
                fieldsConfig && selectedVariant
                  ? fieldsConfig[selectedVariant]
                  : null;

              const label: string =
                overallConfig?.[key]?.label ?? mapLabel?.(key) ?? key;

              if (overallConfig && overallConfig[key]?.hidden) {
                return null;
              }

              return (
                <FormField
                  control={form.control}
                  name={key}
                  key={key}
                  render={({ field, fieldState, formState }) => {
                    if (
                      overallConfig &&
                      overallConfig[key]?.type === "custom"
                    ) {
                      return overallConfig[key].render({
                        field,
                        fieldState,
                        formState,
                      });
                    }

                    return (
                      <AutoFormInputField
                        defaultField={formField}
                        fieldConfig={overallConfig?.[key]}
                        field={field}
                        label={label}
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
