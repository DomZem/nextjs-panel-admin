import { OrdersTable } from "~/components/features/order/orders-table";
import { MainWrapper } from "~/components/ui/main-wrapper";

export default function OrdersPage() {
  return (
    <MainWrapper>
      <OrdersTable />
    </MainWrapper>
  );
}
