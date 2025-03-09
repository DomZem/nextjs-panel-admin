import { OrderStatus } from "@prisma/client";
import {
  enumToSelectOptions,
  FilterCardItemSelect,
  FilterCardItemString,
} from "~/components/ui/filter";

export const OrderFilters = ({
  orderId,
  setOrderId,
  orderStatus,
  setOrderStatus,
}: {
  orderId: string;
  setOrderId: (value: string) => void;
  orderStatus: OrderStatus | "ALL";
  setOrderStatus: (value: OrderStatus | "ALL") => void;
}) => {
  return (
    <>
      <FilterCardItemString
        label="id"
        placeholder="Search by order id"
        value={orderId}
        onValueChange={setOrderId}
      />
      <FilterCardItemSelect
        label="status"
        placeholder="Search by order status"
        value={orderStatus}
        options={enumToSelectOptions(OrderStatus)}
        onValueChange={setOrderStatus}
      />
    </>
  );
};
