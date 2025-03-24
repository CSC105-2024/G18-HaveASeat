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

const users = [
  {
    id: 1,
    name: "Nicole Bars",
    phone: "0818884444",
    role: "administrator",
    email: "nicoleBars@gmail.com",
    birthday: new Date(),
  },
  {
    id: 2,
    name: "Sam Bars",
    phone: "0818884444",
    role: "administrator",
    email: "nicoleBars@gmail.com",
    birthday: new Date(),
  },
];

const FormSchema = z.object({
  search: z.string({
    required: true,
  }),
});

function Page(props) {
  const { open: openUserAddOverlay } = useUserAddOverlay();

  const { open: openUserEditOverlay } = useUserEditOverlay();
  const { open: openUserDeleteOverlay } = useUserDeleteOverlay();

  /** @type {import("react-hook-form").UseFormReturn<z.infer<typeof FormSchema>>} */
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
    },
  });

  /**
   * @param {ReturnType<typeof FormSchema["parse"]>} data
   */
  function onSubmit(data) {
    toast.message("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  function onUserEdit(id) {
    openUserEditOverlay({ editMode: true });
  }

  function onUserDelete(id) {
    openUserDeleteOverlay({});
  }

  return (
    <div className="flex flex-col gap-8 px-4">
      <div className="mx-auto flex min-h-[30svh] w-full max-w-7xl flex-col items-center justify-center gap-4 rounded-xl bg-gray-50 text-center">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p>Manage all users on our platform</p>
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-start gap-2 md:flex-row"
          >
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="w-full flex-1">
                  <FormLabel className="hidden">Search</FormLabel>
                  <FormControl>
                    <Input placeholder="Search" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-fit">
              <Button type="submit" className="w-full flex-1">
                <IconUserSearch />
                Search
              </Button>
              <Button onClick={() => openUserAddOverlay({addMode: true})} type="button" className="w-full flex-1" variant="secondary">
                <IconUserPlus />
                Add User
              </Button>
            </div>
          </form>
        </Form>
        <div className="flex flex-col gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4"
            >
              <div className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarFallback className="font-semibold uppercase">
                    {user.name.at(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold">{user.name}</span>
              </div>
              <div className="flex flex-row gap-4">
                <Button className="w-full flex-1" onClick={() => onUserEdit(user.id)} variant="secondary">
                  Edit
                </Button>
                <Button
                  className="w-full flex-1"
                  onClick={() => onUserDelete(user.id)}
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
