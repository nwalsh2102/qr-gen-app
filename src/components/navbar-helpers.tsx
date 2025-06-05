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
import { ArrowDown, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { useState } from "react";

interface NavbarLinkProps {
  href: string;
  title: string;
}

export function NavbarLink({ href, title }: NavbarLinkProps) {
  return (
    <>
      <Link
        href={href}
        className="hover:bg-accent px-3 py-2 rounded-md transition-colors"
      >
        {title}
      </Link>
    </>
  );
}

export function NavbarAccountDropdown() {
  const [open, setIsOpen] = useState(false);

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
          Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="cursor-none select-none" />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => redirect("/codes")}
        >
          Codes
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer select-none"
          onClick={() => redirect("/settings")}
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer select-none group">
          Sign Out{" "}
          <LogOut className="group-hover:text-white transition-colors delay-20" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
