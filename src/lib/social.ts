import type { SosialMedia, SosialPlatform } from "@/types/musik";

const handleFromUrl = (platform: SosialPlatform, url: string): string => {
  try {
    const first = new URL(url).pathname.split("/").filter(Boolean)[0];
    if (!first) return url;
    const segment = decodeURIComponent(first);
    // Instagram / TikTok handles are shown with "@"; Facebook pages and YouTube paths as they are
    return platform === "instagram" || platform === "tiktok" ? `@${segment.replace(/^@/, "")}` : segment;
  } catch {
    return url;
  }
};

/**
 * A social account as entered in the admin form ("@handle", a bare handle or a full profile URL) → the handle to
 * show and the link. A name that isn't a handle (has spaces) links to the platform's search for it, marked
 * `isSearch` (Instagram has no search URL, so it is shown without a link). Empty input → null.
 */
export function socialFromInput(platform: SosialPlatform, raw?: string | null): SosialMedia | null {
  const value = (raw || "").trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return { platform, handle: handleFromUrl(platform, value), url: value };

  const bare = value.replace(/^@/, "");
  const isHandle = !/\s/.test(bare);
  switch (platform) {
    case "instagram":
      return isHandle ? { platform, handle: `@${bare}`, url: `https://www.instagram.com/${bare}` } : { platform, handle: value };
    case "tiktok":
      return isHandle
        ? { platform, handle: `@${bare}`, url: `https://www.tiktok.com/@${bare}` }
        : { platform, handle: value, url: `https://www.tiktok.com/search?q=${encodeURIComponent(value)}`, isSearch: true };
    case "youtube":
      return isHandle && value.startsWith("@")
        ? { platform, handle: value, url: `https://www.youtube.com/${value}` }
        : { platform, handle: value, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(value)}`, isSearch: true };
    case "facebook":
      return isHandle
        ? { platform, handle: bare, url: `https://www.facebook.com/${bare}` }
        : { platform, handle: value, url: `https://www.facebook.com/search/top?q=${encodeURIComponent(value)}`, isSearch: true };
  }
}
