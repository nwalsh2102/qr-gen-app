import { CodesDataTable } from "@/components/codes/codes-data-table";
import { codesColumns } from "@/components/codes/codes-columns";
import ComingSoon from "@/components/coming-soon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import NotAuthorizedCard from "@/components/not-authorized";

export const metadata = {
  title: "My Codes - QR Code Generation",
  description: "Next generation QR code generation, built with accounts",
};

export default async function Page() {
  // Get the user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to sign-in if not authenticated
  if (!session?.user?.id) {
    return (
      <div className="grid h-screen place-items-center">
        <NotAuthorizedCard />
      </div>
    );
  }

  // Fetch codes for the authenticated user, selecting only specified fields
  const codesData = await prisma.code.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      url: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc", // Optional: order by creation date
    },
  });

  return (
    <div className="grid h-screen place-items-center">
      <Card className="select-none transition-all duration-300 ease-in-out">
        <CardHeader>
          <CardTitle>QR Codes</CardTitle>
          <CardDescription>All previous QR codes.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pass the fetched codesData to the DataTable component */}
          <CodesDataTable columns={codesColumns} data={codesData} />
        </CardContent>
      </Card>
    </div>
  );
}
