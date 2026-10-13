import type { User } from "@supabase/supabase-js";

// Profile actions for the signed-in user (navbar + admin header). The Supabase client and the image helpers are
// imported on use, so they stay out of the initial JavaScript of the public pages.

/** Display name limit in the profile menu */
export const MAX_PROFILE_NAME = 25;
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

/** Display name: the name saved in the profile, else the part of the email before "@" */
export const profileName = (user: User | null | undefined) =>
  (user?.user_metadata?.full_name as string | undefined) ||
  (user?.user_metadata?.name as string | undefined) ||
  user?.email?.split("@")[0] ||
  "User";

/** Profile photo URL (saved in the profile, else from the sign-in provider), or null. A photo removed in the profile
 *  menu (avatar_url saved as null) stays removed. */
export const profileAvatar = (user: User | null | undefined): string | null => {
  const meta = user?.user_metadata ?? {};
  if ("avatar_url" in meta) return (meta.avatar_url as string | null) || null;
  return (meta.picture as string | undefined) || null;
};

async function updateMetadata(data: Record<string, unknown>): Promise<User> {
  const { supabase } = await import("@/lib/supabase");
  const { data: result, error } = await supabase.auth.updateUser({ data });
  if (error || !result.user) throw new Error(error?.message || "Gagal memperbarui profil.");
  return result.user;
}

/** Save the display name (trimmed, at most MAX_PROFILE_NAME characters) to the user's metadata */
export async function saveProfileName(name: string): Promise<User> {
  const clean = name.trim().slice(0, MAX_PROFILE_NAME);
  if (!clean) throw new Error("Nama tidak boleh kosong.");
  return updateMetadata({ full_name: clean });
}

/**
 * Save the profile photo: an uploaded file (resized on the device, then stored in the media bucket under avatars/),
 * an image URL, or null to remove it.
 */
export async function saveProfileAvatar(user: User, avatar: { file: File } | { url: string | null }): Promise<User> {
  let url: string | null;
  if ("file" in avatar) {
    if (!avatar.file.type.startsWith("image/")) throw new Error("Hanya berkas gambar yang didukung.");
    if (avatar.file.size > MAX_AVATAR_BYTES) throw new Error("Ukuran gambar melebihi 5 MB.");
    const [{ resizeImageFile }, { uploadImage }] = await Promise.all([import("@/lib/cropImage"), import("@/lib/adminDb")]);
    const blob = await resizeImageFile(avatar.file, 320, 0.88);
    if (!blob) throw new Error("Gambar tidak dapat dibaca.");
    url = await uploadImage(blob, user.id, "avatars");
  } else {
    url = avatar.url?.trim() || null;
    if (url && !/^https:\/\/\S+$/i.test(url)) throw new Error("URL gambar harus diawali https://");
  }
  return updateMetadata({ avatar_url: url });
}

export async function signOutUser(): Promise<void> {
  const { supabase } = await import("@/lib/supabase");
  await supabase.auth.signOut();
}
