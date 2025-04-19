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
import { useReportIgnoreOverlay } from "@/overlay/report/ignore.jsx";
import { useReportDeleteOverlay } from "@/overlay/report/delete.jsx";
import AdministratorLayout from "@/components/layout/administrator.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { ReportDataTable } from "@/components/datatable/administrator/reports/table.jsx";

const reports = [
  {
    id: 1,
    author: "Sam Bars",
    content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error hic maxime quis quo, sequi tempore. Ad animi architecto at corporis, cupiditate eum laborum natus necessitatibus nesciunt praesentium quia quos reprehenderit."
  },
];

function Page(props) {
  return (
    <AdministratorLayout>
      <div className="flex flex-col gap-8 px-4">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Reports Management</h2>
          <Separator />
        </div>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
          <div className="flex flex-col gap-4">
            <ReportDataTable data={reports} />
          </div>
        </div>
      </div>
    </AdministratorLayout>
  );
}

export default Page;
