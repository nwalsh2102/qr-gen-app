"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateQRCode } from "@/app/actions/generate-qr";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Download, Loader2, Loader2Icon, Check } from "lucide-react";
import { toast } from "sonner";
import { SuccessToast } from "../toasts";
import { redirect } from "next/navigation";

const formSchema = z.object({
  link: z
    .string({ required_error: "Please enter a link." })
    .min(1, { message: "Please enter a valid link." }),
});

export default function CodeGeneratorForm() {
  const [submitting, setSubmitting] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrCodeFilename, setQrCodeFilename] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
    },
    // mode: "onChange",
  });

  const handleDownload = () => {
    if (!qrCodeUrl) return;

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = qrCodeFilename || "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Set downloaded state to true
    setDownloaded(true);

    toast.success("Download Successful");

    // Reset the state after 2 seconds
    setTimeout(() => {
      setDownloaded(false);
    }, 2000);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    setQrCodeUrl(null);
    setQrCodeFilename(null);

    try {
      const result = await generateQRCode(values.link);

      if (result.success && result.qrCode) {
        setQrCodeUrl(result.qrCode);
        setQrCodeFilename(result.filename);
        form.reset();
        toast.success("QR Code generated successfully!", {
          duration: 3000,
          position: "top-center",
          className: "bg-green-50 border-green-200 !rounded-none",
          descriptionClassName: "text-green-800",
          style: {
            background: "white",
            color: "black",
            border: "0px solid #e5e7eb",
          },
        });
      } else {
        throw new Error(result.error || "Failed to generate QR code");
      }
    } catch (error) {
      toast.error("Failed to generate QR code");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
        <CardDescription>Generate a QR code!</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      className="border-gray-200"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Link you would like your QR code to goto.
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="w-full flex items-center justify-between">
              <div>
                {submitting ? (
                  <Button type="submit" className="cursor-pointer">
                    <Loader2Icon className="animate-spin" />
                    Submitting...
                  </Button>
                ) : (
                  <Button type="submit" className="cursor-pointer">
                    Submit
                  </Button>
                )}
              </div>
              <div>
                {qrCodeUrl?.length ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 cursor-pointer relative"
                    onClick={handleDownload}
                  >
                    <Download
                      className={`absolute transition-all duration-300 ${
                        downloaded
                          ? "opacity-0 rotate-90 scale-0"
                          : "opacity-100 rotate-0 scale-100"
                      }`}
                    />
                    <Check
                      className={`absolute transition-all duration-300 ${
                        downloaded
                          ? "opacity-100 rotate-0 scale-100"
                          : "opacity-0 -rotate-90 scale-0"
                      }`}
                    />
                  </Button>
                ) : (
                  <span></span>
                )}
              </div>
            </div>
          </form>
        </Form>

        {qrCodeUrl && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <img
              src={qrCodeUrl}
              alt="Generated QR Code"
              className="max-w-[300px]"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
