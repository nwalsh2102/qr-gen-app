import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  // baseURL: "http://localhost:3000",
  baseURL: "https://qr-gen-d2svapupq-nicks-projects-6009e7bc.vercel.app/",
});
