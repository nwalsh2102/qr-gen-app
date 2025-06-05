"use client";

import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle } from "./ui/card";

export default function NotAuthorizedCard() {
  return (
    <div className="flex flex-col items-center gap-3">
      <p>You are not authorized to be here.</p>
      <Button
        size="sm"
        className="cursor-pointer"
        onClick={() => window.location.replace("/signin")}
      >
        Log In
      </Button>
    </div>
  );
}
