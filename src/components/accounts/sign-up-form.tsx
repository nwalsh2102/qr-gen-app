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
import Link from "next/link";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Please enter a longer name" })
    .max(255, { message: "Please enter a shorter name" }),
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

export default function SignUpForm() {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    try {
      const result = await createUser(values);

      if (result.success) {
        toast.success("Account created successfully!");
        // Add a 2-second delay before redirecting
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push("/signin"); // Redirect to sign in page
      } else {
        toast.error(result.error || "Failed to create account");
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
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Sign up for the QR Gen</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input className="border-gray-200" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
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
            {/* <Button
              type="submit"
              className="cursor-pointer"
              disabled={submitting}
            >
              Submit
            </Button> */}
            {submitting ? (
              <Button type="submit" className="cursor-pointer">
                <Loader2Icon className="animate-spin" />
                Creating Account...
              </Button>
            ) : (
              <Button type="submit" className="cursor-pointer">
                Create Account
              </Button>
            )}
          </form>
          <div className="mt-5">
            <p>
              Already have an account?{" "}
              <Link href="/signin" className="text-accent">
                Login
              </Link>
            </p>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
