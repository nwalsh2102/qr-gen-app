"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

export async function loginUser(data: { email: string; password: string }) {
  const { email, password } = data;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return {
      success: true,
      error: "",
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    return {
      success: false,
      error: "Failed to login user",
    };
  }
}
