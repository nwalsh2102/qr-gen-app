"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

interface UpdateSettingsData {
  darkMode: boolean;
  // Add other settings fields here as you add them to the schema
}

export async function updateUserSettings(settingsData: UpdateSettingsData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    // Or throw a more specific authentication error
    throw new Error("Not authenticated");
  }

  const userId = session.user.id;

  try {
    // Find and update the settings for the authenticated user
    const updatedSettings = await prisma.settings.update({
      where: {
        userId: userId, // Use the unique userId to find the settings
      },
      data: {
        darkMode: settingsData.darkMode,
        // Update other fields here
      },
    });

    return { success: true, data: updatedSettings };
  } catch (error) {
    console.error("Error updating user settings:", error);
    // Return an error object or re-throw a specific error
    return { success: false, error: "Failed to update settings" };
  }
}
