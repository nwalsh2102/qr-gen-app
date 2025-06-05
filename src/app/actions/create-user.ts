"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { headers } from "next/headers";

const session = await auth.api.getSession({
  headers: await headers(), // you need to pass the headers object.
});

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  if (!session?.user.id) {
    throw new Error("No user ID found in session");
  }

  const { name, email, password } = data;

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    await prisma.settings.create({
      data: {
        userId: session.user.id,
      },
    });
    return {
      success: true,
      error: "",
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: "Failed to create user",
    };
  }
}
