"use client";

import { authClient } from "@/lib/auth-client";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import NotAuthorizedCard from "../not-authorized";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "../ui/switch";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const formSchema = z.object({
  darkMode: z.boolean(),
});

export default function SettingsForm() {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  if (!session) return <NotAuthorizedCard />;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      darkMode: false,
    },
  });

  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    // Add a 1-second delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Settings Saved.", {
      className: "font-sans",
      descriptionClassName: "font-sans",
    });

    console.log(values);

    setSubmitting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Settings for user, {session?.user.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="darkMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dark Mode</FormLabel>
                  <FormDescription className="text-gray-500/50 text-sm">
                    If on, dark mode will be enabled throughout the site.
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="cursor-pointer"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="mt-5">
              {submitting ? (
                <Button type="submit" className="cursor-pointer">
                  <Loader2Icon className="animate-spin" />
                  Saving...
                </Button>
              ) : (
                <Button type="submit" className="cursor-pointer">
                  Save
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
