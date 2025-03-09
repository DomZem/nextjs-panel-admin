import { UserRole } from "@prisma/client";
import {
  enumToSelectOptions,
  FilterCardItemSelect,
  FilterCardItemString,
} from "~/components/ui/filter";

export const UserFilters = ({
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  userRole,
  setUserRole,
}: {
  userName: string;
  setUserName: (value: string) => void;
  userEmail: string;
  setUserEmail: (value: string) => void;
  userRole: UserRole | "ALL";
  setUserRole: (value: UserRole | "ALL") => void;
}) => {
  return (
    <>
      <FilterCardItemString
        label="name"
        placeholder="Search by user name"
        value={userName}
        onValueChange={setUserName}
      />
      <FilterCardItemString
        label="email"
        placeholder="Search by user email"
        value={userEmail}
        onValueChange={setUserEmail}
      />
      <FilterCardItemSelect
        label="role"
        placeholder="Search by user role"
        value={userRole}
        options={enumToSelectOptions(UserRole)}
        onValueChange={setUserRole}
      />
    </>
  );
};
