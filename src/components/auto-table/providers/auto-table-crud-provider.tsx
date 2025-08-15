import { type IUseDeleteAutoTableData } from "~/hooks/auto-table/use-delete-auto-table";
import { AutoTableDeleteDialog } from "../auto-table-delete-dialog";
import { type IAutoForm } from "~/types/auto-form";
import React, { type ComponentProps } from "react";
import {
  AutoTableProvider,
  type AutoTableImplementationProps,
} from "./auto-table-provider";
import {
  AutoTableCreateFormSheet,
  AutoTableUpdateFormSheet,
} from "../auto-table-form";
import {
  type ZodDiscriminatedObjectSchema,
  type ZodObjectSchema,
} from "~/types/zod";

export interface IAutoTableCrudProvider<
  TSchema extends ZodObjectSchema,
  TFormSchema extends ZodObjectSchema | ZodDiscriminatedObjectSchema,
> extends AutoTableImplementationProps<TSchema>,
    IUseDeleteAutoTableData<TSchema> {
  autoForm: {
    formSchema: TFormSchema;
    create: Omit<
      ComponentProps<typeof AutoTableCreateFormSheet<TFormSchema>>,
      "formSchema" | "fieldsConfig"
    >;
    update: Omit<
      ComponentProps<typeof AutoTableUpdateFormSheet<TFormSchema, TSchema>>,
      "formSchema" | "fieldsConfig"
    >;
  } & Pick<IAutoForm<TFormSchema>, "fieldsConfig">;
}

export const AutoTableCrudProvider = <
  TSchema extends ZodObjectSchema,
  TFormSchema extends ZodObjectSchema | ZodDiscriminatedObjectSchema,
>({
  schema,
  technicalTableName,
  rowIdentifierKey,
  onRefetchData,
  onDelete,
  autoForm,
  children,
}: IAutoTableCrudProvider<TSchema, TFormSchema> & {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <AutoTableProvider
        schema={schema}
        technicalTableName={technicalTableName}
        rowIdentifierKey={rowIdentifierKey}
        onRefetchData={onRefetchData}
      >
        {children}

        <AutoTableDeleteDialog onDelete={onDelete} />

        <AutoTableCreateFormSheet
          formSchema={autoForm.formSchema}
          fieldsConfig={autoForm.fieldsConfig}
          onCreate={autoForm.create.onCreate}
          isSubmitting={autoForm.create.isSubmitting}
          defaultValues={autoForm.create.defaultValues}
        />

        <AutoTableUpdateFormSheet
          formSchema={autoForm.formSchema}
          onUpdate={autoForm.update.onUpdate}
          isSubmitting={autoForm.update.isSubmitting}
          fieldsConfig={autoForm.fieldsConfig}
        />
      </AutoTableProvider>
    </div>
  );
};
