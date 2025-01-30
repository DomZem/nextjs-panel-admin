import { useDebouncedState } from "~/hooks/use-debounced-state";
import { FilterCard } from "~/components/ui/filter";
import { FormItem } from "~/components/ui/form";
import { type UserRole } from "@prisma/client";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const UserFilters = ({
  userName,
  onUserNameChange,
  userEmail,
  onUserEmailChange,
  userRole,
  onUserRoleChange,
}: {
  userName: string;
  onUserNameChange: (userName: string) => void;
  userEmail: string;
  onUserEmailChange: (userEmail: string) => void;
  userRole?: UserRole;
  onUserRoleChange: (userRole?: UserRole) => void;
}) => {
  const { value: userNameValue, setValue: setUserNameValue } =
    useDebouncedState(userName, 1000, onUserNameChange);

  const { value: userEmailValue, setValue: setUserEmailValue } =
    useDebouncedState(userEmail, 1000, onUserEmailChange);

  return (
    <FilterCard className="">
      <FormItem>
        <Label>name</Label>
        <Input
          value={userNameValue}
          onChange={(e) => setUserNameValue(e.target.value)}
          placeholder="Search by user name"
        />
      </FormItem>
      <FormItem>
        <Label>email</Label>
        <Input
          value={userEmailValue}
          onChange={(e) => setUserEmailValue(e.target.value)}
          placeholder="Search by user email"
        />
      </FormItem>
      <FormItem>
        <Label>role</Label>
        <Select
          value={userRole}
          onValueChange={(value) => onUserRoleChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Search by user role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>
    </FilterCard>
  );
};
