import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { Toaster } from "sonner";
import { GoogleLoginButton } from "@/components/admin/google-login";
import { AdminLoginForm } from "@/components/admin/login-form";
import { FounderWelcomeScreen } from "@/components/admin/founder-welcome";
import { getCurrentAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ractysh Command Center | Admin",
  description: "Enterprise command center for Ractysh operations."
};

type AdminPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

function errorMessage(error?: string): string | null {
  if (error === "invalid_credentials") return "Invalid admin credentials.";
  if (error === "session_required") return "Admin access is required.";
  return null;
}

function LoginPage({ error }: { error?: string }) {
  return (
    <main className="min-h-screen bg-[#080808] px-4 py-6 text-[#F5F5F5] sm:px-6 lg:px-8">
      <Toaster theme="dark" richColors position="top-right" />
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-[#232323] bg-[#111111] px-3 text-sm text-[#9B9B9B]">
              <ShieldCheck className="h-4 w-4 text-[#B71C24]" />
              Ractysh Enterprise Command Center
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-none tracking-tight text-[#F5F5F5] sm:text-6xl">
              Admin operations, rebuilt from the database up.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#9B9B9B]">
              Access is restricted to registered administrators. Google accounts are accepted only when their email exists in the Admin table.
            </p>
          </div>

          <div className="rounded-[8px] border border-[#232323] bg-[#111111] p-5 shadow-[0_32px_120px_rgba(0,0,0,0.42)]">
            <div>
              <p className="text-sm text-[#9B9B9B]">Development Access</p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#F5F5F5]">Sign in</h2>
            </div>

            {errorMessage(error) ? (
              <div className="mt-4 rounded-[8px] border border-[#8F1118]/50 bg-[#8F1118]/10 p-3 text-sm text-[#F5F5F5]">
                {errorMessage(error)}
              </div>
            ) : null}

            <AdminLoginForm />

            <div className="my-5 h-px bg-[#232323]" />
            <GoogleLoginButton clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const admin = await getCurrentAdmin();
  const params = await searchParams;

  if (!admin) {
    return <LoginPage error={params?.error} />;
  }

  return <FounderWelcomeScreen />;
}
