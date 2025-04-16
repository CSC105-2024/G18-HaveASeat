import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.jsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconUserPlus, IconUserSearch } from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { useUserEditOverlay } from "@/overlay/user/edit.jsx";
import { useUserDeleteOverlay } from "@/overlay/user/delete.jsx";
import { useUserAddOverlay } from "@/overlay/user/add.jsx";
import AdministratorLayout from "@/components/layout/administrator.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { UserDataTable } from "@/components/datatable/administrator/users/table.jsx";

const users = [
  {
    id: 1,
    name: "Nicole Bars",
    phone: "0818884444",
    isAdmin: false,
    email: "nicoleBars@gmail.com",
    birthday: new Date(),
  },
  {
    id: 2,
    name: "Sam Bars",
    phone: "0818884444",
    isAdmin: true,
    email: "nicoleBars@gmail.com",
    birthday: new Date(),
  },
];

function Page(props) {
  const { open: openUserAddOverlay } = useUserAddOverlay();

  return (
    <AdministratorLayout>
      <div className="flex flex-col gap-8 px-4">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Users Management</h2>
          <Separator />
        </div>
        <div className="flex flex-col gap-12">
          <div className="space-y-4">
            <UserDataTable data={users} />
          </div>
        </div>
      </div>
    </AdministratorLayout>
  );
}

export default Page;
