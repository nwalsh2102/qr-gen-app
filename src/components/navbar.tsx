"use client";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { NavbarLink, NavbarAccountDropdown } from "./navbar-helpers";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Navbar() {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  const linkSessionState = session;

  return (
    <div className="h-15 shadow-md">
      <div className="flex justify-between px-6 py-3 items-center h-full">
        <div className="w-1/3">
          <Image
            src="/qr-code.png"
            width={50}
            height={50}
            alt="qr-code"
            onClick={() => window.location.replace("/")}
            className="cursor-pointer"
          />
        </div>
        <div className="w-1/3 flex justify-center">
          <h1
            className="text-xl font-bold select-none cursor-pointer"
            onClick={() => redirect("/")}
          >
            VERO - QR GENERATOR
          </h1>
        </div>
        <div className="w-1/3 flex justify-end gap-5">
          {linkSessionState ? (
            // <NavbarLink href="/account" title="Account" />
            <NavbarAccountDropdown />
          ) : (
            <NavbarLink href="/signin" title="SIGN IN" />
          )}
        </div>
      </div>
    </div>
  );
}
