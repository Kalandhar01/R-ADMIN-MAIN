"use client";

import * as React from "react";
import { toast } from "sonner";

export function AdminLoginForm() {
  const [pending, setPending] = React.useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPending(true);

    try {
      const response = await fetch("/api/admin/auth/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password")
        })
      });
      const payload = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "Invalid admin credentials.");
      }

      window.location.assign("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action="/api/admin/auth/credentials" method="post" onSubmit={submit} className="mt-5 grid gap-3">
      <label className="grid gap-2 text-sm text-[#9B9B9B]">
        Email
        <input
          name="email"
          type="text"
          autoComplete="username"
          placeholder="fawas"
          className="h-11 rounded-[8px] border border-[#232323] bg-[#080808] px-3 text-sm text-[#F5F5F5] outline-none transition focus:border-[#8F1118]"
          required
        />
      </label>
      <label className="grid gap-2 text-sm text-[#9B9B9B]">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter password"
          className="h-11 rounded-[8px] border border-[#232323] bg-[#080808] px-3 text-sm text-[#F5F5F5] outline-none transition focus:border-[#8F1118]"
          required
        />
      </label>
      <button
        disabled={pending}
        className="mt-1 h-11 rounded-[8px] bg-[#8F1118] px-4 text-sm font-semibold text-[#F5F5F5] transition hover:bg-[#B71C24] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in" : "Enter Command Center"}
      </button>
    </form>
  );
}
