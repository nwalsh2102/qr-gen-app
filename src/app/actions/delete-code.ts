"use server";

import { prisma } from "@/lib/prisma";

export async function deleteCode(id: string) {
  try {
    await prisma.code.delete({
      where: {
        id: id,
      },
    });

    return {
      success: true,
      error: "",
    };
  } catch (error) {
    console.error("Error while deleting user");
    console.error("ERROR:", error);
  }
}
