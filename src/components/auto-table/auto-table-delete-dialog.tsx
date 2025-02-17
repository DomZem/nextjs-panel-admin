"use client";

import { type ZodObjectSchema } from "~/utils/zod";
import {
  type IUseDeleteAutoTableData,
  useDeleteAutoTableData,
} from "~/hooks/auto-table/use-delete-auto-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export const AutoTableDeleteDialog = <TSchema extends ZodObjectSchema>({
  title,
  description,
  onDelete,
}: IUseDeleteAutoTableData<TSchema> & {
  title?: string;
  description?: string;
}) => {
  const { isDeleteActionActive, handleDelete, handleClose } =
    useDeleteAutoTableData({
      onDelete,
    });

  return (
    <AlertDialog open={isDeleteActionActive} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title ?? "Are you absolutely sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ??
              "This action cannot be undone. This will permanently delete data from our servers."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
