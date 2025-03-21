import { type z, ZodEffects, ZodObject, type ZodRawShape } from "zod";

export type ZodObjectSchema =
  | ZodObject<ZodRawShape>
  | ZodEffects<ZodObject<ZodRawShape>>;

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

export const extractFieldNamesFromSchema = <TSchema extends ZodObjectSchema>(
  schema: TSchema,
): (keyof ZodObjectInfer<TSchema>)[] => {
  const baseSchema = schema instanceof ZodEffects ? schema._def.schema : schema;

  if (!(baseSchema instanceof ZodObject)) {
    throw new Error("Schema must be an instance of ZodObject");
  }

  const shape = baseSchema.shape;
  const fieldNames = Object.keys(shape);

  return fieldNames;
};
