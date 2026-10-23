/** YouTube video id from a watch / youtu.be / embed / shorts URL */
export const youTubeId = (url?: string | null) =>
  url?.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/)?.[1] ?? null;

/** The admin forms' video value: a link / stored URL, or a picked file uploaded on save (then `url` is unused) */
export interface VideoValue {
  url: string;
  file: File | null;
}

/** Video files the admin can upload, and their size limit (Supabase's free plan accepts up to 50 MB per file) */
export const VIDEO_UPLOAD_TYPES = ["video/mp4", "video/webm"];
export const VIDEO_UPLOAD_MAX_MB = 50;

/** A video file the browser plays itself: a site path (e.g. /images/musik/<slug>/video/video.mp4) or a .mp4 / .webm URL */
export const isVideoFile = (url?: string | null) =>
  !!url && (url.startsWith("/") || /\.(mp4|webm|ogv|ogg|mov|m4v)(?:[?#]|$)/i.test(url));
