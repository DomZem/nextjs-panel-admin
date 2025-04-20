import {
  type z,
  type ZodDiscriminatedUnion,
  type ZodEffects,
  type ZodObject,
  type ZodRawShape,
} from "zod";

export type ZodObjectSchema =
  | ZodObject<ZodRawShape>
  | ZodEffects<ZodObject<ZodRawShape>>;

export type ZodDiscriminatedObjectSchema = ZodDiscriminatedUnion<
  string,
  ZodObject<ZodRawShape>[]
>;

type StringOrNumberKeyOnly<T extends object> = {
  [K in keyof T]: T[K] extends string | number ? K : never;
}[keyof T];

export type ZodObjectSchemaIdentifierKey<TSchema extends ZodObjectSchema> =
  Extract<StringOrNumberKeyOnly<z.infer<TSchema>>, string>;
