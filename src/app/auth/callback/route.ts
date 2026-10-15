import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { fetchProfileRole, homeForRole } from "@/lib/auth";

/**
 * Auth callback: the email verification link (and Google sign-in) lands here.
 *
 * - `?code=…` (PKCE, Supabase's default link): exchanged for a session. This needs the code verifier the browser
 *   stored at sign-up, so it only works on the same device/browser. Opened elsewhere (registered on a laptop, link
 *   opened on a phone) the exchange fails, but Supabase has already verified the address before redirecting here:
 *   the user is sent to the sign-in page with "email verified, please sign in".
 * - `?token_hash=…&type=email` (works on any device): verified directly. Used when the "Confirm signup" email
 *   template links to {{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email.
 * - `?error=…&error_description=…`: the link was invalid or expired.
 *
 * The session cookies set while exchanging/verifying are added to the redirect response. The landing page follows the
 * account's role in public.profiles (admin → /admin, everyone else → /).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const to = (path: string) => NextResponse.redirect(new URL(path, request.url));

  if (searchParams.get("error") || searchParams.get("error_code")) {
    return to(`/login?auth_error=${searchParams.get("error_code") === "otp_expired" ? "expired" : "invalid"}`);
  }

  const supabase = await createServerSupabaseClient();
  const landing = async (userId?: string) => homeForRole(userId ? await fetchProfileRole(supabase, userId) : null);

  if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) return to(`/login?auth_error=${/expired/i.test(error.message) ? "expired" : "invalid"}`);
    return to(`${await landing(data.user?.id)}?verified=1`);
  }

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return to(`${await landing(data.user?.id)}?verified=1`);
    // No code verifier on this device: the address is verified, the session just can't be created here
    if (/code verifier|code_verifier|flow state/i.test(error.message)) return to("/login?verified=1");
    return to("/login?auth_error=invalid");
  }

  return to("/login?auth_error=invalid");
}
