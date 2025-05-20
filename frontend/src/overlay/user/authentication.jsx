import React, { Fragment, useState } from "react";
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
import axiosInstance from "@/lib/axios.js";
import { useAuthStore } from "@/store/auth.js";
import { useNavigate } from "react-router";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, "Please enter a password"),
});

function SignInOverlay() {
  const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useModalStore();
  const { signIn } = useAuthStore();
  const navigate = useNavigate();

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
  async function onSubmit(data) {
    setIsLoading(true);
    try {
      await signIn(data);
      toast.success("Successfully signed in!");
      closeModal("sign-in");
      navigate(0);
    } catch (error) {
      console.error("Sign in error:", error);
      if (error.response?.status === 401) {
        toast.error("Invalid credentials");
      } else {
        toast.error("An error occurred during sign in");
      }
    } finally {
      setIsLoading(false);
    }
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
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
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

function UserSignOutOverlay() {
  const { closeModal } = useModalStore();
  const { signOut } = useAuthStore();

  function onSignOut() {
    signOut();
    toast.success("Successfully signed out");
    closeModal("user-sign-out");
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Button
        onClick={onSignOut}
        className="w-full flex-1"
        variant="destructive"
      >
        Confirm
      </Button>
      <Button
        onClick={() => closeModal("user-sign-out")}
        className="w-full flex-1"
        variant="secondary"
      >
        Back
      </Button>
    </div>
  );
}

const useSignOutOverlay = createModalHook(
  UserSignOutOverlay,
  "user-sign-out",
  "Sign Out",
  <Fragment>
    Are you sure to sign out from our platform?{" "}
    <span className="text-red-500">
      We are sad to see you go, but see you again soon!
    </span>
  </Fragment>,
);

export {
  useSignInOverlay,
  SignInOverlay,
  useSignOutOverlay,
  UserSignOutOverlay,
};
