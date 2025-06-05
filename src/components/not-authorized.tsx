"use client";

import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle } from "./ui/card";

export default function NotAuthorizedCard() {
  return (
    // <Card>

    // </Card>
    <div className="flex flex-col items-center gap-3">
      <p>You are not authorized to be here.</p>
      <Button
        size="sm"
        className="cursor-pointer"
        onClick={redirect("/signin")}
      >
        Log In
      </Button>
    </div>
  );
}
