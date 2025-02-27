import { AutoForm } from "~/components/auto-form/auto-form";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod";

describe("AutoForm component", () => {
  it("should render the form fields correctly", () => {
    // TODO: Test if the date field is rendered correctly
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
    // expect(screen.getByLabelText("date_of_birth")).toBeInTheDocument();
    expect(screen.getByLabelText("description")).toBeInTheDocument();
    expect(screen.getByLabelText("role")).toBeInTheDocument();
  });

  it("should submit the form with correct data after filled without default values", async () => {
    // DONE
    const userSchema = z.object({
      name: z.string(),
      age: z.number(),
      is_streamer: z.boolean(),
      description: z.string().optional(),
      role: z.enum(["admin"]),
    });

    const handleSubmit = jest.fn();

    render(<AutoForm schema={userSchema} onSubmit={handleSubmit} />);

    await userEvent.type(screen.getByLabelText("name"), "John Doe");
    await userEvent.type(screen.getByLabelText("age"), "30");
    await userEvent.click(screen.getByLabelText("is_streamer"));

    const selectRoleBtn = screen.getByRole("combobox");
    expect(selectRoleBtn).toHaveTextContent(/Select the role/i);
    await userEvent.click(selectRoleBtn);

    const adminOption = screen.getByRole("option", { name: "admin" });
    await userEvent.click(adminOption);

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      age: 30,
      is_streamer: true,
      description: undefined,
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

    const selectRoleBtn = screen.getByRole("combobox");
    expect(selectRoleBtn).toHaveTextContent(/admin/i);
    await userEvent.click(selectRoleBtn);

    const userOption = screen.getByRole("option", { name: "user" });
    await userEvent.click(userOption);

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
    });
  });

  it("should render validation errors when the form is submitted with invalid data", async () => {
    // TODO: Implement this test
    const userSchema = z.object({
      name: z.string(),
      age: z.number(),
      is_streamer: z.boolean(),
      description: z.string().optional(),
      role: z.enum(["admin"]),
    });

    const handleSubmit = jest.fn();

    render(<AutoForm schema={userSchema} onSubmit={handleSubmit} />);

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));
  });

  it("should submit the form with the same data as default values without modifying", async () => {
    // DONE
    const userSchema = z.object({
      name: z.string(),
      age: z.number(),
      is_streamer: z.boolean(),
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

  it("should clear values for input field that are nullable or optional", () => {});

  it("should not render a field when it has set the hidden property", () => {});

  it("should render description without overriding the default input component", () => {});

  it("should render properly custom inputs", () => {});
});
