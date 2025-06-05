export interface SettingsFormProps {
  initialSettings: {
    // Assuming settings structure matches your Prisma model
    darkMode: boolean;
    // Add other settings properties if needed
  } | null;
}
