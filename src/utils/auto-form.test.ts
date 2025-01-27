import { mapSchemaToFormFields } from "./auto-form";
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
});
