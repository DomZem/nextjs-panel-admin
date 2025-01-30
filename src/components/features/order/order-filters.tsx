import { useDebouncedState } from "~/hooks/use-debounced-state";
import { FilterCard } from "~/components/ui/filter";
import { type OrderStatus } from "@prisma/client";
import { FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const OrderFilters = ({
  orderId,
  onOrderIdChange,
  orderStatus,
  onOrderStatusChange,
}: {
  orderId: string;
  onOrderIdChange: (orderId: string) => void;
  orderStatus?: OrderStatus;
  onOrderStatusChange: (orderStatus?: OrderStatus) => void;
}) => {
  const { value, setValue } = useDebouncedState(orderId, 1000, onOrderIdChange);

  return (
    <FilterCard>
      <FormItem>
        <Label>id</Label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search by order id"
        />
      </FormItem>
      <FormItem>
        <Label>status</Label>
        <Select
          value={orderStatus}
          onValueChange={(value) => onOrderStatusChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Search by order status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>
      <FormItem>
        <Label>user</Label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search by order id"
        />
      </FormItem>
    </FilterCard>
  );
};
