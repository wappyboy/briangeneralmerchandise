"use client";

import { CalendarDays, Loader2, LockKeyhole, PackageCheck, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function signIn(formData: FormData) {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to sign in.");
      }

      router.replace("/admin");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f3ef] px-4 py-10 text-neutral-950">
      <form
        action={signIn}
        className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-2xl shadow-neutral-950/10 lg:grid-cols-[1fr_0.9fr]"
      >
        <div className="bg-neutral-950 p-6 text-white sm:p-8">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-lg bg-white text-neutral-950">
              <PackageCheck className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-black">Brian&apos;s General Merchandise</p>
              <p className="text-sm text-neutral-400">Event rental operations</p>
            </div>
          </div>

          <h1 className="mt-10 max-w-sm text-4xl font-black tracking-tight">
            Manage bookings, rentals, payments, and documents.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-neutral-300">
            Secure owner access for event schedules, inventory availability, quotations, contracts, and reports.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
              <CalendarDays className="size-5 text-neutral-300" aria-hidden="true" />
              <p className="mt-3 text-sm font-bold">Booking calendar</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
              <ShieldCheck className="size-5 text-neutral-300" aria-hidden="true" />
              <p className="mt-3 text-sm font-bold">Protected access</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-950">
              <LockKeyhole className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-black">Admin Login</h2>
              <p className="text-sm text-neutral-500">Sign in to continue</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-neutral-700">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-neutral-950 outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10"
              />
            </label>

            <label className="block text-sm font-bold text-neutral-700">
              Password
              <input
                name="password"
                type="password"
                required
                className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-neutral-950 outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10"
              />
            </label>
          </div>

          {error ? <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p> : null}

          <Button type="submit" className="mt-6 w-full rounded-lg bg-neutral-950 text-white hover:bg-neutral-800" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Sign In
          </Button>
        </div>
      </form>
    </main>
  );
}
