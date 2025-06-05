"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Check, Trash2Icon, ExternalLink, Mail } from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { useState } from "react";
import { deleteCode } from "@/app/actions/delete-code";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type CodesType = {
  id: string;
  url: string;
  createdAt: Date;
  updatedAt?: Date;
};

export const codesColumns: ColumnDef<CodesType>[] = [
  // Enable later on when mass functions
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       className="border-black cursor-pointer"
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       className="border-black cursor-pointer"
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const code = row.original;

      const [open, setOpen] = useState(false);

      return (
        <>
          <span onClick={() => setOpen(true)} className="cursor-pointer">
            {code.id}
          </span>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{code.url}</DialogTitle>
                <DialogDescription>
                  Detailed view for the QR code.
                </DialogDescription>
              </DialogHeader>
              <div className="">
                <div className="mb-3">
                  <h1>ID</h1>
                  <p>{code.id}</p>
                </div>
                <div className="mb-3">
                  <h1>URL</h1>
                  <Link href={code.url} target="_blank" className="text-accent">
                    <div className="flex gap-0.5">
                      {code.url} <ExternalLink size={12} />
                    </div>
                  </Link>
                </div>
                <div className="mb-3">
                  <h1>Created</h1>
                  <p>{code.createdAt.toDateString()}</p>
                </div>
                <div className="mb-3">
                  <h1>Updated</h1>
                  <p>{code.updatedAt?.toDateString()}</p>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="cursor-pointer">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      const code = row.original;

      return (
        <Link href={code.url} target="_blank" className="text-accent">
          <div className="flex gap-0.5">
            {code.url} <ExternalLink size={12} />
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const code = row.original;
      const created = code.createdAt.toString();

      if (created.length > 20) {
        return <span>{created.slice(0, 16)}</span>;
      } else {
        return <span>{created}</span>;
      }
    },
  },
  // {
  //   accessorKey: "updatedAt",
  //   header: "Updated",
  //   cell: ({ row }) => {
  //     const code = row.original;
  //     const updated = code.updatedAt?.toString() || "";

  //     if (updated.length > 20) {
  //       return <span>{updated.slice(0, 16)}</span>;
  //     } else {
  //       return <span>{updated}</span>;
  //     }
  //   },
  // },
  {
    id: "download",
    header: ({ table }) => (
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-transparent hover:text-current"
      >
        <Download />
      </Button>
    ),
    cell: ({ row }) => {
      const code = row.original;
      const [isDownloaded, setIsDownloaded] = useState(false);

      const handleDownload = async () => {
        try {
          const qrCodeDataUrl = await QRCode.toDataURL(code.url, {
            errorCorrectionLevel: "H",
            margin: 1,
            width: 300,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          });

          const link = document.createElement("a");
          link.href = qrCodeDataUrl;
          const filename = `qrcode-${code.url}.png`;
          link.download = filename;

          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);

          toast.success("QR code downloaded successfully!");
          setIsDownloaded(true);

          setTimeout(() => {
            setIsDownloaded(false);
          }, 2000);
        } catch (error) {
          console.error("Error downloading QR code:", error);
          toast.error("Failed to download QR code.");
        }
      };

      return (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 cursor-pointer relative"
          onClick={handleDownload}
        >
          <Download
            className={`absolute transition-all duration-300 ${
              isDownloaded
                ? "opacity-0 rotate-90 scale-0"
                : "opacity-100 rotate-0 scale-100"
            }`}
          />
          <Check
            className={`absolute transition-all duration-300 ${
              isDownloaded
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-0"
            }`}
          />
        </Button>
      );
    },
  },
  {
    id: "delete",
    header: ({ table }) => (
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-transparent hover:text-current"
      >
        <Trash2Icon />
      </Button>
    ),
    cell: ({ row }) => {
      const code = row.original;
      const router = useRouter();

      const handleDelete = async () => {
        try {
          const result = await deleteCode(code.id);
          if (result?.success) {
            toast.success("Code deleted successfully!");
            router.refresh();
          } else {
            toast.error(result?.error || "Failed to delete code.");
            console.error("Deletion failed:", result?.error);
          }
        } catch (error) {
          toast.error("An unexpected error occurred during deletion.");
          console.error("Unexpected deletion error:", error);
        }
      };

      return (
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer"
          onClick={handleDelete}
        >
          <Trash2Icon />
        </Button>
      );
    },
  },
  {
    id: "email",
    header: ({ table }) => (
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-transparent hover:text-current"
      >
        <Mail />
      </Button>
    ),
    cell: ({ row }) => {
      const code = row.original;

      return (
        <Button variant="ghost" size="sm" className="cursor-pointer">
          <Mail />
        </Button>
      );
    },
  },
];
