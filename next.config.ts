import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Supabase project: data (REST), auth, storage uploads from the browser, and stored images
const SUPABASE_HOST = "joxaqcpltkclanmddknq.supabase.co";

/** Builds a CSP header value from directive -> sources, skipping empty entries */
const buildCsp = (directives: Record<string, (string | false)[]>) =>
  Object.entries(directives)
    .map(([directive, sources]) => [directive, ...sources.filter(Boolean)].join(" "))
    .join("; ");

// Vercel Toolbar (comments/feedback) is injected on preview deployments only, so its origins are allowed only there
const isVercelPreview = process.env.VERCEL_ENV === "preview";

/**
 * Content-Security-Policy, set here rather than with per-request nonces so pages stay statically prerendered
 * (see "Without Nonces" in the Next.js CSP guide): Next.js's inline bootstrap/RSC scripts therefore need
 * 'unsafe-inline'. 'unsafe-eval' is development-only (React's dev tooling); production never uses eval.
 * Fonts are self-hosted by next/font, so no Google Fonts origins are needed.
 */
const contentSecurityPolicy = buildCsp({
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    isDev && "'unsafe-eval'",
    "https://va.vercel-scripts.com", // Vercel Analytics / Speed Insights (production serves them from /_vercel, i.e. 'self')
    isVercelPreview && "https://vercel.live",
  ],
  // 'unsafe-inline': style attributes rendered by React/next/image and styles injected by components
  "style-src": ["'self'", "'unsafe-inline'", isVercelPreview && "https://vercel.live"],
  // data: inline SVG backgrounds, blob: local previews of images being cropped/uploaded in the admin,
  // https: profile photos given as an image URL (or from the sign-in provider) can be hosted anywhere
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https:",
    `https://${SUPABASE_HOST}`,
    isVercelPreview && "https://vercel.live",
    isVercelPreview && "https://vercel.com",
  ],
  "font-src": ["'self'", isVercelPreview && "https://vercel.live", isVercelPreview && "https://assets.vercel.com"],
  "connect-src": [
    "'self'",
    `https://${SUPABASE_HOST}`,
    `wss://${SUPABASE_HOST}`,
    "https://vitals.vercel-insights.com",
    isVercelPreview && "https://vercel.live",
    isVercelPreview && "wss://ws-us3.pusher.com",
  ],
  // performance videos: site files, videos uploaded to Supabase Storage, and blob: previews of a file picked in the admin
  "media-src": ["'self'", "blob:", `https://${SUPABASE_HOST}`],
  // Google Maps embeds (sanggar + seniman musik detail pages) and the seniman musik video slot (YouTube, no-cookie)
  "frame-src": [
    "https://maps.google.com",
    "https://www.google.com",
    "https://www.youtube-nocookie.com",
    isVercelPreview && "https://vercel.live",
  ],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  // Not in development, so the dev server can still be previewed inside an editor's embedded browser
  ...(isDev ? {} : { "frame-ancestors": ["'none'"] }),
  // Only where the site is served over HTTPS (Vercel); locally it would upgrade http://localhost requests
  ...(process.env.VERCEL ? { "upgrade-insecure-requests": [] } : {}),
});

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Clickjacking protection for browsers without CSP frame-ancestors (relaxed in development, see above)
  ...(isDev ? [] : [{ key: "X-Frame-Options", value: "DENY" }]),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Legacy header: modern browsers ignore it (CSP is what protects against XSS)
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Ignored by browsers over plain http (e.g. localhost)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: SUPABASE_HOST,
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/seniman-musik',
        destination: '/pemusik',
      },
      {
        source: '/seniman',
        destination: '/pemusik',
      },
    ];
  },
};

export default nextConfig;
