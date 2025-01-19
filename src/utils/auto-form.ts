import {
  type EnumLike,
  ZodBoolean,
  ZodDate,
  ZodDefault,
  ZodEffects,
  ZodEnum,
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
  type ZodObjectInfer,
  type ZodObjectSchema,
} from "./zod";

export type SelectOption = { label: string; value: string };

export type FormInputFieldType =
  | "string"
  | "number"
  | "date"
  | "boolean"
  | "select";

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

export const getFieldType = (field: ZodTypeAny): FormInputFieldType => {
  const baseField = getBaseField(field); // Get the actual base type

  if (baseField instanceof ZodNumber) return "number";
  if (baseField instanceof ZodDate) return "date";
  if (baseField instanceof ZodBoolean) return "boolean";
  if (baseField instanceof ZodString) return "string";
  if (baseField instanceof ZodNativeEnum || baseField instanceof ZodEnum)
    return "select";

  throw new Error("Unsupported field type");
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

export const getFormFieldsDefaultValues = (
  formFields: ReturnType<typeof mapSchemaToFormFields>,
): Record<string, false | 0 | ""> => {
  const result = Object.keys(formFields).reduce((acc, fieldName) => {
    const field = formFields[fieldName];

    if (!field) return acc;

    const fieldValue =
      field.type === "boolean"
        ? false
        : field.type === "number"
          ? 0
          : field.type === "date"
            ? new Date()
            : "";

    return {
      ...acc,
      [fieldName]: fieldValue,
    };
  }, {});

  return result;
};

export const sanitizeSchemaObject = (
  schemaObject: ZodObjectInfer<ZodObjectSchema>,
  destinySchema: ZodObjectSchema,
) => {
  const schemaKeys = Object.keys(schemaObject);
  const destinySchemaKeys = extractFieldNamesFromSchema(destinySchema);

  const filteredKeys = schemaKeys.filter((field) =>
    destinySchemaKeys.includes(field),
  );

  const newObject = filteredKeys.reduce((acc, field) => {
    return {
      ...acc,
      [field]: schemaObject[field] as unknown,
    };
  }, {});

  return newObject;
};
