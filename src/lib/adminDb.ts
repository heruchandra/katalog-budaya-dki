import { supabase } from "@/lib/supabase";

/** Public storage bucket for images uploaded in the admin panel */
export const MEDIA_BUCKET = "katalog-media";

/** Column names of a table, read from an existing row (null when the table is empty or unreadable). */
export async function getTableColumns(table: string): Promise<Set<string> | null> {
  const { data, error } = await supabase.from(table).select("*").limit(1);
  if (error || !data || data.length === 0) return null;
  return new Set(Object.keys(data[0]));
}

/** Upload a file to `<folder>/` in the media bucket and return its public URL (`what` names it in the error). */
async function uploadFile(blob: Blob, prefix: string, folder: string, what: string, fallbackExt: string): Promise<string> {
  const ext = blob.type.split("/")[1] || fallbackExt;
  const path = `${folder}/${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, { contentType: blob.type, upsert: false });
  if (error) {
    throw new Error(`Gagal mengunggah ${what} ke bucket "${MEDIA_BUCKET}": ${error.message}`);
  }
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Upload a cropped/resized image to `<folder>/` in the media bucket and return its public URL. */
export const uploadImage = (blob: Blob, prefix: string, folder = "sanggar") => uploadFile(blob, prefix, folder, "gambar", "jpg");

/** Upload a video file (.mp4 / .webm) to `<folder>/` in the media bucket and return its public URL. */
export const uploadVideo = (file: Blob, prefix: string, folder: string) => uploadFile(file, prefix, folder, "video", "mp4");

export interface SaveResult {
  id: number | string;
  /** Columns that could not be saved because they don't exist in the database yet */
  skipped: string[];
}

/**
 * Insert (id null) or update a row. Columns missing from the database are left out (and reported) instead of
 * failing the whole save, so a form works before and after its migration is applied.
 */
export async function saveRow(
  table: string,
  id: number | string | null,
  payload: Record<string, unknown>,
  knownColumns: Set<string> | null
): Promise<SaveResult> {
  const body = { ...payload };
  const skipped: string[] = [];

  if (knownColumns) {
    for (const column of Object.keys(body)) {
      if (!knownColumns.has(column)) {
        delete body[column];
        skipped.push(column);
      }
    }
  }

  // Safety net when columns couldn't be detected up front: drop the column PostgREST rejects and retry
  for (let attempt = 0; attempt < 40; attempt++) {
    const query = id === null
      ? supabase.from(table).insert([body]).select("id").single()
      : supabase.from(table).update(body).eq("id", id).select("id").single();
    const { data, error } = await query;

    if (!error) return { id: data?.id ?? id!, skipped };

    const missing = error.code === "PGRST204" ? /'([^']+)' column/.exec(error.message)?.[1] : undefined;
    if (missing && missing in body) {
      delete body[missing];
      skipped.push(missing);
      continue;
    }
    throw new Error(error.message);
  }
  throw new Error("Gagal menyimpan data.");
}

export async function deleteRow(table: string, id: number | string): Promise<void> {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
