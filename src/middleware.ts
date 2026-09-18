import { NextRequest, NextResponse } from "next/server";

// Deployment-generated allowlist; never infer a site from an arbitrary hostname.
export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.delete("x-guten-site");
  headers.delete("x-guten-origin");
  headers.delete("x-guten-path");
  const raw = process.env.GUTEN_DOMAIN_MAP;
  if (!raw) return NextResponse.next({ request: { headers } });
  let domains: Record<string, { site: string; origin: string }>;
  try { domains = JSON.parse(raw); }
  catch { return new NextResponse("Invalid domain configuration", { status: 503 }); }
  const host = (request.headers.get("host") || "").toLowerCase().split(":")[0];
  const entry = Object.prototype.hasOwnProperty.call(domains, host) ? domains[host] : undefined;
  const path = request.nextUrl.pathname;
  // Container readiness remains available without a publication hostname.
  if (path === "/health") return NextResponse.next({ request: { headers } });
  if (!entry) return new NextResponse("Not found", { status: 404 });
  if (path.startsWith("/_next/") || path.startsWith("/assets/") || path === "/favicon.ico") {
    return NextResponse.next({ request: { headers } });
  }
  if (path.startsWith("/api/") || path.startsWith("//")) return new NextResponse("Not found", { status: 404 });
  headers.set("x-guten-site", entry.site);
  headers.set("x-guten-origin", entry.origin);
  headers.set("x-guten-path", path);
  const target = request.nextUrl.clone();
  target.pathname = `/${encodeURIComponent(entry.site)}${path === "/" ? "" : path}`;
  return NextResponse.rewrite(target, { request: { headers } });
}
