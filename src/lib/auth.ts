// Auth helpers shared by the sign-in / sign-up pages, the auth callback route, the /admin proxy and the admin pages.
// No Supabase client is created here (callers pass theirs), so both server and browser code can import it.
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * The account's role from public.profiles ("admin" | "user"), read fresh from the database on every call so a role
 * changed in Supabase takes effect on the next navigation. null when the row can't be read (no row, RLS, network):
 * callers treat that as "not an admin".
 */
export async function fetchProfileRole(client: SupabaseClient, userId: string): Promise<string | null> {
  const { data, error } = await client.from("profiles").select("role").eq("id", userId).single();
  return error ? null : ((data?.role as string | undefined) ?? null);
}

/** Only profiles.role = 'admin' opens the admin dashboard. Real enforcement of writes must still be Supabase RLS. */
export const isAdminRole = (role?: string | null) => role === "admin";

/** Where a non-admin is sent from /admin: the homepage, which shows the "no admin access" toast for this flag */
export const UNAUTHORIZED_REDIRECT = "/?unauthorized=1";

/**
 * Where Supabase sends the user back after the email verification link or a Google sign-in: this app's own
 * /auth/callback on whatever host the user is on (localhost, a LAN IP on a phone, a Vercel preview, the production
 * domain). Each of these must be listed under Supabase > Authentication > URL Configuration > Redirect URLs.
 */
export const authCallbackUrl = () => `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`;

/** Landing page after signing in: the admin dashboard for an admin account, the homepage for everyone else */
export const homeForRole = (role?: string | null) => (isAdminRole(role) ? "/admin" : "/");

/** Supabase's sign-in error for an account whose email address hasn't been verified yet */
export const isEmailNotConfirmed = (error: { code?: string; message?: string }) =>
  error.code === "email_not_confirmed" || /email not confirmed/i.test(error.message || "");
