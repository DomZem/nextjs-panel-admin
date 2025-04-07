import { type DefaultValues, type Path } from "react-hook-form";
import { type ComponentPropsWithoutRef } from "react";
import { type SelectOption } from "~/utils/auto-form";
import { type FormField } from "../ui/form";
import { type z, type TypeOf } from "zod";
import {
  type ZodDiscriminatedObjectSchema,
  type ZodObjectSchema,
} from "~/utils/zod";

type InputType =
  | "text"
  | "number"
  | "checkbox"
  | "textarea"
  | "select"
  | "image"
  | "custom"
  | "datetime"
  | "wysiwyg";

type BaseFieldConfig = {
  label?: string;
  description?: string;
  placeholder?: string;
  hidden?: true;
};

type StandardFieldConfig = BaseFieldConfig & {
  type?: Exclude<InputType, "select" | "custom">;
};

type SelectFieldConfig = BaseFieldConfig & {
  type: "select";
  options: SelectOption[];
};

type CustomFieldConfig<
  TSchema extends ZodObjectSchema,
  TKey extends Path<TypeOf<TSchema>>,
> = BaseFieldConfig & {
  type: "custom";
  render: (
    props: Parameters<
      ComponentPropsWithoutRef<
        typeof FormField<TypeOf<TSchema>, TKey>
      >["render"]
    >[0],
  ) => JSX.Element;
};

export type FieldConfig<
  TSchema extends ZodObjectSchema,
  TKey extends Path<TypeOf<TSchema>>,
> = StandardFieldConfig | SelectFieldConfig | CustomFieldConfig<TSchema, TKey>;

// Given a union U, this returns the keys that are common to every member of U.
type IntersectionKeys<U> = (
  U extends unknown ? (k: keyof U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

// Convert a discriminated union schema into a record mapping discriminant values to their object shapes.
export type DisUnionToRecord<T extends ZodDiscriminatedObjectSchema> = {
  [O in T["options"][number] as O["shape"][T["discriminator"]] extends z.ZodLiteral<
    infer L extends string | number | symbol
  >
    ? L
    : never]: O["shape"];
};

// Compute common keys to every variant (excluding the discriminator)
export type CommonFieldKeys<TSchema extends ZodDiscriminatedObjectSchema> =
  Extract<
    Exclude<
      IntersectionKeys<
        DisUnionToRecord<TSchema>[keyof DisUnionToRecord<TSchema>]
      >,
      TSchema["discriminator"]
    >,
    Path<TypeOf<TSchema>>
  >;

// Base config: configuration for keys that are common to every variant.
export type BaseConfig<TSchema extends ZodDiscriminatedObjectSchema> = {
  [K in CommonFieldKeys<TSchema>]?: FieldConfig<
    Extract<
      DisUnionToRecord<TSchema>[keyof DisUnionToRecord<TSchema>],
      ZodObjectSchema
    >,
    K
  >;
};

export type VariantConfig<TSchema extends ZodDiscriminatedObjectSchema> = {
  [V in keyof DisUnionToRecord<TSchema>]?: {
    [K in Extract<
      Exclude<keyof DisUnionToRecord<TSchema>[V], TSchema["discriminator"]>,
      Path<TypeOf<TSchema>>
    >]?: FieldConfig<Extract<DisUnionToRecord<TSchema>[V], ZodObjectSchema>, K>;
  };
};

export interface IAutoForm<
  TSchema extends ZodObjectSchema | ZodDiscriminatedObjectSchema,
> {
  schema: TSchema;
  onSubmit: (data: z.infer<TSchema>) => void;
  mapLabel?: (fieldName: string) => string;
  className?: string;
  isSubmitting?: boolean;
  defaultValues?: DefaultValues<TypeOf<TSchema>>;
  fieldsConfig?: TSchema extends ZodDiscriminatedObjectSchema
    ? {
        base?: BaseConfig<TSchema>;
        variants?: VariantConfig<TSchema>;
      }
    : TSchema extends ZodObjectSchema
      ? { [TKey in Path<TypeOf<TSchema>>]?: FieldConfig<TSchema, TKey> }
      : never;
}
