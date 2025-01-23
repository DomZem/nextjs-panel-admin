"use client";

import { type DefaultValues } from "react-hook-form";
import { type TypeOf } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { AutoForm, type AutoFormProps } from "../ui/auto-form";
import { type ZodObjectSchema } from "~/utils/zod";
import { sanitizeSchemaObject } from "~/utils/auto-form";
import { mapDashedFieldName } from "~/utils/mappers";
import {
  type IUseUpdateAutoTableData,
  useUpdateAutoTableData,
} from "~/hooks/auto-table/use-update-auto-table-data";
import {
  type IUseCreateAutoTableData,
  useCreateAutoTableData,
} from "~/hooks/auto-table/use-create-auto-table-data";
import { useAutoTable } from "./auto-table-provider";

export const AutoTableDialog = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export const AutoTableSheet = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className="sr-only">{description}</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
};

export const AutoTableCreateFormSheet = <TFormSchema extends ZodObjectSchema>({
  fieldsConfig,
  onCreate,
  formSchema,
}: Pick<AutoFormProps<TFormSchema>, "fieldsConfig"> &
  IUseCreateAutoTableData<TFormSchema> & {
    formSchema: TFormSchema;
  }) => {
  const { isCreateActionActive, handleCreate, handleClose } =
    useCreateAutoTableData({
      onCreate,
    });

  return (
    <AutoTableSheet
      isOpen={isCreateActionActive}
      title="Create"
      description="Create a new row"
      onClose={handleClose}
    >
      <AutoForm
        schema={formSchema}
        fieldsConfig={fieldsConfig}
        mapLabel={mapDashedFieldName}
        onSubmit={handleCreate}
      />
    </AutoTableSheet>
  );
};

export const AutoTableUpdateFormSheet = <
  TFormSchema extends ZodObjectSchema,
  TSchema extends ZodObjectSchema,
>({
  fieldsConfig,
  formSchema,
  onUpdate,
}: Pick<AutoFormProps<TFormSchema>, "fieldsConfig"> &
  IUseUpdateAutoTableData<TFormSchema, TSchema> & {
    formSchema: TFormSchema;
  }) => {
  const { selectedRow } = useAutoTable<TSchema>();

  const { isUpdateActionAcitve, handleUpdate, handleClose } =
    useUpdateAutoTableData({
      onUpdate,
    });

  const defaultValues = selectedRow
    ? (sanitizeSchemaObject(selectedRow, formSchema) as DefaultValues<
        TypeOf<TFormSchema>
      >)
    : undefined;

  return (
    <AutoTableSheet
      isOpen={isUpdateActionAcitve}
      title="Update"
      description="Update the row"
      onClose={handleClose}
    >
      <AutoForm
        schema={formSchema}
        fieldsConfig={fieldsConfig}
        mapLabel={mapDashedFieldName}
        defaultValues={defaultValues}
        onSubmit={handleUpdate}
      />
    </AutoTableSheet>
  );
};
