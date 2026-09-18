import React from "react";
import { headers } from "next/headers";
import type { Metadata } from "next";
import SiteProviders from "@/components/SiteProviders";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const origin = h.get("x-guten-origin");
  return origin ? { alternates: { canonical: origin + (h.get("x-guten-path") || "/") } } : {};
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  return <html lang="en"><body>
    <SiteProviders site={h.get("x-guten-site") || ""}>{children}</SiteProviders>
  </body></html>;
}
