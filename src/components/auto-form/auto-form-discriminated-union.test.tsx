import { AutoFormDiscriminatedUnion } from "./auto-form-discriminated-union";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  enterAutoFormDate,
  getCurrentMonthNumber,
  getFormattedCurrentMonth,
  selectAutoFormOption,
} from "~/utils/auto-form-test-helpers";
import { z } from "zod";

describe("AutoFormDiscriminatedUnion component", () => {
  it("should render the form fields correctly", async () => {
    // DONE
    const userSchema = z.discriminatedUnion("variant", [
      z.object({
        variant: z.literal("developer"),
        id: z.string().optional(),
        name: z.string(),
        image: z.string(),
        date_of_birth: z.date(),
        description: z.string().optional(),
        programming_language: z.enum(["javascript", "python"]),
        is_streamer: z.boolean(),
      }),
      z.object({
        variant: z.literal("devops"),
        id: z.string().optional(),
        name: z.string(),
        image: z.string(),
        date_of_birth: z.date(),
        description: z.string().optional(),
        cloud_provider: z.enum(["aws", "gooogle", "azure"]),
      }),
    ]);

    render(
      <AutoFormDiscriminatedUnion
        fieldsConfig={{
          base: {
            id: {
              hidden: true,
            },
            image: {
              type: "image",
            },
            description: {
              type: "textarea",
            },
          },
        }}
        schema={userSchema}
        onSubmit={jest.fn()}
      />,
    );

    await selectAutoFormOption({
      placeholder: "variant",
      optionName: "developer",
    });

    expect(screen.getByLabelText("name")).toBeInTheDocument();
    expect(screen.getByLabelText("image")).toBeInTheDocument();
    expect(screen.getByLabelText("date_of_birth")).toBeInTheDocument();
    expect(screen.getByLabelText("description")).toBeInTheDocument();
    expect(screen.getByLabelText("programming_language")).toBeInTheDocument();
    expect(screen.getByLabelText("is_streamer")).toBeInTheDocument();

    await selectAutoFormOption({
      placeholder: "variant",
      optionName: "devops",
    });

    expect(screen.getByLabelText("name")).toBeInTheDocument();
    expect(screen.getByLabelText("image")).toBeInTheDocument();
    expect(screen.getByLabelText("date_of_birth")).toBeInTheDocument();
    expect(screen.getByLabelText("description")).toBeInTheDocument();
    expect(screen.getByLabelText("cloud_provider")).toBeInTheDocument();
  });

  it("should properly enter date value", async () => {
    // DONE
    const userSchema = z.discriminatedUnion("variant", [
      z.object({
        variant: z.literal("developer"),
        id: z.string().optional(),
        birth_date: z.date(),
      }),
      z.object({
        variant: z.literal("devops"),
        id: z.string().optional(),
        birth_date: z.date(),
      }),
    ]);

    const handleSubmit = jest.fn();

    render(
      <AutoFormDiscriminatedUnion
        fieldsConfig={{
          base: {
            id: {
              hidden: true,
            },
          },
        }}
        schema={userSchema}
        onSubmit={handleSubmit}
      />,
    );

    await selectAutoFormOption({
      placeholder: "variant",
      optionName: "devops",
    });

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
      variant: "devops",
      id: undefined,
      birth_date: new Date(`2025-${currentMonthNumber}-15T10:30:00`),
    });
  });

  it("should submit the form with correct data after filled without default values", async () => {
    // DONE
    const carSchema = z.discriminatedUnion("type", [
      z.object({
        type: z.literal("car"),
        id: z.string().optional(),
        brand_name: z.string(),
        gas: z.enum(["petrol", "diesel"]),
        model_name: z.string(),
      }),
      z.object({
        type: z.literal("truck"),
        id: z.string().optional(),
        brand_name: z.string(),
        gas: z.enum(["petrol", "diesel"]),
        capacity_count: z.number(),
        description: z.string().optional(),
        sold_at: z.date().optional(),
      }),
    ]);

    const handleSubmit = jest.fn();

    render(
      <AutoFormDiscriminatedUnion
        fieldsConfig={{
          base: {
            id: {
              hidden: true,
            },
          },
          variants: {
            truck: {
              description: {
                type: "textarea",
              },
            },
          },
        }}
        schema={carSchema}
        onSubmit={handleSubmit}
      />,
    );

    await selectAutoFormOption({
      placeholder: "type",
      optionName: "truck",
    });

    await userEvent.type(screen.getByLabelText("brand_name"), "Mercedes");
    await selectAutoFormOption({
      placeholder: "gas",
      optionName: "petrol",
    });
    await userEvent.type(screen.getByLabelText("capacity_count"), "5");
    await userEvent.type(
      screen.getByLabelText("description"),
      "This is a truck",
    );
    await enterAutoFormDate({
      label: "sold_at",
      day: 24,
      hour: 21,
      minute: 35,
    });

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      id: undefined,
      type: "truck",
      brand_name: "Mercedes",
      gas: "petrol",
      capacity_count: 5,
      description: "This is a truck",
      sold_at: new Date(`2025-${getCurrentMonthNumber()}-24T21:35:00`),
    });
  });

  it("should submit the form with correct data after filled with default values", async () => {
    // DONE
    const carSchema = z.discriminatedUnion("type", [
      z.object({
        type: z.literal("car"),
        id: z.string().optional(),
        brand_name: z.string(),
        gas: z.enum(["petrol", "diesel"]).nullish(),
        model_name: z.string(),
        description: z.string().optional(),
        story: z.string().optional(),
      }),
      z.object({
        type: z.literal("truck"),
        id: z.string().optional(),
        brand_name: z.string(),
        gas: z.enum(["petrol", "diesel"]).nullish(),
        capacity_count: z.number(),
      }),
    ]);

    const handleSubmit = jest.fn();

    render(
      <AutoFormDiscriminatedUnion
        schema={carSchema}
        defaultValues={{
          id: "ferrariId",
          type: "car",
          brand_name: "Ferrari",
          model_name: "F8",
        }}
        onSubmit={handleSubmit}
      />,
    );

    await userEvent.type(
      screen.getByLabelText("description"),
      "Super fast car",
    );
    await selectAutoFormOption({
      placeholder: "gas",
      optionName: "petrol",
    });

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      id: "ferrariId",
      type: "car",
      brand_name: "Ferrari",
      model_name: "F8",
      description: "Super fast car",
      gas: "petrol",
      story: undefined,
    });
  });

  it("should render validation errors when the form is submitted with invalid data", async () => {
    // DONE
    const userSchema = z.discriminatedUnion("variant", [
      z.object({
        variant: z.literal("developer"),
        id: z.string().optional(),
        name: z.string(),
        date_of_birth: z.date(),
        bio: z.string().optional(),
        salary: z.number().optional(),
        programming_language: z.enum(["javascript", "python"]),
      }),
      z.object({
        variant: z.literal("devops"),
        id: z.string().optional(),
        name: z.string(),
        date_of_birth: z.date(),
      }),
    ]);

    const handleSubmit = jest.fn();

    render(
      <AutoFormDiscriminatedUnion
        fieldsConfig={{
          base: {
            id: {
              hidden: true,
            },
          },
        }}
        schema={userSchema}
        onSubmit={handleSubmit}
      />,
    );

    await selectAutoFormOption({
      placeholder: "variant",
      optionName: "developer",
    });
    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(screen.getByTestId("name-error")).toBeInTheDocument();
    expect(screen.getByTestId("date_of_birth-error")).toBeInTheDocument();
    expect(
      screen.getByTestId("programming_language-error"),
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("should submit the form with the same data as default values without modifying", async () => {
    // DONE
    const userSchema = z.discriminatedUnion("variant", [
      z.object({
        variant: z.literal("developer"),
        name: z.string(),
        date_of_birth: z.date(),
        salary: z.number().optional(),
        programming_language: z.enum(["javascript", "python"]),
      }),
      z.object({
        variant: z.literal("devops"),
        name: z.string(),
        date_of_birth: z.date(),
      }),
    ]);

    const handleSubmit = jest.fn();

    render(
      <AutoFormDiscriminatedUnion
        schema={userSchema}
        defaultValues={{
          variant: "developer",
          name: "John Doe",
          date_of_birth: new Date("2025-01-01T10:30:00"),
          programming_language: "javascript",
        }}
        onSubmit={handleSubmit}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      variant: "developer",
      name: "John Doe",
      date_of_birth: new Date("2025-01-01T10:30:00"),
      salary: undefined,
      programming_language: "javascript",
    });
  });

  it("should not render clear button for fields that are not optional or nullable", async () => {
    // DONE
    const carSchema = z.discriminatedUnion("type", [
      z.object({
        type: z.literal("car"),
        id: z.string().optional(),
        brand_name: z.string(),
        model_name: z.string().optional(),
        gas: z.enum(["petrol", "diesel"]),
      }),
      z.object({
        type: z.literal("truck"),
        id: z.string().optional(),
        brand_name: z.string().optional(),
        capacity_count: z.number(),
        gas: z.enum(["petrol", "diesel"]),
      }),
    ]);

    render(
      <AutoFormDiscriminatedUnion
        fieldsConfig={{
          base: {
            id: {
              hidden: true,
            },
          },
        }}
        schema={carSchema}
        onSubmit={jest.fn()}
      />,
    );

    await selectAutoFormOption({
      placeholder: "type",
      optionName: "car",
    });

    const carBrandNameClearBtn = screen.queryByTestId(`brand_name-name`);
    expect(carBrandNameClearBtn).not.toBeInTheDocument();

    const carGasClearBtn = screen.queryByTestId(`gas-name`);
    expect(carGasClearBtn).not.toBeInTheDocument();

    await selectAutoFormOption({
      placeholder: "type",
      optionName: "truck",
    });

    const truckCapacityCountClearBtn =
      screen.queryByTestId(`capacity_count-name`);
    expect(truckCapacityCountClearBtn).not.toBeInTheDocument();
    const truckGasClearBtn = screen.queryByTestId(`gas-name`);
    expect(truckGasClearBtn).not.toBeInTheDocument();
  });

  it("should clear values for input fields that are nullish", async () => {
    // DONE
    const userSchema = z.discriminatedUnion("variant", [
      z.object({
        variant: z.literal("developer"),
        id: z.string().optional(),
        name: z.string(),
        date_of_birth: z.date(),
        bio: z.string().nullish(),
        salary: z.number().nullish(),
        promoted_at: z.date().nullish(),
        project_role: z.enum(["frontend", "backend"]).nullish(),
      }),
      z.object({
        variant: z.literal("devops"),
        id: z.string().optional(),
        name: z.string(),
        date_of_birth: z.date(),
      }),
    ]);

    const handleSubmit = jest.fn();

    render(
      <AutoFormDiscriminatedUnion
        fieldsConfig={{
          base: {
            id: {
              hidden: true,
            },
          },
        }}
        schema={userSchema}
        onSubmit={handleSubmit}
      />,
    );

    await selectAutoFormOption({
      placeholder: "variant",
      optionName: "developer",
    });

    // Enter values
    await userEvent.type(screen.getByLabelText("name"), "John Doe");
    await enterAutoFormDate({
      label: "date_of_birth",
      day: 10,
      hour: 12,
      minute: 0,
    });
    await userEvent.type(screen.getByLabelText("salary"), "25000");
    await enterAutoFormDate({
      label: "promoted_at",
      day: 15,
      hour: 10,
      minute: 30,
    });
    await selectAutoFormOption({
      placeholder: "project_role",
      optionName: "backend",
    });

    const salaryClearBtn = screen.getByTestId("clear-salary");
    expect(salaryClearBtn).toBeInTheDocument();
    await userEvent.click(salaryClearBtn);

    const promotedAtClearBtn = screen.getByTestId(`clear-promoted_at`);
    expect(promotedAtClearBtn).toBeInTheDocument();
    await userEvent.click(promotedAtClearBtn);

    const projectRoleClearBtn = screen.getByTestId(`clear-project_role`);
    expect(projectRoleClearBtn).toBeInTheDocument();
    await userEvent.click(projectRoleClearBtn);

    const currentMonthNumber = getCurrentMonthNumber();

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      id: undefined,
      variant: "developer",
      name: "John Doe",
      date_of_birth: new Date(`2025-${currentMonthNumber}-10T12:00:00`),
      salary: null,
      promoted_at: null,
      project_role: null,
      bio: undefined,
    });
  });

  it("should not render a field when it has set the hidden property", async () => {
    // DONE
    const carSchema = z.discriminatedUnion("type", [
      z.object({
        type: z.literal("car"),
        id: z.string().optional(),
        brand_name: z.string(),
        model_name: z.string(),
      }),
      z.object({
        type: z.literal("truck"),
        id: z.string().optional(),
        brand_name: z.string(),
        capacity_count: z.number(),
      }),
    ]);

    render(
      <AutoFormDiscriminatedUnion
        schema={carSchema}
        fieldsConfig={{
          base: {
            id: {
              hidden: true,
            },
          },
        }}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.queryByLabelText("user_id")).not.toBeInTheDocument();

    await selectAutoFormOption({
      placeholder: "type",
      optionName: "car",
    });

    expect(screen.queryByLabelText("user_id")).not.toBeInTheDocument();

    await selectAutoFormOption({
      placeholder: "type",
      optionName: "truck",
    });

    expect(screen.queryByLabelText("user_id")).not.toBeInTheDocument();
  });

  it("should submit the form with correct data when some fields are hidden but have default values", async () => {
    // DONE
    const carSchema = z.discriminatedUnion("type", [
      z.object({
        type: z.literal("car"),
        id: z.string().optional(),
        brand_name: z.string(),
        model_name: z.string(),
      }),
      z.object({
        type: z.literal("truck"),
        id: z.string().optional(),
        brand_name: z.string(),
        capacity_count: z.number(),
      }),
    ]);

    const handleSubmit = jest.fn();

    render(
      <AutoFormDiscriminatedUnion
        schema={carSchema}
        fieldsConfig={{
          base: {
            id: {
              hidden: true,
            },
          },
        }}
        defaultValues={{
          id: "ferrariId",
        }}
        onSubmit={handleSubmit}
      />,
    );

    await selectAutoFormOption({
      placeholder: "type",
      optionName: "car",
    });

    await userEvent.type(screen.getByLabelText("brand_name"), "Ferrari");
    await userEvent.type(screen.getByLabelText("model_name"), "F8");

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      id: "ferrariId",
      type: "car",
      brand_name: "Ferrari",
      model_name: "F8",
    });
  });

  it("should render description without overriding the default input component", async () => {
    // DONE
    const userSchema = z.discriminatedUnion("variant", [
      z.object({
        variant: z.literal("developer"),
        id: z.string().optional(),
        name: z.string(),
        date_of_birth: z.date(),
        is_streamer: z.boolean(),
        salary: z.number().optional(),
      }),
      z.object({
        variant: z.literal("devops"),
        id: z.string().optional(),
        name: z.string(),
        date_of_birth: z.date(),
        is_streamer: z.boolean(),
        bio: z.string().optional(),
      }),
    ]);

    render(
      <AutoFormDiscriminatedUnion
        schema={userSchema}
        fieldsConfig={{
          base: {
            id: {
              hidden: true,
            },
            name: {
              description: "This is the name",
            },
            date_of_birth: {
              description: "This is the date of birth",
            },
            is_streamer: {
              description: "This is the streamer",
            },
          },
          variants: {
            developer: {
              salary: {
                description: "This is the salary",
              },
            },
            devops: {
              bio: {
                description: "This is the bio",
              },
            },
          },
        }}
        onSubmit={jest.fn()}
      />,
    );

    await selectAutoFormOption({
      placeholder: "variant",
      optionName: "developer",
    });

    expect(screen.getByText("This is the name")).toBeInTheDocument();
    expect(screen.getByText("This is the date of birth")).toBeInTheDocument();
    expect(screen.getByText("This is the streamer")).toBeInTheDocument();
    expect(screen.getByText("This is the salary")).toBeInTheDocument();

    expect(screen.getByLabelText("name")).toBeInTheDocument();
    expect(screen.getByLabelText("date_of_birth")).toBeInTheDocument();
    expect(screen.getByLabelText("is_streamer")).toBeInTheDocument();
    expect(screen.getByLabelText("salary")).toBeInTheDocument();
  });

  it("should properly handle custom inputs", async () => {
    // TODO:
    const userSchema = z.discriminatedUnion("variant", [
      z.object({
        id: z.string().optional(),
        variant: z.literal("developer"),
        image: z.string(),
        bio: z.string(),
        description: z.string(),
      }),
      z.object({
        id: z.string().optional(),
        variant: z.literal("devops"),
        image: z.string(),
        bio: z.string(),
        description: z.string(),
      }),
    ]);
    const handleSubmit = jest.fn();

    render(
      <AutoFormDiscriminatedUnion
        schema={userSchema}
        fieldsConfig={{
          base: {
            image: {
              type: "image",
            },
            bio: {
              type: "wysiwyg",
            },
            description: {
              type: "textarea",
            },
          },
        }}
        onSubmit={handleSubmit}
      />,
    );

    await selectAutoFormOption({
      placeholder: "variant",
      optionName: "developer",
    });

    expect(screen.getByLabelText("image")).toBeInTheDocument();
    expect(screen.getByLabelText("bio")).toBeInTheDocument();
    expect(screen.getByLabelText("description")).toBeInTheDocument();

    await userEvent.type(
      screen.getByLabelText("description"),
      "This is a description",
    );
  });

  it("should apply mapLabel function to the label", async () => {
    // DONE
    const carSchema = z.discriminatedUnion("type", [
      z.object({
        type: z.literal("car"),
        brand_name: z.string(),
        model_name: z.string(),
      }),
      z.object({
        type: z.literal("truck"),
        brand_name: z.string(),
        capacity_count: z.number(),
      }),
    ]);

    const mapLabel = (fieldName: string) => fieldName.split("_").join(" ");

    render(
      <AutoFormDiscriminatedUnion
        schema={carSchema}
        mapLabel={mapLabel}
        onSubmit={jest.fn()}
      />,
    );

    await selectAutoFormOption({
      placeholder: "type",
      optionName: "car",
    });

    expect(screen.getByLabelText("brand name")).toBeInTheDocument();
    expect(screen.getByLabelText("model name")).toBeInTheDocument();

    expect(screen.queryByLabelText("capacity count")).not.toBeInTheDocument();

    await selectAutoFormOption({
      placeholder: "type",
      optionName: "truck",
    });

    expect(screen.getByLabelText("brand name")).toBeInTheDocument();
    expect(screen.getByLabelText("capacity count")).toBeInTheDocument();
    expect(screen.queryByLabelText("model name")).not.toBeInTheDocument();
  });
});
