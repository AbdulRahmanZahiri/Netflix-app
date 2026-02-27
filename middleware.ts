import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";
import { flags } from "@/lib/flags";

const protectedRoutes = ["/dashboard", "/api"]; 
const proRoutes = ["/dashboard/planner", "/dashboard/flashcards", "/api/ai"]; 

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (pathname.startsWith("/api/stripe/webhook")) {
    return NextResponse.next();
  }

  if (flags.devBypassAuth) {
    return NextResponse.next();
  }

  const { supabase, res } = createMiddlewareClient(req);
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isProRoute = proRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isProRoute && user) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status,plan")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const plan =
      sub?.status === "active" && sub?.plan ? sub.plan : "free";
    res.headers.set("x-user-plan", plan);

    const wantsPro = searchParams.get("tier") === "pro";

    if (flags.billingEnabled && plan !== "pro" && wantsPro) {
      const upgradeUrl = req.nextUrl.clone();
      upgradeUrl.pathname = "/dashboard/settings";
      upgradeUrl.searchParams.set("upgrade", "required");
      return NextResponse.redirect(upgradeUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"]
};
