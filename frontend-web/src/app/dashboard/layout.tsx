"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { MobileMenu } from "@/components/dashboard/mobile-menu";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AuthGuard>
      <div>
        <MobileMenu
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <Sidebar />

        <div className="lg:pl-60">
          <Header onMenuClick={() => setMobileMenuOpen(true)} />

          <main className="py-8">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
