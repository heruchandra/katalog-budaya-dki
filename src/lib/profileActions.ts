import type { User } from "@supabase/supabase-js";

// Signed-in user helpers (navbar + admin header). The profile is read-only: name and photo come from the sign-in
// session. The Supabase client is imported on use, so it stays out of the initial JavaScript of the public pages.

/** Display name from the session: the account's name (e.g. from Google sign-in), else the part of the email before "@" */
export const profileName = (user: User | null | undefined) =>
  (user?.user_metadata?.full_name as string | undefined) ||
  (user?.user_metadata?.name as string | undefined) ||
  user?.email?.split("@")[0] ||
  "User";

/** Profile photo URL from the session (e.g. the Google account picture), or null */
export const profileAvatar = (user: User | null | undefined): string | null =>
  (user?.user_metadata?.avatar_url as string | undefined) || (user?.user_metadata?.picture as string | undefined) || null;

export async function signOutUser(): Promise<void> {
  const { supabase } = await import("@/lib/supabase");
  await supabase.auth.signOut();
}
