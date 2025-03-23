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

## Recommendation

## Common flow with independent model
### Create validation 
Create model-name.ts file inside validation folder <br />
For example let's create region.ts validation file for region model
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
Create model-name.ts file inside server/api/routers folder <br />
For example let's create region.ts router file for region model
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
Create model-name-table.tsx component file inside /components/features/[module-name] folder <br />
For example let's create regions-table.tsx component file inside /components/features/region
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

Answer 1

#### How to display nested object for row?

Answer 2

### How to add custom validation for input field?

Answer 3

### What to do if field type for combobox is not string?

Answer 4
