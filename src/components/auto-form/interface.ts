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
  | "password"
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

export type DisUnionToRecord<T extends ZodDiscriminatedObjectSchema> = {
  [O in T["options"][number] as O["shape"][T["discriminator"]] extends z.ZodLiteral<
    infer L extends string | number | symbol
  >
    ? L
    : never]: O["shape"];
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
        // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
        [K in keyof DisUnionToRecord<TSchema>]?: {
          [Field in Exclude<
            keyof DisUnionToRecord<TSchema>[K],
            TSchema["discriminator"]
          >]?: FieldConfig<
            Extract<DisUnionToRecord<TSchema>[K], ZodObjectSchema>,
            Path<TypeOf<TSchema>>
          >;
        };
      }
    : TSchema extends ZodObjectSchema
      ? { [TKey in Path<TypeOf<TSchema>>]?: FieldConfig<TSchema, TKey> }
      : never;
}
