import { UserRole } from "@prisma/client";
import {
  getFormFieldsDefaultValues,
  mapSchemaToFormFields,
  sanitizeSchemaObject,
} from "./auto-form";
import { z } from "zod";

describe("auto-form utilities", () => {
  describe("mapSchemaToFormFields", () => {
    it("should map schema to form fields correctly", () => {
      const userSchema = z.object({
        name: z.string(),
        age: z.number(),
        is_streamer: z.boolean(),
        date_of_birth: z.date(),
        description: z.string(),
      });

      const result = mapSchemaToFormFields(userSchema);

      expect(result).toEqual({
        name: { type: "string", isRequired: true },
        age: { type: "number", isRequired: true },
        is_streamer: { type: "boolean", isRequired: true },
        date_of_birth: { type: "datetime", isRequired: true },
        description: { type: "string", isRequired: true },
      });
    });

    it("should handle optional and nullable fields", () => {
      enum UserRole {
        Admin = "admin",
        User = "user",
      }

      const userSchema = z.object({
        name: z.string().optional(),
        age: z.number().nullable(),
        role: z.nativeEnum(UserRole).optional(),
        status: z.enum(["active", "inactive"]).nullable(),
      });

      const result = mapSchemaToFormFields(userSchema);

      expect(result).toEqual({
        name: { type: "string", isRequired: false },
        age: { type: "number", isRequired: false },
        role: {
          type: "select",
          isRequired: false,
          options: [
            { label: "admin", value: "admin" },
            { label: "user", value: "user" },
          ],
        },
        status: {
          type: "select",
          isRequired: false,
          options: [
            { label: "active", value: "active" },
            { label: "inactive", value: "inactive" },
          ],
        },
      });
    });

    it("should handle enum fields", () => {
      const schema = z.object({
        status: z.enum(["active", "inactive"]),
      });

      const result = mapSchemaToFormFields(schema);

      expect(result).toEqual({
        status: {
          type: "select",
          isRequired: true,
          options: [
            { label: "active", value: "active" },
            { label: "inactive", value: "inactive" },
          ],
        },
      });
    });

    it("should handle native enum fields", () => {
      enum UserRole {
        Admin = "admin",
        User = "user",
      }

      const userSchema = z.object({
        role: z.nativeEnum(UserRole),
      });

      const result = mapSchemaToFormFields(userSchema);

      expect(result).toEqual({
        role: {
          type: "select",
          isRequired: true,
          options: [
            { label: "admin", value: "admin" },
            { label: "user", value: "user" },
          ],
        },
      });
    });

    it("should throw an error for unsupported schema types", () => {
      const schema = z.string();

      expect(() => mapSchemaToFormFields(schema)).toThrow(
        "Unsupported schema type",
      );
    });

    it("it should handle refine for field", () => {
      const userSchema = z.object({
        firstName: z.string(),
        lastName: z.string(),
        age: z
          .number()
          .positive()
          .refine((age) => age < 100, {
            message: "Age must be less than 100",
            path: ["age"],
          })
          .optional(),
      });

      const result = mapSchemaToFormFields(userSchema);

      expect(result).toEqual({
        firstName: { type: "string", isRequired: true },
        lastName: { type: "string", isRequired: true },
        age: {
          type: "number",
          isRequired: false,
        },
      });
    });

    it("should handle superRefine for schema", () => {
      const registerSchema = z
        .object({
          firstName: z.string(),
          lastName: z.string().optional(),
          password: z.string().min(6),
          confirmPassword: z.string().min(6),
        })
        .superRefine((data, ctx) => {
          if (data.password !== data.confirmPassword) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Passwords do not match",
            });
          }
        });

      const result = mapSchemaToFormFields(registerSchema);

      expect(result).toEqual({
        firstName: { type: "string", isRequired: true },
        lastName: { type: "string", isRequired: false },
        password: { type: "string", isRequired: true },
        confirmPassword: { type: "string", isRequired: true },
      });
    });

    it("should throw an error for nested schema", () => {
      const userSchema = z.object({
        name: z.string(),
        address: z.object({
          street: z.string(),
          city: z.string(),
        }),
      });

      expect(() => mapSchemaToFormFields(userSchema)).toThrow(
        "Unsupported field type",
      );
    });
  });

  describe("getFormFieldsDefaultValues", () => {
    it("should return default values for form fields", () => {
      const userForm = z.object({
        name: z.string(),
        age: z.number(),
        is_streamer: z.boolean().optional(),
        date_of_birth: z.date().nullable(),
        description: z.string().optional(),
        role: z.nativeEnum(UserRole),
      });

      const userFormFields = mapSchemaToFormFields(userForm);

      const result = getFormFieldsDefaultValues(userFormFields);

      expect(result).toEqual({
        name: undefined,
        age: undefined,
        is_streamer: undefined,
        date_of_birth: undefined,
        description: undefined,
        role: undefined,
      });
    });

    it("should not return any values than undefined for form fields", () => {
      const productSchema = z.object({
        name: z.string(),
        price_cents: z.number(),
        description: z.string().optional(),
        disabled_at: z.date().nullable(),
        is_active: z.boolean(),
      });

      const productFormFields = mapSchemaToFormFields(productSchema);

      const result = getFormFieldsDefaultValues(productFormFields);

      expect(result.name).not.toBe("");
      expect(result.price_cents).not.toBe(0);
      expect(result.description).not.toBe("");
      expect(result.disabled_at).not.toBe(new Date());
      expect(result.is_active).not.toBe(false);
      expect(result.is_active).not.toBe(true);
    });
  });

  describe("sanitizeSchemaObject", () => {
    it("should handle null values by converting them to undefined", () => {
      const userObj = {
        name: "John Doe",
        age: null,
        is_streamer: true,
        date_of_birth: null,
        description: "Hello, World!",
      };

      const userSchema = z.object({
        name: z.string(),
        age: z.number().nullable(),
        is_streamer: z.boolean(),
        date_of_birth: z.date().nullable(),
        description: z.string(),
      });

      const result = sanitizeSchemaObject(userObj, userSchema);

      expect(result).toEqual({
        name: "John Doe",
        age: undefined,
        is_streamer: true,
        date_of_birth: undefined,
        description: "Hello, World!",
      });
    });

    it("should remove fields not present in the schema", () => {
      const userObj = {
        name: "John Doe",
        age: 30,
        is_streamer: true,
        date_of_birth: new Date(),
        description: "Hello, World!",
        extraField: "extra",
      };

      const userSchema = z.object({
        name: z.string(),
        age: z.number(),
        is_streamer: z.boolean(),
        date_of_birth: z.date(),
        description: z.string(),
      });

      const result = sanitizeSchemaObject(userObj, userSchema);

      expect(result).toEqual({
        name: "John Doe",
        age: 30,
        is_streamer: true,
        date_of_birth: userObj.date_of_birth,
        description: "Hello, World!",
      });
    });

    it("should handle empty schema object", () => {
      const userObj = {};

      const userSchema = z.object({
        name: z.string(),
        age: z.number(),
        is_streamer: z.boolean(),
        date_of_birth: z.date(),
        description: z.string(),
      });

      const result = sanitizeSchemaObject(userObj, userSchema);

      expect(result).toEqual({});
    });

    it("should handle empty schema", () => {
      const userObj = {
        name: "John Doe",
        age: 30,
        is_streamer: true,
        date_of_birth: new Date(),
        description: "Hello, World!",
      };

      const userSchema = z.object({});

      const result = sanitizeSchemaObject(userObj, userSchema);

      expect(result).toEqual({});
    });
  });
});
