## Installation

Clone project

```bash
git clone https://github.com/DomZem/nextjs-panel-admin
```

Go to the project directory

```bash
cd nextjs-panel-admin
```

Install dependencies

```bash
npm install
```

Create dev db

```bash
docker compose up -d
```

Seed dev db

```bash
npm run seed:dev
```

Run dev app

```bash
npm run dev
```

## Todo List

- [x] Feat: add saving selected columns to display in local storage
- [x] Feat: add scroll to sheet
- [x] Feat: add option to add default value for field through prop in auto form
- [x] Feat: add combobox to choose relation data. Ex. adding user to order, or adding product to order_item model
- [x] Feat: add another variant of auto table without required onDetails and renderDetails
- [x] Feat: add wysiwg editor as input to auto form
- [x] Feat: add component for date input
- [x] Fix: `value` prop on `input` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components It appears on update product
- [x] Feat: add to each input in auto form which can be nullable button that will set the field to null
- [x] Feat: add filters between header and table
- [ ] Fix: after refresh selected row disappear
- [x] Feat: added columns map to auto table. By adding that i will be able to modify the end result of column. Like for example rendering user avatar
- [x] Feat: add saving columns order in local storage for dnd table
- [x] Fix: add clear option to filters
- [x] Fix: fix issue with clearing values in update form for nullable inputs
- [x] Fix: after add some fields to existing models, dragging columns is not possible
- [x] Test: add basic tests for AutoForm in jest
- [x] Fix: on mobile view filters takes a lot of space. We should hide them some where
- [x] Feat: replace date-fns by dayjs in date time picker
- [x] Test: add some tests for auto table
- [ ] Fix: fix issue with no handle discriminated unions in auto form
- [ ] Fix: clear value in auto form for textarea not working

## Recommendation

## Common flow with independent model
### Create validation 
Create model-name.ts file inside validation folder. <br />
For example let's create region.ts validation file for region model.
```typescript
import { RegionScalarSchema } from "~/zod-schemas/models";

export const regionSchema = RegionScalarSchema;

export const regionUpdateSchema = regionSchema.omit({
  created_at: true,
  updated_at: true,
});

export const regionCreateSchema = regionUpdateSchema.omit({
  id: true,
});
```
```bash
💡 Tip: Whenever you are creating validation for independent model use ScalarSchema
```

### Create router
Create model-name.ts file inside server/api/routers folder. <br />
For example let's create region.ts router file for region model.
```typescript
import { adminProcedure, createTRPCRouter } from "../../trpc";
import { RegionScalarSchema } from "~/zod-schemas/models";
import {
  regionCreateSchema,
  regionUpdateSchema,
} from "~/common/validations/region/region";

export const regionRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) => {
    const regions = await ctx.db.region.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return regions;
  }),
  getOne: adminProcedure
    .input(RegionScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.region.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
  createOne: adminProcedure
    .input(regionCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.region.create({
        data: input,
      });

      return result;
    }),
  updateOne: adminProcedure
    .input(regionUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.region.update({
        where: {
          id: input.id,
        },
        data: input,
      });

      return result;
    }),
  deleteOne: adminProcedure
    .input(RegionScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.region.delete({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
});
```

### Create table
Create model-name-table.tsx component file inside /components/features/[module-name] folder. <br />
For example let's create regions-table.tsx component file inside /components/features/region.
```typescript
export const RegionsTable = () => {
  const getAllRegions = api.region.getAll.useQuery();
  const deleteRegion = api.region.deleteOne.useMutation();
  const createRegion = api.region.createOne.useMutation();
  const updateRegion = api.region.updateOne.useMutation();
  const getRegionDetails = api.region.getOne.useMutation();

  return (
    <AutoTableContainer>
      <AutoTableFullActions
        technicalTableName="regions"
        schema={regionSchema}
        rowIdentifierKey="id"
        data={getAllRegions.data ?? []}
        onRefetchData={getAllRegions.refetch}
        onDetails={async (row) =>
          await getRegionDetails.mutateAsync({
            id: row.id,
          })
        }
        onDelete={async (row) => await deleteRegion.mutateAsync({ id: row.id })}
        renderDetails={(region) => {
          return (
            <div className="space-y-4">
              <RegionCountriesTable regionId={region.id} />
            </div>
          );
        }}
        create={{
          formSchema: regionCreateSchema,
          onCreate: createRegion.mutateAsync,
        }}
        update={{
          formSchema: regionUpdateSchema,
          onUpdate: updateRegion.mutateAsync,
          fieldsConfig: {
            id: {
              hidden: true,
            },
          },
        }}
      >
        <AutoTableToolbarHeader title="Regions" />

        <AutoTableDndTable
          extraRow={(row) => <AutoTableDetailsRow rowId={row.id} />}
        />
      </AutoTableFullActions>
    </AutoTableContainer>
  );
};
```

## FAQ

#### How to use combobox as custom input?
First create model-name-combobox.tsx component file inside /components/features/[model-name]. <br />
Example: 
```typescript
import { FormItem, FormLabel } from "~/components/ui/form";
import { Combobox } from "~/components/ui/combobox";
import { api } from "~/trpc/react";
import { useState } from "react";

export const UserCombobox = ({
  selectedValue,
  onSelect,
}: {
  selectedValue?: string;
  onSelect: (value: string) => void;
}) => {
  const [searchValue, setSearchValue] = useState("");

  const getSearchUsers = api.user.getSearchUsers.useQuery({
    name: searchValue,
  });

  const userOptions =
    getSearchUsers.data?.map((user) => ({
      value: user.id,
      label: user.name ?? "",
    })) ?? [];

  return (
    <FormItem>
      <FormLabel>user</FormLabel>
      <Combobox
        options={userOptions}
        onInputChange={setSearchValue}
        onSelect={onSelect}
        selectedValue={selectedValue}
        emptyPlaceholder="No user found."
        searchPlaceholder="Search user..."
        selectPlaceholder="Select user..."
      />
    </FormItem>
  );
};
```
```typescript
getSearchUsers: adminProcedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.name) {
        const users = await ctx.db.user.findMany({
          take: 5,
          orderBy: {
            id: "asc",
          },
          select: {
            id: true,
            name: true,
          },
        });

        return users;
      }

      const filteredUsers = await ctx.db.user.findMany({
        where: {
          name: {
            contains: input.name,
          },
        },
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      });

      return filteredUsers;
    }),
```
Then use that component as custom field type in AutoForm
```typescript
user_id: {
  type: "custom",
  render: ({ field }) => {
    return (
      <UserCombobox
        selectedValue={field.value}
        onSelect={field.onChange}
      />
    );
  },
},
```

#### How to display value from nested object?
In order to display value from nested object you have to merge field to schema and then map getAll method in router. <br />
For example, let's say for order model you want to display which user created order.
```typescript
const orderSchema = orderRawSchema.merge(
  z.object({
    username: z.string(),
  }),
);
```
```typescript
const orders = await ctx.db.order.findMany({
        where,
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
        orderBy: {
          id: "asc",
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });
 const mappedOrders = orders.map(({ user, ...rest }) => ({
        ...rest,
        username: user.name!,
      }));
```

#### How to add custom validation for input field?
In order to add custom validation for input field you have to omit that field and then merge with validation.
```typescript
export const regionUpdateSchema = regionSchema
  .omit({
    created_at: true,
    updated_at: true,
  })
  .omit({
    name: true,
  })
  .merge(
    z.object({
      name: z.string().min(3).max(255),
    }),
  );
```

#### What to do if field type for combobox is not string?
When the field type for comobobox is not a string, but for example the number. All you have to do is: 
1. Allow `selectedValue` prop inside model-name-combobox.tsx file to be that type.
   ```typescript
   export const RegionCountryCombobox = ({
    selectedValue,
    onSelect,
   }: {
    selectedValue?: string | number;
    onSelect: (value: string) => void;
   }) => {
   };
   ```
2. Add `coerce` to field that is using combobox as component.
   ```typescript
   const userAddressFormSchema = userAddressSchema
     .omit({
       region_country_id: true,
     })
     .merge(
       z.object({
         region_country_id: z.coerce.number(),
       }),
     );
   ```
