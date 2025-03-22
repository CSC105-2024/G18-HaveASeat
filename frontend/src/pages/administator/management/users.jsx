import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form.jsx";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const users = [
  {
    "name": "Nicole Bars",
    "phone": "0818884444",
    "role": "administrator",
    "email": "nicoleBars@gmail.com",
    "birthday": new Date(),
  },
]

const FormSchema = z.object({
  search: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

function Page(props) {
  /** @type {import("react-hook-form").UseFormReturn<z.infer<typeof FormSchema>>} */
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
    },
  })

  /**
   * @param {ReturnType<typeof FormSchema["parse"]>} data
   */
  function onSubmit(data) {
    toast.message("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          {FormSchema.parse(data)}
        </pre>
      ),
    });
  }

  return (
    <div>
      <div>

      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-4 items-center">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="hidden">Search</FormLabel>
                  <FormControl>
                    <Input placeholder="Search" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Search</Button>
            <Button type="button">Add User</Button>
          </form>
        </Form>
        <div>

        </div>
      </div>
    </div>
  );
}

export default Page;