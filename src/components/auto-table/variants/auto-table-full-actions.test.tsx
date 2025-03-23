import { AutoTableDndTable } from "../tables/auto-table-dnd-table";
import { AutoTableToolbarHeader } from "../auto-table-header";
import { AutoTableFullActions } from "./auto-table-full-actions";
import { render, screen } from "@testing-library/react";
import { AutoTableDetailsRow } from "../auto-table";
import userEvent from "@testing-library/user-event";
import { Button } from "~/components/ui/button";
import {
  enterAutoFormDate,
  getCurrentMonthNumber,
  getFormattedCurrentMonth,
} from "~/utils/auto-form-test-helpers";
import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  date_of_birth: z.date(),
  account_disabled_at: z.date().nullish(),
});

const userCreateSchema = userSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

const userUpdateSchema = userSchema.omit({
  created_at: true,
  updated_at: true,
});

type User = z.infer<typeof userSchema>;

beforeEach(() => {
  window.localStorage.clear();
});

describe("AutoTableFullActions component", () => {
  it("should invoke onDelete with selected row data after click delete button", async () => {
    // DONE
    const deleteUser = jest.fn();

    const user: User = {
      id: "1",
      created_at: new Date(),
      updated_at: new Date(),
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@gmail.com",
      date_of_birth: new Date(),
    };

    render(
      <AutoTableFullActions
        technicalTableName="user"
        schema={userSchema}
        rowIdentifierKey="id"
        data={[user]}
        onRefetchData={jest.fn()}
        onDelete={deleteUser}
        create={{
          formSchema: userCreateSchema,
          onCreate: jest.fn(),
        }}
        update={{
          formSchema: userUpdateSchema,
          onUpdate: jest.fn(),
        }}
        renderDetails={jest.fn()}
        onDetails={jest.fn()}
      >
        <AutoTableToolbarHeader title="Users" />
        <AutoTableDndTable />
      </AutoTableFullActions>,
    );

    const openMenuBtn = screen.getByRole("button", { name: "Open menu" });
    await userEvent.click(openMenuBtn);

    const menuItemDeleteBtn = screen.getByRole("menuitem", { name: "Delete" });
    await userEvent.click(menuItemDeleteBtn);

    const modalTitle = screen.getByRole("heading", {
      name: "Are you absolutely sure?",
    });
    expect(modalTitle).toBeInTheDocument();

    const deleteBtn = screen.getByRole("button", { name: "Delete" });
    await userEvent.click(deleteBtn);
    expect(deleteUser).toHaveBeenCalledWith(user);
  });

  it("should invoke onCreate with data after click submit button in form", async () => {
    // DONE
    const createUser = jest.fn();

    render(
      <AutoTableFullActions
        technicalTableName="user"
        schema={userSchema}
        rowIdentifierKey="id"
        data={[]}
        onRefetchData={jest.fn()}
        onDelete={jest.fn()}
        create={{
          formSchema: userCreateSchema,
          onCreate: createUser,
        }}
        update={{
          formSchema: userUpdateSchema,
          onUpdate: jest.fn(),
        }}
        renderDetails={jest.fn()}
        onDetails={jest.fn()}
      >
        <AutoTableToolbarHeader title="Users" />
        <AutoTableDndTable />
      </AutoTableFullActions>,
    );

    // open create modal
    const openCreateModalBtn = screen.getByTestId("auto-table-create-button");
    await userEvent.click(openCreateModalBtn);

    const modalTitle = screen.getByRole("heading", { name: "Create" });
    expect(modalTitle).toBeInTheDocument();

    // enter data
    const firstNameInput = screen.getByLabelText("first name");
    await userEvent.type(firstNameInput, "John");

    const lastNameInput = screen.getByLabelText("last name");
    await userEvent.type(lastNameInput, "Doe");

    const emailInput = screen.getByLabelText("email");

    await userEvent.type(emailInput, "john.doe@gmail.com");

    const currentMonth = getFormattedCurrentMonth();
    const currentMonthNumber = getCurrentMonthNumber();

    const triggerBtn = await enterAutoFormDate({
      label: "date of birth",
      day: 15,
      hour: 10,
      minute: 30,
    });

    expect(triggerBtn).toHaveTextContent(`15/${currentMonth}/2025 10:30`);

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(createUser).toHaveBeenCalledWith({
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@gmail.com",
      date_of_birth: new Date(`2025-${currentMonthNumber}-15T10:30:00`),
    });
  });

  it("should invoke onUpdate with data after click submit button in form", async () => {
    // DONE
    const updateUser = jest.fn();

    const user: User = {
      id: "1",
      created_at: new Date(),
      updated_at: new Date(),
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@gmail.com",
      date_of_birth: new Date(),
    };

    render(
      <AutoTableFullActions
        technicalTableName="user"
        schema={userSchema}
        rowIdentifierKey="id"
        data={[user]}
        onRefetchData={jest.fn()}
        onDelete={jest.fn()}
        create={{
          formSchema: userCreateSchema,
          onCreate: jest.fn(),
        }}
        update={{
          formSchema: userUpdateSchema,
          onUpdate: updateUser,
        }}
        renderDetails={jest.fn()}
        onDetails={jest.fn()}
      >
        <AutoTableToolbarHeader title="Users" />
        <AutoTableDndTable />
      </AutoTableFullActions>,
    );

    // open update modal
    const openMenuBtn = screen.getByRole("button", { name: "Open menu" });
    await userEvent.click(openMenuBtn);

    const menuItemUpdateBtn = screen.getByRole("menuitem", { name: "Update" });
    await userEvent.click(menuItemUpdateBtn);

    const modalTitle = screen.getByRole("heading", { name: "Update" });
    expect(modalTitle).toBeInTheDocument();

    // update data
    const firstNameInput = screen.getByLabelText("first name");
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, "Alice");

    const lastNameInput = screen.getByLabelText("last name");
    await userEvent.clear(lastNameInput);
    await userEvent.type(lastNameInput, "Trump");

    const emailInput = screen.getByLabelText("email");
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "alice.trump@gmail.com");

    const currentMonth = getFormattedCurrentMonth();
    const currentMonthNumber = getCurrentMonthNumber();

    const triggerBtn = await enterAutoFormDate({
      label: "date of birth",
      day: 15,
      hour: 10,
      minute: 30,
    });

    expect(triggerBtn).toHaveTextContent(`15/${currentMonth}/2025 10:30`);

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(updateUser).toHaveBeenCalledWith({
      id: "1",
      first_name: "Alice",
      last_name: "Trump",
      email: "alice.trump@gmail.com",
      date_of_birth: new Date(`2025-${currentMonthNumber}-15T10:30:00`),
    });
  });

  it("should render only selected columns after select columns", async () => {
    // DONE
    render(
      <AutoTableFullActions
        technicalTableName="user"
        schema={userSchema}
        rowIdentifierKey="id"
        data={[]}
        onRefetchData={jest.fn()}
        onDelete={jest.fn()}
        create={{
          formSchema: userCreateSchema,
          onCreate: jest.fn(),
        }}
        update={{
          formSchema: userUpdateSchema,
          onUpdate: jest.fn(),
        }}
        renderDetails={jest.fn()}
        onDetails={jest.fn()}
      >
        <AutoTableToolbarHeader title="Users" />
        <AutoTableDndTable />
      </AutoTableFullActions>,
    );

    const openSelectColumnsBtn = screen.getByTestId(
      "auth-table-select-columns-button",
    );
    await userEvent.click(openSelectColumnsBtn);

    const menuItemCreatedAt = screen.getByRole("menuitemcheckbox", {
      name: "created at",
    });
    await userEvent.click(menuItemCreatedAt);

    await userEvent.click(openSelectColumnsBtn);

    const menuItemUpdatedAt = screen.getByRole("menuitemcheckbox", {
      name: "updated at",
    });
    await userEvent.click(menuItemUpdatedAt);

    const idHeader = screen.getByText("id");
    expect(idHeader).toBeInTheDocument();

    const createdAtHeader = screen.queryByText("created at");
    expect(createdAtHeader).not.toBeInTheDocument();

    const updatedAtHeader = screen.queryByText("updated at");
    expect(updatedAtHeader).not.toBeInTheDocument();

    const firstNameHeader = screen.getByText("first name");
    expect(firstNameHeader).toBeInTheDocument();

    const lastNameHeader = screen.getByText("last name");
    expect(lastNameHeader).toBeInTheDocument();

    const accountDisabledAtHeader = screen.getByText("account disabled at");
    expect(accountDisabledAtHeader).toBeInTheDocument();
  });

  it("should invoke onRefetchData after click refresh button", async () => {
    // DONE
    const refetchData = jest.fn();

    render(
      <AutoTableFullActions
        technicalTableName="user"
        schema={userSchema}
        rowIdentifierKey="id"
        data={[]}
        onRefetchData={refetchData}
        onDelete={jest.fn()}
        create={{
          formSchema: userCreateSchema,
          onCreate: jest.fn(),
        }}
        update={{
          formSchema: userUpdateSchema,
          onUpdate: jest.fn(),
        }}
        renderDetails={jest.fn()}
        onDetails={jest.fn()}
      >
        <AutoTableToolbarHeader title="Users" />
        <AutoTableDndTable />
      </AutoTableFullActions>,
    );

    const refreshBtn = screen.getByTestId("auth-table-refresh-button");
    await userEvent.click(refreshBtn);
    expect(refetchData).toHaveBeenCalled();
  });

  it("should render details after click row details button and should not render after click close selected row button", async () => {
    // DONE
    const user: User = {
      id: "1",
      created_at: new Date(),
      updated_at: new Date(),
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@gmail.com",
      date_of_birth: new Date(),
    };

    render(
      <AutoTableFullActions
        technicalTableName="user"
        schema={userSchema}
        rowIdentifierKey="id"
        data={[user]}
        onRefetchData={jest.fn()}
        onDelete={jest.fn()}
        create={{
          formSchema: userCreateSchema,
          onCreate: jest.fn(),
        }}
        update={{
          formSchema: userUpdateSchema,
          onUpdate: jest.fn(),
        }}
        onDetails={() => {
          return new Promise<User>((resolve) => {
            resolve(user);
          });
        }}
        renderDetails={(user) => {
          return (
            <div className="flex">
              <p>FullName: </p>
              <p>{`${user.first_name} ${user.last_name}`}</p>
            </div>
          );
        }}
      >
        <AutoTableToolbarHeader title="Users" />
        <AutoTableDndTable
          extraRow={(row) => <AutoTableDetailsRow rowId={row.id} />}
        />
      </AutoTableFullActions>,
    );

    const openMenuBtn = screen.getByRole("button", { name: "Open menu" });
    await userEvent.click(openMenuBtn);

    const openDetailsBtn = screen.getByRole("menuitem", { name: "Details" });
    await userEvent.click(openDetailsBtn);

    const fullNameDescription = screen.getByText("FullName:");
    expect(fullNameDescription).toBeInTheDocument();

    const fullNameValue = screen.getByText("John Doe");
    expect(fullNameValue).toBeInTheDocument();

    const closeSelelctedRowBtn = screen.getByTestId(
      "auto-table-close-details-button",
    );
    await userEvent.click(closeSelelctedRowBtn);

    expect(fullNameDescription).not.toBeInTheDocument();
    expect(fullNameValue).not.toBeInTheDocument();
  });

  it("should apply mapColumnName to column", () => {
    // DONE

    render(
      <AutoTableFullActions
        technicalTableName="user"
        schema={userSchema}
        rowIdentifierKey="id"
        data={[]}
        onRefetchData={jest.fn()}
        onDelete={jest.fn()}
        create={{
          formSchema: userCreateSchema,
          onCreate: jest.fn(),
        }}
        update={{
          formSchema: userUpdateSchema,
          onUpdate: jest.fn(),
        }}
        renderDetails={jest.fn()}
        onDetails={jest.fn()}
        mapColumnName={(column) => column.toUpperCase()}
      >
        <AutoTableToolbarHeader title="Users" />
        <AutoTableDndTable />
      </AutoTableFullActions>,
    );

    const idHeader = screen.getByText("ID");
    expect(idHeader).toBeInTheDocument();

    const createdAtHeader = screen.getByText("CREATED_AT");
    expect(createdAtHeader).toBeInTheDocument();

    const updatedAtHeader = screen.getByText("UPDATED_AT");
    expect(updatedAtHeader).toBeInTheDocument();

    const firstNameHeader = screen.getByText("FIRST_NAME");
    expect(firstNameHeader).toBeInTheDocument();

    const lastNameHeader = screen.getByText("LAST_NAME");
    expect(lastNameHeader).toBeInTheDocument();

    const emailHeader = screen.getByText("EMAIL");
    expect(emailHeader).toBeInTheDocument();

    const dateOfBirthHeader = screen.getByText("DATE_OF_BIRTH");
    expect(dateOfBirthHeader).toBeInTheDocument();

    const accountDisabledAtHeader = screen.getByText("ACCOUNT_DISABLED_AT");
    expect(accountDisabledAtHeader).toBeInTheDocument();
  });

  it("should apply omitColumns", () => {
    // DONE
    const users: User[] = [
      {
        id: "1",
        created_at: new Date(),
        updated_at: new Date(),
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@gmail.com",
        date_of_birth: new Date(),
      },
      {
        id: "2",
        created_at: new Date(),
        updated_at: new Date(),
        first_name: "Alice",
        last_name: "Doe",
        email: "alice.doe@gmail.com",
        date_of_birth: new Date(),
      },
    ];

    render(
      <AutoTableFullActions
        technicalTableName="user"
        schema={userSchema}
        rowIdentifierKey="id"
        data={users}
        omitColumns={{
          created_at: true,
          updated_at: true,
        }}
        onRefetchData={jest.fn()}
        onDelete={jest.fn()}
        create={{
          formSchema: userCreateSchema,
          onCreate: jest.fn(),
        }}
        update={{
          formSchema: userUpdateSchema,
          onUpdate: jest.fn(),
        }}
        renderDetails={jest.fn()}
        onDetails={jest.fn()}
      >
        <AutoTableToolbarHeader title="Users" />
        <AutoTableDndTable />
      </AutoTableFullActions>,
    );

    const idHeader = screen.getByText("id");
    expect(idHeader).toBeInTheDocument();

    const createdAtHeader = screen.queryByText("created at");
    expect(createdAtHeader).not.toBeInTheDocument();

    const updatedAtHeader = screen.queryByText("updated at");
    expect(updatedAtHeader).not.toBeInTheDocument();

    const firstNameHeader = screen.getByText("first name");
    expect(firstNameHeader).toBeInTheDocument();

    const lastNameHeader = screen.getByText("last name");
    expect(lastNameHeader).toBeInTheDocument();

    const emailHeader = screen.getByText("email");
    expect(emailHeader).toBeInTheDocument();

    const dateOfBirthHeader = screen.getByText("date of birth");
    expect(dateOfBirthHeader).toBeInTheDocument();
  });

  it("should apply extraColumns", () => {
    // DONE
    const users: User[] = [
      {
        id: "1",
        created_at: new Date(),
        updated_at: new Date(),
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@gmail.com",
        date_of_birth: new Date(),
      },
      {
        id: "2",
        created_at: new Date(),
        updated_at: new Date(),
        first_name: "Alice",
        last_name: "Doe",
        email: "alice.doe@gmail.com",
        date_of_birth: new Date(),
      },
    ];

    render(
      <AutoTableFullActions
        technicalTableName="user"
        schema={userSchema}
        rowIdentifierKey="id"
        data={users}
        extraColumns={[
          {
            id: "fullname",
            header: "fullname",
            cell: ({ row }) =>
              `${row.original.first_name} ${row.original.last_name}`,
          },
        ]}
        onRefetchData={jest.fn()}
        onDelete={jest.fn()}
        create={{
          formSchema: userCreateSchema,
          onCreate: jest.fn(),
        }}
        update={{
          formSchema: userUpdateSchema,
          onUpdate: jest.fn(),
        }}
        renderDetails={jest.fn()}
        onDetails={jest.fn()}
      >
        <AutoTableToolbarHeader title="Users" />
        <AutoTableDndTable />
      </AutoTableFullActions>,
    );

    const fullnameHeader = screen.getByText("fullname");
    expect(fullnameHeader).toBeInTheDocument();

    const johnDoe = screen.getByText("John Doe");
    expect(johnDoe).toBeInTheDocument();

    const aliceDoe = screen.getByText("Alice Doe");
    expect(aliceDoe).toBeInTheDocument();
  });

  it("should apply columnsMap to column", () => {
    // DONE
    const users: User[] = [
      {
        id: "1",
        created_at: new Date(),
        updated_at: new Date(),
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@gmail.com",
        date_of_birth: new Date(),
      },
      {
        id: "2",
        created_at: new Date(),
        updated_at: new Date(),
        first_name: "Alice",
        last_name: "Doe",
        email: "alice.doe@gmail.com",
        date_of_birth: new Date(),
      },
    ];

    render(
      <AutoTableFullActions
        technicalTableName="user"
        schema={userSchema}
        rowIdentifierKey="id"
        columnsMap={{
          email: (value) => {
            return <Button type="button">{value}</Button>;
          },
        }}
        data={users}
        onRefetchData={jest.fn()}
        onDelete={jest.fn()}
        create={{
          formSchema: userCreateSchema,
          onCreate: jest.fn(),
        }}
        update={{
          formSchema: userUpdateSchema,
          onUpdate: jest.fn(),
        }}
        renderDetails={jest.fn()}
        onDetails={jest.fn()}
      >
        <AutoTableToolbarHeader title="Users" />
        <AutoTableDndTable />
      </AutoTableFullActions>,
    );

    const johnDoeEmailBtn = screen.getByRole("button", {
      name: "john.doe@gmail.com",
    });
    expect(johnDoeEmailBtn).toBeInTheDocument();

    const aliceDoeEmailBtn = screen.getByRole("button", {
      name: "alice.doe@gmail.com",
    });
    expect(aliceDoeEmailBtn).toBeInTheDocument();
  });
});
