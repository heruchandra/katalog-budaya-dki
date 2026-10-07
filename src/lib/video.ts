/** YouTube video id from a watch / youtu.be / embed / shorts URL */
export const youTubeId = (url?: string | null) =>
  url?.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/)?.[1] ?? null;

/** A video file the browser plays itself: a site path (e.g. /images/musik/<slug>/video/video.mp4) or a .mp4 / .webm URL */
export const isVideoFile = (url?: string | null) =>
  !!url && (url.startsWith("/") || /\.(mp4|webm|ogv|ogg|mov|m4v)(?:[?#]|$)/i.test(url));
