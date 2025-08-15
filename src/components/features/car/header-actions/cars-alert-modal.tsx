import { useAtom } from "jotai";

import { AlertDialog, AlertDialogContent } from "~/components/ui/alert-dialog";

import { carsHeaderActionsStore } from "~/stores/car/cars-header-actions";
import { useAutoTable } from "~/components/auto-table/providers/auto-table-provider";
import type { carSchema } from "~/common/validations/car/car";
import { CarsDeleteMany } from "./cars-delete-many";

export const CarsAlertModal = () => {
  const { setSelectedRows } = useAutoTable<typeof carSchema>();
  const [headerAction, setHeaderAction] = useAtom(carsHeaderActionsStore);

  return (
    <AlertDialog
      open={headerAction !== null}
      onOpenChange={() => setSelectedRows([])}
    >
      <AlertDialogContent onCloseAutoFocus={() => setHeaderAction(null)}>
        {headerAction === "delete-many" && <CarsDeleteMany />}
      </AlertDialogContent>
    </AlertDialog>
  );
};
