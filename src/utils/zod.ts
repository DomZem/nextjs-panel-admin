import {
  type z,
  ZodDiscriminatedUnion,
  ZodEffects,
  ZodObject,
  type ZodRawShape,
} from "zod";

export type ZodObjectSchema =
  | ZodObject<ZodRawShape>
  | ZodEffects<ZodObject<ZodRawShape>>;

export type ZodDiscriminatedObjectSchema = ZodDiscriminatedUnion<
  string,
  ZodObject<ZodRawShape>[]
>;

export type ZodObjectInfer<TSchema extends ZodObjectSchema> = z.infer<TSchema>;

type StringOrNumberKeyOnly<T> = {
  [K in keyof T]: T[K] extends string | number
    ? T[K] extends boolean | Date | undefined
      ? never
      : K
    : never;
}[keyof T];

export type ZodObjectSchemaIdentifierKey<TSchema extends ZodObjectSchema> =
  Extract<StringOrNumberKeyOnly<ZodObjectInfer<TSchema>>, string>;

export const extractFieldNamesFromSchema = <
  TSchema extends ZodObjectSchema | ZodDiscriminatedObjectSchema,
>(
  schema: TSchema,
): (keyof z.infer<TSchema>)[] => {
  const baseSchema = schema instanceof ZodEffects ? schema._def.schema : schema;

  if (baseSchema instanceof ZodDiscriminatedUnion) {
    const schemas = baseSchema._def.options;
    const fieldNames = schemas.map((s) => {
      if (s instanceof ZodObject) {
        return Object.keys(s.shape);
      }
      return [];
    });

    return fieldNames.flat();
  }

  if (baseSchema instanceof ZodObject) {
    const shape = baseSchema.shape;
    const fieldNames = Object.keys(shape);
    return fieldNames;
  }

  throw new Error("Unsupported schema type");
};
