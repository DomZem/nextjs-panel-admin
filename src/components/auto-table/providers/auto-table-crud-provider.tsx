import { type IUseDeleteAutoTableData } from "~/hooks/auto-table/use-delete-auto-table";
import { AutoTableDeleteDialog } from "../auto-table-delete-dialog";
import React, { type ComponentProps } from "react";
import { type ZodObjectSchema } from "~/utils/zod";
import {
  AutoTableProvider,
  type AutoTableImplementationProps,
} from "./auto-table-provider";
import {
  AutoTableCreateFormSheet,
  AutoTableUpdateFormSheet,
} from "../auto-table-form";

export interface IAutoTableCrudProvider<
  TSchema extends ZodObjectSchema,
  TCreateFormSchema extends ZodObjectSchema,
  TUpdateFormSchema extends ZodObjectSchema,
> extends AutoTableImplementationProps<TSchema>,
    IUseDeleteAutoTableData<TSchema> {
  create: ComponentProps<typeof AutoTableCreateFormSheet<TCreateFormSchema>>;
  update: ComponentProps<
    typeof AutoTableUpdateFormSheet<TUpdateFormSchema, TSchema>
  >;
}

export const AutoTableCrudProvider = <
  TSchema extends ZodObjectSchema,
  TCreateFormSchema extends ZodObjectSchema,
  TUpdateFormSchema extends ZodObjectSchema,
>({
  schema,
  rowIdentifierKey,
  onRefetchData,
  onDelete,
  create,
  update,
  children,
}: IAutoTableCrudProvider<TSchema, TCreateFormSchema, TUpdateFormSchema> & {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <AutoTableProvider
        schema={schema}
        rowIdentifierKey={rowIdentifierKey}
        onRefetchData={onRefetchData}
      >
        {children}

        <AutoTableDeleteDialog onDelete={onDelete} />

        <AutoTableCreateFormSheet
          formSchema={create.formSchema}
          onCreate={create.onCreate}
          fieldsConfig={create.fieldsConfig}
          defaultValues={create.defaultValues}
        />

        <AutoTableUpdateFormSheet
          formSchema={update.formSchema}
          onUpdate={update.onUpdate}
          fieldsConfig={update.fieldsConfig}
        />
      </AutoTableProvider>
    </div>
  );
};
