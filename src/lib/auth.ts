// Auth helpers shared by the sign-in / sign-up pages, the auth callback route and the admin pages.
// No Supabase client here, so server code (the callback route) can import it.

/** Same rule the public Navbar uses to show the admin link. Real enforcement must be Supabase RLS. */
export const ADMIN_EMAIL = "admindisbud@gmail.com";

/**
 * Where Supabase sends the user back after the email verification link or a Google sign-in: this app's own
 * /auth/callback on whatever host the user is on (localhost, a LAN IP on a phone, a Vercel preview, the production
 * domain). Each of these must be listed under Supabase > Authentication > URL Configuration > Redirect URLs.
 */
export const authCallbackUrl = () => `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`;

/** Landing page after signing in: the admin dashboard for the admin account, the homepage for everyone else */
export const homeFor = (email?: string | null) => (email === ADMIN_EMAIL ? "/admin" : "/");

/** Supabase's sign-in error for an account whose email address hasn't been verified yet */
export const isEmailNotConfirmed = (error: { code?: string; message?: string }) =>
  error.code === "email_not_confirmed" || /email not confirmed/i.test(error.message || "");
