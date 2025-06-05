import Link from "next/link";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Loader2,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface NavbarLinkProps {
  href: string;
  title: string;
}

export function NavbarLink({ href, title }: NavbarLinkProps) {
  return (
    <>
      <Link
        href={href}
        className="hover:bg-accent hover:text-white px-3 py-2 rounded-md transition-colors"
      >
        {title}
      </Link>
    </>
  );
}

export function NavbarAccountDropdown() {
  const [open, setIsOpen] = useState(false);
  const [loggingout, setLoggingout] = useState(false);

  async function handleLogout() {
    setLoggingout(true);
    try {
      await authClient.signOut();
    } catch (error: any) {
      toast.error("Error while logging out.");
      console.log("ERROR:", error.message);
    }
    setLoggingout(false);
  }

  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  return (
    <DropdownMenu open={open} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="hover:bg-accent hover:text-white px-3 py-2 rounded-md cursor-pointer flex items-center gap-1 transition-colors">
        ACCOUNT{" "}
        <span
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={15} />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="select-none cursor-pointer">
        <DropdownMenuLabel className="cursor-default select-none">
          {session ? (
            <span>Hello, {session.user.name}!</span>
          ) : (
            "YOU CANT BE HERE"
          )}{" "}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="cursor-none select-none" />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => redirect("/codes")}
        >
          All Codes
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer select-none"
          onClick={() => redirect("/settings")}
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer select-none group"
          onClick={handleLogout}
        >
          Sign Out{" "}
          {loggingout ? (
            <Loader2 className="group-hover:text-white transition-colors delay-20 animate-spin" />
          ) : (
            <LogOut className="group-hover:text-white transition-colors delay-20" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
