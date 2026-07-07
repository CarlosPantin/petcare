import Link from "next/link";

import { requireUser } from "@/server/session";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/dashboard" className="text-lg font-semibold">
            🐾 PetCare
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="hover:text-primary">
              Dashboard
            </Link>
            <Link href="/pets" className="hover:text-primary">
              My Pets
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="container flex-1 py-8">{children}</main>
    </div>
  );
}
