import { AppShell, AuthFrame } from "@/components/app-shell";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <AppShell>
      <AuthFrame
        title="Welcome back"
        subtitle="Sign in to keep your day moving."
      >
        <AuthForm mode="login" />
      </AuthFrame>
    </AppShell>
  );
}
