"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function getUserSettings() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    // Return null or throw an error if the user is not authenticated
    return null;
  }

  try {
    const settings = await prisma.settings.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    // If settings don't exist, return null. You could also create default settings here if preferred.
    return settings;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    // Return null or re-throw the error
    return null;
  }
}
