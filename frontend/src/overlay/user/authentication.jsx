import React, { Fragment } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { useModalStore } from "@/store/modal.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRequiredLabel,
} from "@/components/ui/form.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useForgetPasswordOverlay } from "@/overlay/user/forget-password.jsx";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, "Please enter a password")
});

function SignInOverlay() {
  const { open: openForgetPasswordOverlay } = useForgetPasswordOverlay();
  const { closeModal } = useModalStore();

  /** @type {import("react-hook-form").UseFormReturn<z.infer<typeof formSchema>>} */
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
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

  function onSwapOverlay() {
    closeModal("sign-in");
    openForgetPasswordOverlay({});
  }

  return (
    <div className="space-y-4 pt-4">
      <h1 className="text-xl font-semibold">Sign In</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email Address <FormRequiredLabel />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password <FormRequiredLabel />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <Button type="submit" className="w-full">
              Sign in
            </Button>
            <span
              onClick={onSwapOverlay}
              className="mx-auto block w-fit cursor-default text-center text-sm underline underline-offset-4 transition hover:scale-105"
            >
              Forget Password?
            </span>
          </div>
        </form>
      </Form>
    </div>
  );
}

const useSignInOverlay = createModalHook(
  SignInOverlay,
  "sign-in",
  "Have A Seat",
  <Fragment>
    Book It. Sip It. Love It.{" "}
    <span className="text-red-500">*Required fields.</span>
  </Fragment>,
);

export { useSignInOverlay, SignInOverlay };
