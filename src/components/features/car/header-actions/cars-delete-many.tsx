import { useSetAtom } from "jotai";
import type { carSchema } from "~/common/validations/car/car";
import { useAutoTable } from "~/components/auto-table/providers/auto-table-provider";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { toast } from "~/hooks/use-toast";
import { carsHeaderActionsStore } from "~/stores/car/cars-header-actions";
import { api } from "~/trpc/react";

export const CarsDeleteMany = () => {
  const { selectedRows, refetchData } = useAutoTable<typeof carSchema>();
  const setHeaderAction = useSetAtom(carsHeaderActionsStore);

  const deleteManyCars = api.car.deleteMany.useMutation({
    onSuccess: async () => {
      toast({
        title: "Cars deleted",
        description: "Selected cars have been successfully deleted",
      });

      await refetchData();
    },
    onError: (error) => {
      toast({
        title: "Error deleting cars",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteMany = async () => {
    await deleteManyCars.mutateAsync({
      ids: selectedRows.map((row) => row.id),
    });
  };

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This will force a server issue for the deathmatch. Please confirm that
          you want to proceed with this action.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel
          onClick={() => {
            setHeaderAction(null);
          }}
        >
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={handleDeleteMany}
          disabled={deleteManyCars.isPending}
        >
          {deleteManyCars.isPending ? "Deleting..." : "Delete"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
};
