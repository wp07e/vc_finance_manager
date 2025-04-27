"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) redirect("/auth/login");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/dashboard">
              <span className="hidden font-bold sm:inline-block">
                Finance Dashboard
              </span>
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
