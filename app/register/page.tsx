import { AppShell, AuthFrame } from "@/components/app-shell";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <AppShell>
      <AuthFrame
        title="Create your account"
        subtitle="A calmer way to organize what matters."
      >
        <AuthForm mode="register" />
      </AuthFrame>
    </AppShell>
  );
}
