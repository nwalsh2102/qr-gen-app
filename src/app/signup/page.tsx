import SignUpForm from "@/components/accounts/sign-up-form";

export const metadata = {
  title: "Sign Up - QR Code Generation",
  description: "Next generation QR code generation, built with accounts",
};

export default function Page() {
  return (
    <div className="grid h-screen place-items-center">
      <SignUpForm />
    </div>
  );
}
