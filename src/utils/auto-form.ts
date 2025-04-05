import {
  type EnumLike,
  type z,
  ZodBoolean,
  ZodDate,
  ZodDefault,
  ZodEffects,
  ZodEnum,
  ZodLiteral,
  ZodNativeEnum,
  ZodNullable,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodString,
  type ZodTypeAny,
} from "zod";
import {
  extractFieldNamesFromSchema,
  type ZodDiscriminatedObjectSchema,
  type ZodObjectSchema,
} from "./zod";

export type SelectOption = { label: string; value: string };

export type FormInputFieldType =
  | "string"
  | "number"
  | "boolean"
  | "select"
  | "datetime";

export type FormInputField =
  | {
      type: Exclude<FormInputFieldType, "select">;
      isRequired: boolean;
    }
  | {
      type: "select";
      isRequired: boolean;
      options: SelectOption[];
    };

// Recursive function to unwrap the underlying type
const getBaseField = (field: ZodTypeAny): ZodTypeAny => {
  if (
    field instanceof ZodOptional ||
    field instanceof ZodNullable ||
    field instanceof ZodDefault
  ) {
    return getBaseField(field._def.innerType as ZodTypeAny);
  } else if (field instanceof ZodEffects) {
    return getBaseField(field._def.schema as ZodTypeAny);
  }

  return field;
};

// Tested in mapSchemaToFormFields
export const getFieldType = (field: ZodTypeAny): FormInputFieldType => {
  const baseField = getBaseField(field); // Get the actual base type

  if (baseField instanceof ZodNumber) return "number";
  if (baseField instanceof ZodDate) return "datetime";
  if (baseField instanceof ZodBoolean) return "boolean";
  if (baseField instanceof ZodString) return "string";
  if (baseField instanceof ZodNativeEnum || baseField instanceof ZodEnum)
    return "select";
  if (baseField instanceof ZodLiteral) return "string";

  throw new Error("Unsupported field type");
};

// Tested in mapSchemaToFormFields
const getEnumOptions = (
  field: ZodTypeAny,
  isRequired: boolean,
): SelectOption[] => {
  const enumField = (
    isRequired ? field : getBaseField(field)
  ) as ZodNativeEnum<EnumLike>;

  const options = Object.entries(enumField._def.values).map(([_, value]) => {
    const stringValue = value.toString();

    return {
      label: stringValue,
      value: stringValue,
    };
  });

  return options;
};

export const mapDiscriminatedUnionToFormFields = (
  schema: ZodDiscriminatedObjectSchema,
): {
  discriminator: string;
  variants: {
    key: string;
    fields: Record<string, FormInputField>;
  }[];
} => {
  const variants: {
    key: string;
    fields: Record<string, FormInputField>;
  }[] = [];

  schema.optionsMap.forEach((schema, key) => {
    const fields = mapSchemaToFormFields(schema);

    variants.push({
      key: key!.toString(),
      fields,
    });
  });

  return {
    discriminator: schema._def.discriminator,
    variants,
  };
};

export const mapSchemaToFormFields = (
  schema: ZodObjectSchema,
): Record<string, FormInputField> => {
  const result: Record<string, FormInputField> = {};

  // Extract the base schema if wrapped in ZodEffects.
  // ZodEffects ocurs when using .refine() or .transform() methods on the field. ;P
  const baseSchema = schema instanceof ZodEffects ? schema._def.schema : schema;

  if (!(baseSchema instanceof ZodObject)) {
    throw new Error("Unsupported schema type");
  }

  const shape = baseSchema.shape;

  for (const key in shape) {
    const field = shape[key]!;
    const type = getFieldType(field);

    const isRequired = !(
      field instanceof ZodOptional || field instanceof ZodNullable
    );

    if (type === "select") {
      const options = getEnumOptions(field, isRequired);
      result[key] = { type, isRequired, options };
    } else {
      result[key] = { type, isRequired };
    }
  }

  return result;
};

export const getFormFieldsDefaultValues = (
  formFields: ReturnType<typeof mapSchemaToFormFields>,
): Record<string, undefined> => {
  const result = Object.keys(formFields).reduce((acc, fieldName) => {
    const field = formFields[fieldName];

    if (!field) return acc;

    return {
      ...acc,
      [fieldName]: undefined,
    };
  }, {});

  return result;
};

export const sanitizeSchemaObject = (
  schemaObject: z.infer<ZodObjectSchema>,
  destinySchema: ZodObjectSchema | ZodDiscriminatedObjectSchema,
) => {
  const schemaKeys = Object.keys(schemaObject);
  const destinySchemaKeys = extractFieldNamesFromSchema(destinySchema);

  const filteredKeys = schemaKeys.filter((field) =>
    destinySchemaKeys.includes(field),
  );

  const newObject = filteredKeys.reduce((acc, field) => {
    return {
      ...acc,
      [field]:
        schemaObject[field] === null
          ? undefined
          : (schemaObject[field] as unknown),
    };
  }, {});

  return newObject;
};
