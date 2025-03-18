import { UserTransactionsTable } from "~/components/features/user/user-transactions-table";
import { UserAddressesTable } from "~/components/features/user/user-addresses-table";

export default function UserDetailsPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <main className="grid grid-rows-2 gap-4 overflow-hidden p-4">
      <UserAddressesTable userId={params.id} />
      <UserTransactionsTable userId={params.id} />
    </main>
  );
}
