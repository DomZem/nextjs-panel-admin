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
- [ ] Feat: add some tests for auto table

## Example documentation
1. How to use combobox as custom input
2. Example structure of folders
3. How can I add custom column when my data row has nested data ?

## Common Errors
1. What to do if my field type for combobox is not string?
