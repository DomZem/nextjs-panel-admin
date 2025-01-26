"use client";

import { AutoForm, type AutoFormProps } from "../ui/auto-form";
import { sanitizeSchemaObject } from "~/utils/auto-form";
import {
  type IUseUpdateAutoTableData,
  useUpdateAutoTableData,
} from "~/hooks/auto-table/use-update-auto-table-data";
import {
  type IUseCreateAutoTableData,
  useCreateAutoTableData,
} from "~/hooks/auto-table/use-create-auto-table-data";
import { useAutoTable } from "./auto-table-provider";
import { mapDashedFieldName } from "~/utils/mappers";
import { type DefaultValues } from "react-hook-form";
import { type ZodObjectSchema } from "~/utils/zod";
import { ScrollArea } from "../ui/scroll-area";
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
      <SheetContent className="p-2 sm:max-w-md">
        <SheetHeader className="p-4 pb-0">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className="sr-only">{description}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full">
          <div className="mb-11 p-4">{children}</div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export const AutoTableCreateFormSheet = <TFormSchema extends ZodObjectSchema>({
  defaultValues,
  fieldsConfig,
  formSchema,
  onCreate,
}: Pick<AutoFormProps<TFormSchema>, "fieldsConfig" | "defaultValues"> &
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
        defaultValues={defaultValues}
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
}: Pick<AutoFormProps<TFormSchema>, "fieldsConfig" | "defaultValues"> &
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
