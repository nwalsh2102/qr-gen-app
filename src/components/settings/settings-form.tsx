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
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Loader, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { updateUserSettings } from "@/app/actions/update-user-settings";
import { useTheme } from "next-themes";
import { SettingsFormProps } from "@/lib/initial-settings";

const formSchema = z.object({
  darkMode: z.boolean(),
});

// Accept initialSettings as a prop
export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const {
    data: session,
    isPending, //loading state from the hook
    error,
    refetch,
  } = authClient.useSession();

  const { theme, setTheme } = useTheme();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      darkMode: initialSettings?.darkMode ?? false,
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Render nothing or a minimal loading state until the client is ready and session hook resolves
  if (!isClient || isPending) {
    return (
      <div className="flex gap-3 items-center">
        <Loader size={20} className="animate-spin" />
        Loading settings...
      </div>
    ); // Can use a more sophisticated spinner
  }

  // Handle unauthorized state after the hook has resolved and we are on the client
  if (!session) {
    return <NotAuthorizedCard />;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    // Add a 1-second delay
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Call the server action to update settings
      const result = await updateUserSettings({
        darkMode: values.darkMode,
        // Pass other settings fields here
      });

      if (result.success) {
        toast.success("Settings Saved.", {
          className: "font-sans",
          descriptionClassName: "font-sans",
        });

        setTheme(values.darkMode ? "dark" : "light");

        // Optional: re-fetch session or settings if needed to reflect changes immediately
        // refetch();
      } else {
        // Handle error from the server action
        toast.error(result.error || "Error updating settings!");
        console.error("Error updating settings:", result.error);
      }
    } catch (error) {
      // Handle unexpected client-side errors
      toast.error("An unexpected error occurred!");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Settings for user, {session?.user.name}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="darkMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between border p-4">
                  <div className="space-y-0.5 mr-3">
                    <FormLabel>Dark Mode</FormLabel>
                    <FormDescription className="text-gray-500/50 text-sm">
                      Controls dark mode throughout the site
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className={`cursor-pointer ${
                        theme === "dark"
                          ? "bg-gray-600 data-[state=checked]:bg-accent"
                          : ""
                      }`}
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
