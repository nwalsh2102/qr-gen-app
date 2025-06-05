import LogInForm from "@/components/accounts/login-form";

export const metadata = {
  title: "Login - QR Code Generation",
  description: "Next generation QR code generation, built with accounts",
};

export default function Page() {
  return (
    <div className="grid h-screen place-items-center">
      <LogInForm />
    </div>
  );
}
