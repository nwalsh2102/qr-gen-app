"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { createUser } from "@/app/actions/create-user";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/actions/login-user";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter an email" })
    .min(3, { message: "Please enter a longer email" })
    .max(255, { message: "Please enter a shorter email" }),
  password: z
    .string()
    .min(8, { message: "Please enter a longer password" })
    .max(32, { message: "Please enter a shorter password" }),
});

export default function LogInForm() {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    try {
      const result = await loginUser(values);

      if (result.success) {
        toast.success("Logged in successfully!");
        // Add a 2-second delay before redirecting
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        window.location.replace("/codes");
        // router.push("/codes"); // Redirect to sign in page
      } else {
        toast.error(result.error || "Failed to login");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to QR gen</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="border-gray-200"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="border-gray-200"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="animate-spin" /> Logging in...
                </div>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-5">
          <p>
            Don't have an account?{" "}
            <Link href="/signup" className="text-accent">
              Create one
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
