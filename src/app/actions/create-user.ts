"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { headers } from "next/headers";

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  // if (!session?.user.id) {
  //   throw new Error("No user ID found in session");
  // }

  const { name, email, password } = data;

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    const userId = await prisma.user.findUnique({
      where: {
        name,
        email,
      },
    });

    if (!userId) {
      console.error("ERROR CREATING USER SETTINGS: NO userID FOUND");
      console.error("PLEASE MAKE SURE USER IS BEING CREATED THROUGH AUTH");
      throw new Error("Error while creating user settings!");
    }

    await prisma.settings.create({
      data: {
        userId: userId?.id,
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
