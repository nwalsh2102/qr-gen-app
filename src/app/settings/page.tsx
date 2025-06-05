import NotAuthorizedCard from "@/components/not-authorized";
import SettingsForm from "@/components/settings/settings-form";
import { auth } from "@/lib/auth";

import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session) {
    return (
      <div className="grid h-screen place-items-center">
        <NotAuthorizedCard />
      </div>
    );
  }

  return (
    <div className="grid h-screen place-items-center">
      {/* <h1>Hello, {session.user.name}.</h1> */}
      <SettingsForm />
    </div>
  );
}
