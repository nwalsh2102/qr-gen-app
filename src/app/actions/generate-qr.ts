"use server";

import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function generateQRCode(url: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  try {
    // Generate QR code as a data URL
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 300,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    // Create a filename from the URL
    const filename =
      url
        .replace(/^https?:\/\//, "") // Remove http:// or https://
        .replace(/[^a-z0-9]/gi, "-") // Replace non-alphanumeric chars with hyphens
        .toLowerCase() + "-qr.png";

    // Save the QR code to the database if the user is authenticated
    if (session?.user?.id) {
      try {
        await prisma.code.create({
          data: {
            url,
            userId: session.user.id,
          },
        });
      } catch (dbError) {
        console.error("Error saving QR code to database:", dbError);
        // You might want to handle this error differently, e.g., still return the QR code but log the save failure
      }
    }

    return {
      success: true,
      qrCode: qrCodeDataUrl,
      filename: filename,
    };
  } catch (error) {
    console.error("Error generating QR code:", error);
    return {
      success: false,
      error: "Failed to generate QR code",
    };
  }
}
