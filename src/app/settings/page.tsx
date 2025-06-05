import SettingsForm from "@/components/settings/settings-form";
import { getUserSettings } from "@/app/actions/get-user-settings";
import NotAuthorizedCard from "@/components/not-authorized";

export default async function Page() {
  const initialSettings = await getUserSettings();

  // Optional: If you want to redirect unauthenticated users at the page level
  if (initialSettings === null) {
    // Assuming getUserSettings returns null for unauthenticated users
    // You might want a different check or throw an error depending on getUserSettings implementation
    return (
      <div className="grid h-screen place-items-center">
        <NotAuthorizedCard />
      </div>
    );
  }

  return (
    <div className="grid h-screen place-items-center">
      <SettingsForm initialSettings={initialSettings} />
    </div>
  );
}
