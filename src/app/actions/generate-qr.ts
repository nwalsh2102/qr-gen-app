"use server";

import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function generateQRCode(url: string) {
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
