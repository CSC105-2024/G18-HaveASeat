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

const users = [
  {
    id: 1,
    name: "Sam Bars",
    message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error hic maxime quis quo, sequi tempore. Ad animi architecto at corporis, cupiditate eum laborum natus necessitatibus nesciunt praesentium quia quos reprehenderit."
  },
];

const FormSchema = z.object({
  search: z.string({
    required: true,
  }),
});

function Page(props) {
  const { open: openReportIgnoreOverlay } = useReportIgnoreOverlay();
  const { open: openReportDeleteOverlay } = useReportDeleteOverlay();

  function onReportIgnore(id) {
    openReportIgnoreOverlay({});
  }

  function onReportDelete(id) {
    openReportDeleteOverlay({});
  }

  return (
    <div className="flex flex-col gap-8 px-4">
      <div className="mx-auto flex min-h-[30svh] w-full max-w-7xl flex-col items-center justify-center gap-4 rounded-xl bg-gray-50 text-center">
        <h1 className="text-3xl font-bold">Report Center</h1>
        <p>Manage all reports from users</p>
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <div className="flex flex-col gap-4">
          {users.map((report) => (
            <div
              key={report.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4"
            >
              <div className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarFallback className="font-semibold uppercase">
                    {report.name.at(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <span className="font-semibold">{report.name}</span>
                  <p className="text-sm">{report.message}</p>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <Button className="w-full flex-1" onClick={() => onReportIgnore(report.id)} variant="secondary">
                  Ignore
                </Button>
                <Button
                  className="w-full flex-1"
                  onClick={() => onReportDelete(report.id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
