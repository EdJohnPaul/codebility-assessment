import { AuthForm } from "@/components/auth-form";

export const metadata = {
  title: "Sign in | Task Manager",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <AuthForm mode="login" />
    </main>
  );
}
