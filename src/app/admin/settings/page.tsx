"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { WHATSAPP_TEMPLATES } from "@/lib/whatsapp";
import { can, type Role } from "@/lib/roles";

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const role = (session?.user?.role as Role) ?? "COUNSELOR";

  if (!can(role, "admin.settings")) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-bold">Admins only</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Settings require the ADMIN role.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <h2 className="font-semibold">WhatsApp templates</h2>
        <p className="text-xs text-gray-500 mb-3">
          These are the templates the team can use for outbound WhatsApp. If Meta
          credentials are set (env <code>META_WABA_*</code>), they're sent via
          the Cloud API; otherwise EDUINTBD falls back to a <code>wa.me</code>{" "}
          deep-link so counselors can send manually.
        </p>
        <ul className="space-y-2 text-sm">
          {WHATSAPP_TEMPLATES.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 py-1.5 last:border-0"
            >
              <div>
                <p className="font-medium">{t.label}</p>
                <p className="text-[10px] text-gray-500">
                  Template id: <code>{t.id}</code>
                  {t.vars.length ? ` · vars: ${t.vars.join(", ")}` : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-gray-500">
          Templates must be approved in Meta Business Manager before they'll
          send via Cloud API. See DEPLOY.md for the WhatsApp setup checklist.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <h2 className="font-semibold">Tags reference</h2>
        <p className="text-xs text-gray-500 mb-3">
          Tags are free-form, comma-separated on each lead. Suggested starter set:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            "vip",
            "scholarship-seeker",
            "walk-in",
            "referral",
            "social-ads",
            "needs-ielts",
            "needs-sop",
            "re-engage",
          ].map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <h2 className="font-semibold">Environment status</h2>
        <ul className="mt-2 text-xs space-y-1 text-gray-600 dark:text-gray-400">
          <li>Resend email: configured via <code>RESEND_API_KEY</code> (falls back to logs in dev)</li>
          <li>WhatsApp Cloud API: <code>META_WABA_PHONE_NUMBER_ID</code> + <code>META_WABA_ACCESS_TOKEN</code></li>
          <li>Reminders cron: <code>CRON_SECRET</code> (Vercel Cron calls <code>/api/cron/reminders</code> 3×/day)</li>
        </ul>
        <Link
          href="/DEPLOY.md"
          className="text-xs text-blue-600 hover:underline mt-2 inline-block"
        >
          Deploy runbook →
        </Link>
      </div>
    </div>
  );
}
