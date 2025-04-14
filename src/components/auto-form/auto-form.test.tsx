import { AutoForm } from "~/components/auto-form/auto-form";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  enterAutoFormDate,
  getCurrentMonthNumber,
  getFormattedCurrentMonth,
  selectAutoFormOption,
} from "~/utils/auto-form-test-helpers";
import { z } from "zod";

describe("AutoForm component", () => {
  it("should render the form fields correctly", () => {
    // DONE
    const userSchema = z.object({
      name: z.string(),
      age: z.number(),
      is_streamer: z.boolean(),
      date_of_birth: z.date(),
      description: z.string(),
      role: z.enum(["admin", "user"]),
    });

    render(<AutoForm schema={userSchema} onSubmit={jest.fn()} />);

    expect(screen.getByLabelText("name")).toBeInTheDocument();
    expect(screen.getByLabelText("age")).toBeInTheDocument();
    expect(screen.getByLabelText("is_streamer")).toBeInTheDocument();
    expect(screen.getByLabelText("date_of_birth")).toBeInTheDocument();
    expect(screen.getByLabelText("description")).toBeInTheDocument();
    expect(screen.getByLabelText("role")).toBeInTheDocument();
  });

  it("should properly enter date value", async () => {
    // DONE
    const userSchema = z.object({
      birth_date: z.date(),
    });

    const handleSubmit = jest.fn();

    render(<AutoForm schema={userSchema} onSubmit={handleSubmit} />);

    const triggerBtn = await enterAutoFormDate({
      label: "birth_date",
      day: 15,
      hour: 10,
      minute: 30,
    });

    const currentMonth = getFormattedCurrentMonth();
    const currentMonthNumber = getCurrentMonthNumber();

    expect(triggerBtn).toHaveTextContent(`15/${currentMonth}/2025 10:30`);

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      birth_date: new Date(`2025-${currentMonthNumber}-15T10:30:00`),
    });
  });

  it("should submit the form with correct data after filled without default values", async () => {
    // DONE
    const userSchema = z.object({
      name: z.string(),
      age: z.number(),
      is_streamer: z.boolean(),
      description: z.string().optional(),
      promoted_at: z.date().optional(),
      role: z.enum(["admin"]),
    });

    const handleSubmit = jest.fn();

    render(<AutoForm schema={userSchema} onSubmit={handleSubmit} />);

    await userEvent.type(screen.getByLabelText("name"), "John Doe");
    await userEvent.type(screen.getByLabelText("age"), "30");
    await userEvent.click(screen.getByLabelText("is_streamer"));
    await enterAutoFormDate({
      label: "promoted_at",
      day: 15,
      hour: 10,
      minute: 30,
    });
    await selectAutoFormOption({
      placeholder: "role",
      optionName: "admin",
    });

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      age: 30,
      is_streamer: true,
      promoted_at: new Date(`2025-${getCurrentMonthNumber()}-15T10:30:00`),
      role: "admin",
    });
  });

  it("should submit the form with correct data after filled with default values", async () => {
    // DONE
    const userSchema = z.object({
      name: z.string(),
      age: z.number(),
      is_streamer: z.boolean(),
      description: z.string().optional(),
      promoted_at: z.date().optional(),
      role: z.enum(["admin", "user"]),
    });

    const handleSubmit = jest.fn();

    render(
      <AutoForm
        schema={userSchema}
        defaultValues={{
          name: "John Doe",
          age: 30,
          is_streamer: true,
          role: "admin",
        }}
        onSubmit={handleSubmit}
      />,
    );

    await selectAutoFormOption({
      placeholder: "role",
      optionName: "user",
    });

    await enterAutoFormDate({
      label: "promoted_at",
      day: 15,
      hour: 10,
      minute: 30,
    });

    await userEvent.type(
      screen.getByLabelText("description"),
      "This is a description",
    );

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      age: 30,
      is_streamer: true,
      description: "This is a description",
      role: "user",
      promoted_at: new Date(`2025-${getCurrentMonthNumber()}-15T10:30:00`),
    });
  });

  it("should render validation errors when the form is submitted with invalid data", async () => {
    // DONE
    const userSchema = z.object({
      name: z.string(),
      age: z.number(),
      is_streamer: z.boolean(),
      description: z.string().optional(),
      date_of_birth: z.date(),
      role: z.enum(["admin"]),
    });

    const handleSubmit = jest.fn();

    render(<AutoForm schema={userSchema} onSubmit={handleSubmit} />);

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(screen.getByTestId("name-error")).toBeInTheDocument();
    expect(screen.getByTestId("age-error")).toBeInTheDocument();
    expect(screen.getByTestId("is_streamer-error")).toBeInTheDocument();
    expect(screen.queryByTestId("description-error")).not.toBeInTheDocument();
    expect(screen.getByTestId("date_of_birth-error")).toBeInTheDocument();
    expect(screen.getByTestId("role-error")).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("should submit the form with the same data as default values without modifying", async () => {
    // DONE
    const userSchema = z.object({
      name: z.string(),
      age: z.number(),
      is_streamer: z.boolean(),
      promoted_at: z.date().optional(),
      description: z.string().optional(),
      role: z.enum(["admin"]),
    });

    const handleSubmit = jest.fn();

    render(
      <AutoForm
        schema={userSchema}
        defaultValues={{
          name: "John Doe",
          age: 30,
          is_streamer: true,
          promoted_at: new Date("2025-01-01T10:30:00"),
          role: "admin",
        }}
        onSubmit={handleSubmit}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      age: 30,
      is_streamer: true,
      description: undefined,
      role: "admin",
      promoted_at: new Date("2025-01-01T10:30:00"),
    });
  });

  it("should not render clear button for fields that are not optional or nullable", () => {
    // DONE
    const userSchema = z.object({
      name: z.string(),
      age: z.number(),
      is_streamer: z.boolean().nullable(),
      date_of_birth: z.date(),
      description: z.string().optional(),
    });

    render(<AutoForm schema={userSchema} onSubmit={jest.fn()} />);

    const nameClearBtn = screen.queryByTestId(`clear-name`);
    expect(nameClearBtn).not.toBeInTheDocument();

    const ageClearBtn = screen.queryByTestId(`clear-age`);
    expect(ageClearBtn).not.toBeInTheDocument();
  });

  it("should clear values for input fields that are nullable or optional", async () => {
    // DONE
    const userSchema = z.object({
      name: z.string(),
      age: z.number().nullish(),
      is_streamer: z.boolean().nullish(),
      description: z.string().nullish(),
      promoted_at: z.date().nullish(),
      role: z.enum(["admin", "user"]).nullish(),
    });

    const handleSubmit = jest.fn();

    render(<AutoForm schema={userSchema} onSubmit={handleSubmit} />);

    // Enter values
    await userEvent.type(screen.getByLabelText("name"), "John Doe");
    await userEvent.type(screen.getByLabelText("age"), "30");
    await userEvent.click(screen.getByLabelText("is_streamer"));
    await userEvent.type(
      screen.getByLabelText("description"),
      "This is a description",
    );
    await enterAutoFormDate({
      label: "promoted_at",
      day: 15,
      hour: 10,
      minute: 30,
    });
    await selectAutoFormOption({
      placeholder: "role",
      optionName: "user",
    });

    const ageClearBtn = screen.getByTestId(`clear-age`);
    expect(ageClearBtn).toBeInTheDocument();
    await userEvent.click(ageClearBtn);

    const isStreamerClearBtn = screen.getByTestId(`clear-is_streamer`);
    expect(isStreamerClearBtn).toBeInTheDocument();
    await userEvent.click(isStreamerClearBtn);

    const descriptionClearBtn = screen.getByTestId(`clear-description`);
    expect(descriptionClearBtn).toBeInTheDocument();
    await userEvent.click(descriptionClearBtn);

    const roleClearBtn = screen.getByTestId(`clear-role`);
    expect(roleClearBtn).toBeInTheDocument();
    await userEvent.click(roleClearBtn);

    const promotedAtClearBtn = screen.getByTestId(`clear-promoted_at`);
    expect(promotedAtClearBtn).toBeInTheDocument();
    await userEvent.click(promotedAtClearBtn);

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      age: null,
      is_streamer: null,
      description: null,
      promoted_at: null,
      role: null,
    });
  });

  it("should not render a field when it has set the hidden property", () => {
    // DONE
    const transactionSchema = z.object({
      id: z.string(),
      amount: z.number(),
      status: z.enum(["pending", "completed", "failed"]),
      user_id: z.string(),
    });

    render(
      <AutoForm
        schema={transactionSchema}
        fieldsConfig={{
          user_id: {
            hidden: true,
          },
        }}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.queryByLabelText("user_id")).not.toBeInTheDocument();
  });

  it("should submit the form with correct data when some fields are hidden but have default values", async () => {
    // DONE
    const transactionSchema = z.object({
      amount: z.number(),
      status: z.enum(["pending", "completed", "failed"]),
      user_id: z.string(),
    });

    const handleSubmit = jest.fn();

    render(
      <AutoForm
        schema={transactionSchema}
        fieldsConfig={{
          user_id: {
            hidden: true,
          },
        }}
        defaultValues={{
          user_id: "anakinid",
        }}
        onSubmit={handleSubmit}
      />,
    );

    await userEvent.type(screen.getByLabelText("amount"), "1000");

    await selectAutoFormOption({
      placeholder: "status",
      optionName: "completed",
    });

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      amount: 1000,
      status: "completed",
      user_id: "anakinid",
    });
  });

  it("should render description without overriding the default input component", () => {
    // DONE
    const userSchema = z.object({
      name: z.string(),
      age: z.number(),
      is_streamer: z.boolean(),
      description: z.string().optional(),
      role: z.enum(["admin", "user"]),
    });

    render(
      <AutoForm
        schema={userSchema}
        fieldsConfig={{
          name: {
            description: "This is the name",
          },
          age: {
            description: "This is the age",
          },
          is_streamer: {
            description: "This is the streamer",
          },
          description: {
            description: "This is the description",
          },
          role: {
            description: "This is the role",
          },
        }}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByText("This is the name")).toBeInTheDocument();
    expect(screen.getByText("This is the age")).toBeInTheDocument();
    expect(screen.getByText("This is the streamer")).toBeInTheDocument();
    expect(screen.getByText("This is the description")).toBeInTheDocument();
    expect(screen.getByText("This is the role")).toBeInTheDocument();

    expect(screen.getByLabelText("name")).toBeInTheDocument();
    expect(screen.getByLabelText("age")).toBeInTheDocument();
    expect(screen.getByLabelText("is_streamer")).toBeInTheDocument();
    expect(screen.getByLabelText("description")).toBeInTheDocument();
    expect(screen.getByLabelText("role")).toBeInTheDocument();
  });

  it("should properly handle custom inputs", async () => {
    // TODO:
    const userSchema = z.object({
      description: z.string().optional(),
      image: z.string(),
      bio: z.string().optional(),
    });

    const handleSubmit = jest.fn();

    render(
      <AutoForm
        schema={userSchema}
        fieldsConfig={{
          image: {
            type: "image",
          },
          bio: {
            type: "wysiwyg",
          },
          description: {
            type: "textarea",
          },
        }}
        onSubmit={handleSubmit}
      />,
    );

    expect(screen.getByLabelText("image")).toBeInTheDocument();
    expect(screen.getByLabelText("bio")).toBeInTheDocument();
    expect(screen.getByLabelText("description")).toBeInTheDocument();

    await userEvent.type(
      screen.getByLabelText("description"),
      "This is a description",
    );
  });

  it("should apply mapLabel function to the label", () => {
    // DONE
    const userSchema = z.object({
      user_name: z.string(),
      user_age: z.number(),
      user_is_streamer: z.boolean(),
      user_description: z.string().optional(),
      user_role: z.enum(["admin", "user"]),
    });

    const mapLabel = (fieldName: string) => fieldName.split("_").join(" ");

    render(
      <AutoForm schema={userSchema} mapLabel={mapLabel} onSubmit={jest.fn()} />,
    );

    expect(screen.getByLabelText("user name")).toBeInTheDocument();
    expect(screen.getByLabelText("user age")).toBeInTheDocument();
    expect(screen.getByLabelText("user is streamer")).toBeInTheDocument();
    expect(screen.getByLabelText("user description")).toBeInTheDocument();
    expect(screen.getByLabelText("user role")).toBeInTheDocument();
  });
});
