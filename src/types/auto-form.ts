/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import { type ZodDiscriminatedObjectSchema, type ZodObjectSchema } from "./zod";
import { type SelectOption } from "~/utils/auto-form";
import { type z, type TypeOf } from "zod";
import {
  type ControllerFieldState,
  type ControllerRenderProps,
  type UseFormStateReturn,
  type DefaultValues,
  type Path,
} from "react-hook-form";

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
  TSchema extends ZodObjectSchema | ZodDiscriminatedObjectSchema,
  FKey extends keyof z.infer<TSchema>,
> = BaseFieldConfig & {
  type: "custom";
  render: ({}: {
    field: ControllerRenderProps<
      z.infer<TSchema>,
      FKey extends Path<z.infer<TSchema>> ? FKey : never
    >;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<z.infer<TSchema>>;
  }) => React.ReactElement;
};

export type FieldConfig<
  TSchema extends ZodObjectSchema | ZodDiscriminatedObjectSchema,
  FKey extends keyof z.infer<TSchema>,
> = StandardFieldConfig | SelectFieldConfig | CustomFieldConfig<TSchema, FKey>;

export type ZodDiscriminatorKeys<TSchema extends ZodDiscriminatedObjectSchema> =
  z.infer<TSchema>[TSchema["discriminator"]];

export type DiscriminatorVariantEntry<
  TSchema extends ZodDiscriminatedObjectSchema,
  DiscriminatorKey extends ZodDiscriminatorKeys<TSchema>,
> = Extract<
  z.infer<TSchema>,
  { [D in TSchema["discriminator"]]: DiscriminatorKey }
>;

type AutoFormFieldsConfig<
  TSchema extends ZodObjectSchema | ZodDiscriminatedObjectSchema,
> = TSchema extends ZodDiscriminatedObjectSchema
  ? {
      base?: {
        [FKey in keyof z.infer<TSchema>]?: FieldConfig<TSchema, FKey>;
      };
      discriminator?: {
        [DisKey in ZodDiscriminatorKeys<TSchema>]?: {
          label?: string;
          description?: string;
        };
      };
      variants?: {
        [DisKey in ZodDiscriminatorKeys<TSchema>]?: {
          [FKey in keyof Omit<
            DiscriminatorVariantEntry<TSchema, DisKey>,
            TSchema["discriminator"]
          >]?: FieldConfig<TSchema, FKey>;
        };
      };
    }
  : TSchema extends ZodObjectSchema
    ? {
        [FKey in keyof z.infer<TSchema>]?: FieldConfig<TSchema, FKey>;
      }
    : never;

export interface IAutoForm<
  TSchema extends ZodObjectSchema | ZodDiscriminatedObjectSchema,
> {
  schema: TSchema;
  onSubmit: (data: z.infer<TSchema>) => void;
  mapLabel?: (fieldName: string) => string;
  className?: string;
  isSubmitting?: boolean;
  defaultValues?: DefaultValues<TypeOf<TSchema>>;
  fieldsConfig?: AutoFormFieldsConfig<TSchema>;
}
