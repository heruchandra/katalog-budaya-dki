import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { fetchProfileRole, isAdminRole, UNAUTHORIZED_REDIRECT } from "@/lib/auth";

/**
 * Server-side gate for /admin (Next 16 "proxy", formerly middleware). Runs on every request to an /admin route,
 * so the role is read from public.profiles again on each navigation that reaches the server:
 * - not signed in → /login
 * - signed in but profiles.role is not 'admin' → the homepage with the "no admin access" toast
 * The admin layout repeats the check in the browser on every route change (client-side navigations can be served
 * from the router cache without reaching this proxy).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      // a refreshed session is passed on to the page and back to the browser
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // getUser() asks Supabase Auth to validate the session (a cookie alone could be forged)
  const { data: { user } } = await supabase.auth.getUser();
  const role = user ? await fetchProfileRole(supabase, user.id) : null;
  if (user && isAdminRole(role)) return response;

  // keep any cookies Supabase just set or cleared on the redirect
  const redirect = NextResponse.redirect(new URL(user ? UNAUTHORIZED_REDIRECT : "/login", request.url));
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export const config = {
  matcher: ["/admin/:path*"],
};
